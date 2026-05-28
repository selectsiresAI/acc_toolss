import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Download, Upload, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

export default function TranslationBatch() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const [sourceJson, setSourceJson] = useState("");
  const [targetLocale, setTargetLocale] = useState("en-US");
  const [translatedJson, setTranslatedJson] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [stats, setStats] = useState<{ sourceKeyCount: number; targetKeyCount: number } | null>(null);

  const handleTranslate = async () => {
    if (!sourceJson.trim()) {
      toast.error(isEs ? "Por favor, ingrese el JSON de origen" : isEn ? "Please enter the source JSON" : "Por favor, insira o JSON de origem");
      return;
    }

    try {
      // Validate JSON
      JSON.parse(sourceJson);
    } catch (error) {
      toast.error(isEs ? "JSON inválido. Verifique la sintaxis." : isEn ? "Invalid JSON. Check the syntax." : "JSON inválido. Verifique a sintaxe.");
      return;
    }

    setIsTranslating(true);
    setTranslatedJson("");
    setStats(null);

    try {
      const { data, error } = await supabase.functions.invoke('translate-i18n', {
        body: {
          sourceJson: JSON.parse(sourceJson),
          targetLocale,
        },
      });

      if (error) {
        if (error.message.includes("429")) {
          toast.error(isEs ? "Límite de solicitudes excedido. Espere algunos minutos." : isEn ? "Request limit exceeded. Wait a few minutes." : "Limite de requisições excedido. Aguarde alguns minutos.");
        } else if (error.message.includes("402")) {
          toast.error(isEs ? "Créditos insuficientes. Agregue créditos en el workspace Lovable." : isEn ? "Insufficient credits. Add credits in the Lovable workspace." : "Créditos insuficientes. Adicione créditos no workspace Lovable.");
        } else {
          toast.error((isEs ? "Error al traducir: " : isEn ? "Translation error: " : "Erro ao traduzir: ") + error.message);
        }
        return;
      }

      if (data.success) {
        setTranslatedJson(JSON.stringify(data.translatedJson, null, 2));
        setStats({
          sourceKeyCount: data.sourceKeyCount,
          targetKeyCount: data.targetKeyCount,
        });
        toast.success(isEs ? "¡Traducción completada con éxito!" : isEn ? "Translation completed successfully!" : "Tradução concluída com sucesso!");
      } else {
        toast.error((isEs ? "Error al traducir: " : isEn ? "Translation error: " : "Erro ao traduzir: ") + (data.error || (isEs ? "Error desconocido" : isEn ? "Unknown error" : "Erro desconhecido")));
      }
    } catch (error: any) {
      console.error("Translation error:", error);
      toast.error((isEs ? "Error al llamar la función de traducción: " : isEn ? "Error calling translation function: " : "Erro ao chamar a função de tradução: ") + error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLoadExample = () => {
    const example = {
      "actions.delete": "Excluir",
      "actions.cancel": "Cancelar",
      "herd.delete.confirm.title": "Excluir animal(is)",
      "herd.delete.confirm.message": "Tem certeza que deseja excluir permanentemente o(s) animal(is) selecionado(s)? Esta ação não pode ser desfeita.",
    };
    setSourceJson(JSON.stringify(example, null, 2));
  };

  const handleDownloadTranslation = () => {
    if (!translatedJson) {
      toast.error(isEs ? "Ninguna traducción disponible para descargar" : isEn ? "No translation available for download" : "Nenhuma tradução disponível para download");
      return;
    }

    const blob = new Blob([translatedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${targetLocale}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(isEs ? "¡Archivo descargado!" : isEn ? "File downloaded!" : "Arquivo baixado!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSourceJson(content);
      toast.success(isEs ? "¡Archivo cargado!" : isEn ? "File loaded!" : "Arquivo carregado!");
    };
    reader.onerror = () => {
      toast.error(isEs ? "Error al leer el archivo" : isEn ? "Error reading the file" : "Erro ao ler o arquivo");
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEs ? "Traducción en Lote vía IA" : isEn ? "AI Batch Translation" : "Tradução em Lote via IA"}</CardTitle>
          <CardDescription>
            {isEs ? "Use Lovable AI para traducir archivos JSON de i18n automáticamente" : isEn ? "Use Lovable AI to automatically translate i18n JSON files" : "Use Lovable AI para traduzir arquivos JSON de i18n automaticamente"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Languages className="h-4 w-4" />
            <AlertDescription>
              <strong>{isEs ? "Instrucciones:" : isEn ? "Instructions:" : "Instruções:"}</strong> {isEs ? "La IA preservará automáticamente todos los términos técnicos (PTAs, NAABs) y traducirá solo el texto natural. Ideal para traducir strings de interfaz de usuario." : isEn ? "AI will automatically preserve all technical terms (PTAs, NAABs) and translate only natural text. Ideal for translating user interface strings." : "A IA preservará automaticamente todos os termos técnicos (PTAs, NAABs) e traduzirá apenas o texto natural. Ideal para traduzir strings de interface do usuário."}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{isEs ? "JSON de Origen (pt-BR)" : isEn ? "Source JSON (pt-BR)" : "JSON de Origem (pt-BR)"}</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadExample}
                  >
                    {isEs ? "Cargar Ejemplo" : isEn ? "Load Example" : "Carregar Exemplo"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload JSON
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <Textarea
                value={sourceJson}
                onChange={(e) => setSourceJson(e.target.value)}
                placeholder='{"key": "value"}'
                className="font-mono text-sm min-h-[400px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{isEs ? `JSON Traducido (${targetLocale})` : isEn ? `Translated JSON (${targetLocale})` : `JSON Traduzido (${targetLocale})`}</label>
                {translatedJson && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTranslation}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
              <Textarea
                value={translatedJson}
                readOnly
                placeholder={isEs ? "La traducción aparecerá aquí..." : isEn ? "Translation will appear here..." : "A tradução aparecerá aqui..."}
                className="font-mono text-sm min-h-[400px] bg-muted"
              />
            </div>
          </div>

          {stats && (
            <div className="flex gap-4 justify-center">
              <Badge variant="secondary">
                {stats.sourceKeyCount} {isEs ? "claves de origen" : isEn ? "source keys" : "chaves de origem"}
              </Badge>
              <Badge variant="secondary">
                {stats.targetKeyCount} {isEs ? "claves traducidas" : isEn ? "translated keys" : "chaves traduzidas"}
              </Badge>
            </div>
          )}

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">{isEs ? "Idioma de Destino" : isEn ? "Target Language" : "Idioma de Destino"}</label>
              <select
                value={targetLocale}
                onChange={(e) => setTargetLocale(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceJson.trim()}
              className="mt-6"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEs ? "Traduciendo..." : isEn ? "Translating..." : "Traduzindo..."}
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  {isEs ? "Traducir con IA" : isEn ? "Translate with AI" : "Traduzir com IA"}
                </>
              )}
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-sm text-muted-foreground">
              <strong>{isEs ? "Consejo:" : isEn ? "Tip:" : "Dica:"}</strong> {isEs ? "Después de la traducción, revise manualmente los términos técnicos para asegurarse de que no fueron alterados. La IA está instruida para preservar PTAs y términos técnicos, pero siempre verifique el resultado." : isEn ? "After translation, manually review technical terms to ensure they were not altered. AI is instructed to preserve PTAs and technical terms, but always verify the result." : "Após a tradução, revise manualmente os termos técnicos para garantir que não foram alterados. A IA é instruída a preservar PTAs e termos técnicos, mas sempre verifique o resultado."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}