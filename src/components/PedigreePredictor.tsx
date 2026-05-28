import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  usePedigreeStore,
  PTA_DEFINITIONS,
  formatPTAValue,
  predictFromPedigree,
  validateNaabs,
  getBullFromCache,
  Bull,
  BatchInput,
  BatchResult
} from '@/hooks/usePedigreeStore';
import { Calculator, Upload, Download } from 'lucide-react';
import { utils, writeFileXLSX } from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { parseUniversalSpreadsheet } from '@/utils/headerNormalizer';
import { useTranslation } from "@/hooks/useTranslation";

type BatchResultColumn = {
  header: string;
  render: (result: BatchResult) => React.ReactNode;
  exportValue: (result: BatchResult) => string;
};

function getBatchResultBaseColumns(locale: string): BatchResultColumn[] {
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  return [
    {
      header: isEs ? 'ID_Finca' : isEn ? 'Farm_ID' : 'ID_Fazenda',
      render: (result) => result.idFazenda || '—',
      exportValue: (result) => result.idFazenda || '—'
    },
    {
      header: isEs ? 'Nombre' : isEn ? 'Name' : 'Nome',
      render: (result) => result.nome || '—',
      exportValue: (result) => result.nome || '—'
    },
    {
      header: isEs ? 'Fecha_de_Nacimiento' : isEn ? 'Birth_Date' : 'Data_de_Nascimento',
      render: (result) => result.dataNascimento || '—',
      exportValue: (result) => result.dataNascimento || '—'
    },
    {
      header: 'naab_pai',
      render: (result) => result.naabPai || '—',
      exportValue: (result) => result.naabPai || '—'
    },
    {
      header: 'naab_avo_materno',
      render: (result) => result.naabAvoMaterno || '—',
      exportValue: (result) => result.naabAvoMaterno || '—'
    },
    {
      header: 'naab_bisavo_materno',
      render: (result) => result.naabBisavoMaterno || '—',
      exportValue: (result) => result.naabBisavoMaterno || '—'
    },
    {
      header: 'Status',
      render: (result) => (
        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
          {result.status === 'success' ? (isEs ? 'Válido' : isEn ? 'Valid' : 'Válido') : (isEs ? 'Error' : isEn ? 'Error' : 'Erro')}
        </Badge>
      ),
      exportValue: (result) => (result.status === 'success' ? (isEs ? 'Válido' : isEn ? 'Valid' : 'Válido') : (isEs ? 'Error' : isEn ? 'Error' : 'Erro'))
    },
    {
      header: isEs ? 'Errores' : isEn ? 'Errors' : 'Erros',
      render: (result) => (result.errors?.length ? result.errors.join('; ') : '—'),
      exportValue: (result) => (result.errors?.length ? result.errors.join('; ') : '—')
    }
  ];
}

// Estado para armazenar dados do ToolSSApp - idêntico ao ProjecaoGenetica
interface ToolSSBull {
  naab: string;
  nome: string;
  empresa?: string;
  TPI: number;
  "NM$": number;
  Milk: number;
  Fat: number;
  Protein: number;
  SCS: number;
  PTAT: number;
  DPR?: number;
  [key: string]: any;
}

interface ToolSSClient {
  id: number;
  nome: string;
  farms: Array<{
    id: string;
    nome: string;
    bulls: ToolSSBull[];
    females: any[];
  }>;
}

// Estado global para dados do ToolSS (não mais necessário com Supabase)
// let toolssClients: ToolSSClient[] = [];

// Função anterior que carregava do localStorage (não mais necessária)
// const loadToolSSData = () => {
//   // Replaced by direct Supabase queries in fetchBullFromDatabase
//   console.log('🔄 loadToolSSData não é mais necessária - usando Supabase diretamente');
//   return [];
// };

// Function to clear localStorage and force reload
// Função para limpar cache antigo (não mais necessária com Supabase)
const clearAndReloadData = () => {
  alert('Agora usando dados direto do Supabase! Dados sempre atualizados.');
};

// Função de busca de touro via Supabase bulls_denorm
const fetchBullFromDatabase = async (naab: string): Promise<Bull | null> => {
  const cleanNaab = naab.toUpperCase().trim();
  
  try {
    const { data, error } = await supabase
      .rpc('get_bulls_denorm')
      .eq('code', cleanNaab)
      .single();

    if (error) {
      return null;
    }

    if (data) {
      
      // Converter dados do Supabase para o formato Bull
      const bullData = data as any;
      const convertedBull: Bull = {
        naab: bullData.code,
        name: bullData.name || 'N/A',
        company: bullData.company || 'N/A',
        ptas: {
          // Índices Econômicos
          hhp_dollar: bullData.hhp_dollar ?? null,
          tpi: bullData.tpi ?? null,
          nm_dollar: bullData.nm_dollar ?? null,
          cm_dollar: bullData.cm_dollar ?? null,
          fm_dollar: bullData.fm_dollar ?? null,
          gm_dollar: bullData.gm_dollar ?? null,
          f_sav: bullData.f_sav ?? null,
          
          // Produção de Leite
          milk: bullData.ptam ?? null, // PTAM = Milk in Supabase
          fat: bullData.ptaf ?? null,
          protein: bullData.ptap ?? null,
          ptam: bullData.ptam ?? null,
          cfp: bullData.cfp ?? null,
          ptaf: bullData.ptaf ?? null,
          ptaf_pct: bullData.ptaf_pct ?? null,
          ptap: bullData.ptap ?? null,
          ptap_pct: bullData.ptap_pct ?? null,
          pl: bullData.pl ?? null,
          
          // Fertilidade
          dpr: bullData.dpr ?? null,
          
          // Saúde e Longevidade
          liv: bullData.liv ?? null,
          scs: bullData.scs ?? null,
          mast: bullData.mast ?? null,
          met: bullData.met ?? null,
          rp: bullData.rp ?? null,
          da: bullData.da ?? null,
          ket: bullData.ket ?? null,
          mf: bullData.mf ?? null,
          
          // Conformação
          ptat: bullData.ptat ?? null,
          udc: bullData.udc ?? null,
          flc: bullData.flc ?? null,
          sce: bullData.sce ?? null,
          dce: bullData.dce ?? null,
          ssb: bullData.ssb ?? null,
          dsb: bullData.dsb ?? null,
          h_liv: bullData.h_liv ?? null,
          
          // Reprodução
          ccr: bullData.ccr ?? null,
          hcr: bullData.hcr ?? null,
          
          // Outras características
          fi: bullData.fi ?? null,
          bwc: bullData.bwc ?? null,
          
          // Conformação Detalhada
          sta: bullData.sta ?? null,
          str: bullData.str ?? null,
          dfm: bullData.dfm ?? null,
          rua: bullData.rua ?? null,
          rls: bullData.rls ?? null,
          rtp: bullData.rtp ?? null,
          ftl: bullData.ftl ?? null,
          rw: bullData.rw ?? null,
          rlr: bullData.rlr ?? null,
          fta: bullData.fta ?? null,
          fls: bullData.fls ?? null,
          fua: bullData.fua ?? null,
          ruh: bullData.ruh ?? null,
          ruw: bullData.ruw ?? null,
          ucl: bullData.ucl ?? null,
          udp: bullData.udp ?? null,
          ftp: bullData.ftp ?? null,
          
          // Eficiência Alimentar
          rfi: bullData.rfi ?? null,
          gfi: bullData.gfi ?? null
        }
      };
      
      return convertedBull;
    }
  } catch (error) {
    console.error('Erro ao buscar touro no Supabase:', error);
  }
  
  return null;
};

const PedigreePredictor: React.FC = () => {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const BATCH_RESULT_BASE_COLUMNS = getBatchResultBaseColumns(locale);
  const { toast } = useToast();
  const { 
    pedigreeInput,
    bullsCache,
    predictionResult,
    isCalculating,
    setPedigreeInput,
    setBullCache,
    setPredictionResult,
    setIsCalculating,
    clearPrediction
  } = usePedigreeStore();

  // Remove carregamento do localStorage - usando Supabase diretamente
  // Using Supabase directly - no localStorage loading needed

  // Handle NAAB input changes with automatic PTA loading (PROCV functionality)
  const handleNaabChange = async (naabType: 'sireNaab' | 'mgsNaab' | 'mmgsNaab', value: string) => {
    setPedigreeInput({ [naabType]: value.toUpperCase() });
    
    // If NAAB is 9+ characters, try to load bull data automatically
    if (value.length >= 9) {
      const bull = await fetchBullFromDatabase(value);
      if (bull) {
        setBullCache(value, bull);
        toast({
          title: isEs ? "PTAs cargadas automáticamente!" : isEn ? "PTAs loaded automatically!" : "PTAs carregadas automaticamente!",
          description: isEs ? `${bull.name} (${bull.company}) - Todas las PTAs fueron cargadas` : isEn ? `${bull.name} (${bull.company}) - All PTAs were loaded` : `${bull.name} (${bull.company}) - Todas as PTAs foram carregadas`,
        });
      }
    }
  };

  const [selectedTab, setSelectedTab] = useState<'individual' | 'batch'>('individual');

  const handleGeneratePrediction = () => {
    if (!pedigreeInput.sireNaab.trim()) {
      toast({
        title: isEs ? "Error" : isEn ? "Error" : "Erro",
        description: isEs ? "Ingrese el NAAB del padre para generar la predicción." : isEn ? "Enter the sire NAAB to generate the prediction." : "Digite o NAAB do pai para gerar a predição.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    const errors = validateNaabs(pedigreeInput);
    
    if (errors.length > 0) {
      toast({
        title: isEs ? "Error de Validación" : isEn ? "Validation Error" : "Erro de Validação",
        description: errors.join('\n'),
        variant: "destructive",
      });
      setIsCalculating(false);
      return;
    }

    // Get bulls from cache
    const sire = getBullFromCache(pedigreeInput.sireNaab, bullsCache);
    const mgs = getBullFromCache(pedigreeInput.mgsNaab, bullsCache);
    const mmgs = getBullFromCache(pedigreeInput.mmgsNaab, bullsCache);

    if (!sire) {
      toast({
        title: isEs ? "Error" : isEn ? "Error" : "Erro",
        description: isEs ? "Datos del padre no encontrados. Verifique el NAAB." : isEn ? "Sire data not found. Check the NAAB." : "Dados do pai não encontrados. Verifique o NAAB.",
        variant: "destructive",
      });
      setIsCalculating(false);
      return;
    }

    const predictedPTAs = predictFromPedigree(sire, mgs, mmgs);

    setPredictionResult({
      predictedPTAs,
      sire,
      mgs,
      mmgs
    });
    
    setIsCalculating(false);
    
    toast({
      title: isEs ? "Predicción Generada!" : isEn ? "Prediction Generated!" : "Predição Gerada!",
      description: isEs ? "Las PTAs de la hija fueron calculadas basadas en el pedigrí." : isEn ? "The daughter's PTAs were calculated based on the pedigree." : "As PTAs da filha foram calculadas baseadas no pedigree.",
    });
  };

  const handleReset = () => {
    setPedigreeInput({ sireNaab: '', mgsNaab: '', mmgsNaab: '' });
    setPredictionResult(null);
    
    toast({
      title: isEs ? "Datos Borrados" : isEn ? "Data Cleared" : "Dados Limpos",
      description: isEs ? "Todos los campos fueron restablecidos." : isEn ? "All fields were reset." : "Todos os campos foram resetados.",
    });
  };

  // Batch processing state
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBatchFile(file);
      setBatchResults([]);
    }
  };

  const processBatchFile = async () => {
    if (!batchFile) return;

    setIsProcessing(true);
    
    try {
      const jsonData = await parseUniversalSpreadsheet(batchFile);

      const results: BatchResult[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];

        const input: BatchInput = {
          idFazenda: row.idFazenda || '',
          nome: row.Nome || '',
          dataNascimento: row.dataNascimento || '',
          naabPai: row.naabPai || '',
          naabAvoMaterno: row.naabAvoMaterno || '',
          naabBisavoMaterno: row.naabBisavoMaterno || ''
        };
        
        // Clean up NAAB codes (remove any extra spaces and ensure they're valid)
        input.naabPai = input.naabPai?.toString().trim() || '';
        input.naabAvoMaterno = input.naabAvoMaterno?.toString().trim() || '';
        input.naabBisavoMaterno = input.naabBisavoMaterno?.toString().trim() || '';

        const pedigreeData = {
          sireNaab: input.naabPai,
          mgsNaab: input.naabAvoMaterno,
          mmgsNaab: input.naabBisavoMaterno
        };

        const errors = validateNaabs(pedigreeData);
        
        if (errors.length === 0) {
          // Try to get from cache first, if not found, fetch from Supabase
          let sire = getBullFromCache(input.naabPai, bullsCache);
          let mgs = getBullFromCache(input.naabAvoMaterno, bullsCache);
          let mmgs = getBullFromCache(input.naabBisavoMaterno, bullsCache);
          
          // Fetch missing bulls from Supabase
          if (!sire && input.naabPai) {
            sire = await fetchBullFromDatabase(input.naabPai);
            if (sire) {
              setBullCache(input.naabPai, sire);
            }
          }

          if (!mgs && input.naabAvoMaterno) {
            mgs = await fetchBullFromDatabase(input.naabAvoMaterno);
            if (mgs) {
              setBullCache(input.naabAvoMaterno, mgs);
            }
          }

          if (!mmgs && input.naabBisavoMaterno) {
            mmgs = await fetchBullFromDatabase(input.naabBisavoMaterno);
            if (mmgs) {
              setBullCache(input.naabBisavoMaterno, mmgs);
            }
          }
          
          if (sire) {
            const predictedPTAs = predictFromPedigree(sire, mgs, mmgs);
            
            results.push({
              ...input,
              status: 'success',
              predictedPTAs
            });
          } else {
            results.push({
              ...input,
              status: 'error',
              errors: [isEs ? `Padre con NAAB ${input.naabPai} no encontrado en la base de datos` : isEn ? `Sire with NAAB ${input.naabPai} not found in database` : `Pai com NAAB ${input.naabPai} não encontrado no banco de dados`]
            });
          }
        } else {
          results.push({
            ...input,
            status: 'error',
            errors
          });
        }
      }
      
      setBatchResults(results);
      
      toast({
        title: isEs ? "Procesamiento Completado!" : isEn ? "Processing Complete!" : "Processamento Concluído!",
        description: isEs ? `${results.length} líneas procesadas.` : isEn ? `${results.length} rows processed.` : `${results.length} linhas processadas.`,
      });
      
    } catch (error) {
      toast({
        title: isEs ? "Error en el Procesamiento" : isEn ? "Processing Error" : "Erro no Processamento",
        description: isEs ? "Error al procesar el archivo. Verifique el formato." : isEn ? "Error processing file. Check the format." : "Erro ao processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportBatchResults = () => {
    if (batchResults.length === 0) return;

    const headers = [
      ...BATCH_RESULT_BASE_COLUMNS.map((column) => column.header),
      ...PTA_DEFINITIONS.map(({ label }) => label)
    ];

    const rows = batchResults.map((result) => ([
      ...BATCH_RESULT_BASE_COLUMNS.map((column) => column.exportValue(result)),
      ...PTA_DEFINITIONS.map(({ key }) => formatPTAValue(key, result.predictedPTAs?.[key] ?? null))
    ]));

    const worksheet = utils.aoa_to_sheet([
      headers,
      ...rows
    ]);
    
    // Aplicar formatação de datas
    import('@/lib/excel-date-formatter').then(({ autoFormatDateColumns }) => {
      autoFormatDateColumns(worksheet, headers);
    });
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, isEs ? 'Predicciones' : isEn ? 'Predictions' : 'Predições');

    writeFileXLSX(workbook, `predicoes_pedigree_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: isEs ? "Archivo Exportado!" : isEn ? "File Exported!" : "Arquivo Exportado!",
      description: isEs ? "Las predicciones fueron exportadas a Excel." : isEn ? "Predictions were exported to Excel." : "As predições foram exportadas para Excel.",
    });
  };

  // Calculate the displayed PTAs based on current prediction result
  const displayedPTAs = useMemo(() => {
    if (!predictionResult) return [];

    return PTA_DEFINITIONS.map(({ label, key }) => ({
      label,
      key,
      sire: predictionResult.sire?.ptas?.[key] ?? null,
      mgs: predictionResult.mgs?.ptas?.[key] ?? null,
      mmgs: predictionResult.mmgs?.ptas?.[key] ?? null,
      daughter: predictionResult.predictedPTAs?.[key] ?? null
    }));
  }, [predictionResult]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calculator className="w-8 h-8" />
            {isEs ? "Nexus 2: Predicción por Pedigrí" : isEn ? "Nexus 2: Pedigree Prediction" : "Nexus 2: Predição por Pedigree"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEs ? "Basado en el pedigrí - Padre (57%) + Abuelo Materno (28%) + Bisabuelo Materno (15%)" : isEn ? "Based on pedigree - Sire (57%) + MGS (28%) + MMGS (15%)" : "Baseado no pedigree - Pai (57%) + Avô Materno (28%) + Bisavô Materno (15%)"}
          </p>
        </div>
        <Button 
          onClick={clearAndReloadData}
          variant="outline"
          className="text-sm"
        >
          {isEs ? "Limpiar localStorage" : isEn ? "Clear localStorage" : "Limpar localStorage"}
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'individual' | 'batch')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">{isEs ? "Predicción Individual" : isEn ? "Individual Prediction" : "Predição Individual"}</TabsTrigger>
          <TabsTrigger value="batch">{isEs ? "Procesamiento en Lote" : isEn ? "Batch Processing" : "Processamento em Lote"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEs ? "Datos del Pedigrí" : isEn ? "Pedigree Data" : "Dados do Pedigree"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sire">{isEs ? "NAAB del Padre (57%)" : isEn ? "Sire NAAB (57%)" : "NAAB do Pai (57%)"}</Label>
                  <Input
                    id="sire"
                    value={pedigreeInput.sireNaab}
                    onChange={(e) => handleNaabChange('sireNaab', e.target.value)}
                    placeholder="Ex: 007HO17508"
                    className="font-mono"
                  />
                  <Badge variant="secondary" className="text-xs">{isEs ? "Obligatorio" : isEn ? "Required" : "Obrigatório"}</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mgs">{isEs ? "NAAB del Abuelo Materno (28%)" : isEn ? "MGS NAAB (28%)" : "NAAB do Avô Materno (28%)"}</Label>
                  <Input
                    id="mgs"
                    value={pedigreeInput.mgsNaab}
                    onChange={(e) => handleNaabChange('mgsNaab', e.target.value)}
                    placeholder="Ex: 007HO15225"
                    className="font-mono"
                  />
                  <Badge variant="outline" className="text-xs">{isEs ? "Opcional" : isEn ? "Optional" : "Opcional"}</Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mmgs">{isEs ? "NAAB del Bisabuelo Materno (15%)" : isEn ? "MMGS NAAB (15%)" : "NAAB do Bisavô Materno (15%)"}</Label>
                  <Input
                    id="mmgs"
                    value={pedigreeInput.mmgsNaab}
                    onChange={(e) => handleNaabChange('mmgsNaab', e.target.value)}
                    placeholder="Ex: 007HO12345"
                    className="font-mono"
                  />
                  <Badge variant="outline" className="text-xs">{isEs ? "Opcional" : isEn ? "Optional" : "Opcional"}</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGeneratePrediction} disabled={isCalculating} className="flex-1">
                  <Calculator className="w-4 h-4 mr-2" />
                  {isCalculating ? (isEs ? 'Calculando...' : isEn ? 'Calculating...' : 'Calculando...') : (isEs ? 'Calcular PTAs de la Hija' : isEn ? 'Calculate Daughter PTAs' : 'Calcular PTAs da Filha')}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  {isEs ? "Limpiar" : isEn ? "Clear" : "Limpar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {displayedPTAs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{isEs ? "Predicciones de PTAs de la Hija" : isEn ? "Daughter PTA Predictions" : "Predições das PTAs da Filha"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">PTA</TableHead>
                        <TableHead className="text-center">{isEs ? "Padre (57%)" : isEn ? "Sire (57%)" : "Pai (57%)"}</TableHead>
                        <TableHead className="text-center">{isEs ? "Abuelo Mat. (28%)" : isEn ? "MGS (28%)" : "Avô Mat. (28%)"}</TableHead>
                        <TableHead className="text-center">{isEs ? "Bisabuelo Mat. (15%)" : isEn ? "MMGS (15%)" : "Bisavô Mat. (15%)"}</TableHead>
                        <TableHead className="text-center font-bold bg-primary/10">{isEs ? "Hija" : isEn ? "Daughter" : "Filha"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedPTAs.map((pta) => (
                        <TableRow key={pta.key}>
                          <TableCell className="font-medium">{pta.label}</TableCell>
                          <TableCell className="text-center">
                            {formatPTAValue(pta.key, pta.sire)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatPTAValue(pta.key, pta.mgs)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatPTAValue(pta.key, pta.mmgs)}
                          </TableCell>
                          <TableCell className="text-center font-bold bg-primary/5">
                            {formatPTAValue(pta.key, pta.daughter)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEs ? "Procesamiento en Lote" : isEn ? "Batch Processing" : "Processamento em Lote"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-file">{isEs ? "Archivo Excel o CSV (.xlsx, .xls, .xlsm, .csv)" : isEn ? "Excel or CSV file (.xlsx, .xls, .xlsm, .csv)" : "Arquivo Excel ou CSV (.xlsx, .xls, .xlsm, .csv)"}</Label>
                <Input
                  id="batch-file"
                  type="file"
                  accept=".xlsx,.xls,.xlsm,.csv"
                  onChange={handleFileUpload}
                />
                <p className="text-sm text-muted-foreground">
                  {isEs ? "El archivo debe contener las columnas: idFazenda, nome, dataNascimento, naabPai, naabAvoMaterno, naabBisavoMaterno" : isEn ? "The file must contain the columns: idFazenda, nome, dataNascimento, naabPai, naabAvoMaterno, naabBisavoMaterno" : "O arquivo deve conter as colunas: idFazenda, nome, dataNascimento, naabPai, naabAvoMaterno, naabBisavoMaterno"}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={processBatchFile} 
                  disabled={!batchFile || isProcessing}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? (isEs ? 'Procesando...' : isEn ? 'Processing...' : 'Processando...') : (isEs ? 'Procesar Archivo' : isEn ? 'Process File' : 'Processar Arquivo')}
                </Button>
                
                {batchResults.length > 0 && (
                  <Button onClick={exportBatchResults} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    {isEs ? "Exportar Resultados" : isEn ? "Export Results" : "Exportar Resultados"}
                  </Button>
                )}
              </div>
              
              {batchResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">{isEs ? "Resultados" : isEn ? "Results" : "Resultados"} ({batchResults.length} {isEs ? "animales" : isEn ? "animals" : "animais"})</h3>
                  <div className="max-h-96 overflow-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {BATCH_RESULT_BASE_COLUMNS.map((column) => (
                            <TableHead key={column.header}>{column.header}</TableHead>
                          ))}
                          {PTA_DEFINITIONS.map(({ label }) => (
                            <TableHead key={label}>{label}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchResults.slice(0, 10).map((result, index) => (
                          <TableRow key={index}>
                            {BATCH_RESULT_BASE_COLUMNS.map((column) => (
                              <TableCell key={column.header}>{column.render(result)}</TableCell>
                            ))}
                            {PTA_DEFINITIONS.map(({ key, label }) => (
                              <TableCell key={key}>{formatPTAValue(key, result.predictedPTAs?.[key] ?? null)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PedigreePredictor;