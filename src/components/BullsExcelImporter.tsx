import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { useTranslation } from "@/hooks/useTranslation";
import { normalizeRowHeaders } from "@/utils/headerNormalizer";

export function BullsExcelImporter() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState("");
  const { toast } = useToast();

  const processExcelFile = async (file: File) => {
    setImporting(true);
    setProgress(isEs ? "Leyendo archivo Excel..." : isEn ? "Reading Excel file..." : "Lendo arquivo Excel...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      const jsonData = rawData.map((row: any) => normalizeRowHeaders(row));

      setProgress(isEs ? `${jsonData.length} toros encontrados. Procesando...` : isEn ? `${jsonData.length} bulls found. Processing...` : `${jsonData.length} touros encontrados. Processando...`);

      // Convert to bulls format and insert
      const bulls = jsonData.map((row: any) => {
        // Helper to get first non-null value from multiple possible canonical keys
        const get = (...keys: string[]): any => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
          }
          return null;
        };
        const num = (...keys: string[]): number | null => {
          const v = get(...keys);
          if (v === null) return null;
          const n = parseFloat(v);
          return isNaN(n) ? null : n;
        };

        const rawBirthDate = get('dataNascimento', 'birth_date', 'Birth Date');
        const birthDate = rawBirthDate
          ? new Date(
              typeof rawBirthDate === "number"
                ? (rawBirthDate - 25569) * 86400 * 1000
                : rawBirthDate
            ).toISOString().split("T")[0]
          : null;

        return {
          naab_code: (get('Naab', 'naab_code', 'code') ?? '').toString(),
          code_normalized: (get('Naab', 'naab_code', 'code') ?? '').toString().trim().replace(/[\s-]/g, '').toUpperCase(),
          name: get('Nome', 'name') ?? '',
          registration: get('Registration', 'Reg Name', 'registration') ?? null,
          company: get('Empresa', 'company') ?? null,
          beta_casein: get('Beta-Casein', 'beta_casein') ?? null,
          kappa_casein: get('Kappa-Casein', 'kappa_casein') ?? null,
          birth_date: birthDate,
          tpi: num('TPI'),
          nm_dollar: num('NM$'),
          cm_dollar: num('CM$'),
          fm_dollar: num('FM$'),
          gm_dollar: num('GM$'),
          hhp_dollar: num('HHP$'),
          pta_milk: num('PTAM'),
          pta_fat: num('PTAF'),
          pta_fat_pct: num('PTAF%'),
          pta_protein: num('PTAP'),
          pta_protein_pct: num('PTAP%'),
          cfp: num('CFP'),
          pta_scs: num('SCS'),
          pta_pl: num('PL'),
          pta_dpr: num('DPR'),
          pta_livability: num('LIV'),
          gl: num('GL'),
          met: num('MET'),
          mast: num('MAST'),
          ket: num('KET'),
          pta_ccr: num('CCR'),
          pta_hcr: num('HCR'),
          fi: num('FI'),
          f_sav: num('F SAV'),
          rfi: num('RFI'),
          pta_ptat: num('PTAT'),
          pta_udc: num('UDC'),
          pta_flc: num('FLC'),
          bwc: num('BWC'),
          sta: num('STA'),
          str_num: num('STR'),
          dfm: num('DFM'),
          rua: num('RUA'),
          rls: num('RLS'),
          rlr: num('RLR'),
          rtp: num('RTP'),
          fls: num('FLS'),
          fua: num('FUA'),
          ruh: num('RUH'),
          ruw: num('RUW'),
          ucl: num('UCL'),
          udp: num('UDP'),
          ftp: num('FTP'),
          ftl: num('FTL'),
          fta: num('FTA'),
          rw: num('RW'),
          pta_sce: num('SCE'),
          pta_sire_sce: num('DCE'),
          ssb: num('SSB'),
          dsb: num('DSB'),
          h_liv: num('H LIV'),
          da: num('DA'),
          rp: num('RP'),
          gfi: num('GFI'),
          mf_num: num('MF'),
          pedigree: get('Pedigree') ?? null,
        };
      });

      setProgress(isEs ? "Insertando toros en la base de datos..." : isEn ? "Inserting bulls into the database..." : "Inserindo touros no banco de dados...");

      // Insert bulls in batches of 50
      const batchSize = 50;
      let inserted = 0;
      let updated = 0;

      for (let i = 0; i < bulls.length; i += batchSize) {
        const batch = bulls.slice(i, i + batchSize);

        const { error } = await supabase.from("bulls").upsert(batch, {
          onConflict: "naab_code",
          ignoreDuplicates: false,
        });

        if (error) {
          console.error("Erro ao inserir lote:", error);
          throw error;
        }

        inserted += batch.length;
        setProgress(isEs ? `${inserted} de ${bulls.length} toros procesados...` : isEn ? `${inserted} of ${bulls.length} bulls processed...` : `${inserted} de ${bulls.length} touros processados...`);
      }

      setProgress(isEs ? `✓ Importación completada! ${bulls.length} toros importados.` : isEn ? `✓ Import complete! ${bulls.length} bulls imported.` : `✓ Importação concluída! ${bulls.length} touros importados.`);

      toast({
        title: isEs ? "Importación completada!" : isEn ? "Import complete!" : "Importação concluída!",
        description: isEs ? `${bulls.length} toros fueron importados con éxito.` : isEn ? `${bulls.length} bulls were successfully imported.` : `${bulls.length} touros foram importados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro na importação:", error);
      toast({
        title: isEs ? "Error en la importación" : isEn ? "Import error" : "Erro na importação",
        description: error instanceof Error ? error.message : (isEs ? "Error desconocido" : isEn ? "Unknown error" : "Erro desconhecido"),
        variant: "destructive",
      });
      setProgress(isEs ? "Error en la importación" : isEn ? "Import error" : "Erro na importação");
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{isEs ? "Importar Toros desde Excel" : isEn ? "Import Bulls from Excel" : "Importar Touros do Excel"}</h2>
      <div className="space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls,.xlsm,.csv"
          onChange={handleFileUpload}
          disabled={importing}
          className="block w-full text-sm"
        />
        {progress && (
          <div className="text-sm text-muted-foreground">{progress}</div>
        )}
        {importing && (
          <div className="text-sm text-primary animate-pulse">
            {isEs ? "Procesando..." : isEn ? "Processing..." : "Processando..."}
          </div>
        )}
      </div>
    </Card>
  );
}
