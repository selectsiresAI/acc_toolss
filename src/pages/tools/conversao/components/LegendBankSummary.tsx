import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LegendEntry } from "../utils";
import { useTranslation } from "@/hooks/useTranslation";

interface LegendBankSummaryProps {
  userEntries: LegendEntry[];
  defaultEntries: LegendEntry[];
}

export const LegendBankSummary: React.FC<LegendBankSummaryProps> = ({ userEntries, defaultEntries }) => {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const total = userEntries.length + defaultEntries.length;
  const previewEntries = userEntries.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEs ? "Banco de nomenclaturas" : isEn ? "Nomenclature bank" : "Banco de nomenclaturas"}</CardTitle>
        <CardDescription>
          {total > 0
            ? (isEs ? `${total} aliases disponibles (${userEntries.length} del usuario, ${defaultEntries.length} estándar)` : isEn ? `${total} aliases available (${userEntries.length} from user, ${defaultEntries.length} default)` : `${total} aliases disponíveis (${userEntries.length} do usuário, ${defaultEntries.length} padrão)`)
            : (isEs ? "Cargue un archivo con alias → clave canónica para priorizar sus estándares." : isEn ? "Upload a file with alias → canonical key to prioritize your standards." : "Faça o upload de um arquivo com alias → chave canônica para priorizar seus padrões.")}
        </CardDescription>
      </CardHeader>
      {total > 0 && (
        <CardContent>
          {userEntries.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{isEs ? "Vista previa" : isEn ? "Preview" : "Pré-visualização"}</Badge>
                <span>{isEs ? "Primeros aliases enviados" : isEn ? "First uploaded aliases" : "Primeiros aliases enviados"}</span>
              </div>
              <ScrollArea className="h-32 rounded-md border">
                <ul className="divide-y text-sm">
                  {previewEntries.map((entry) => (
                    <li key={`${entry.alias}-${entry.canonical}`} className="px-4 py-2 flex justify-between gap-4">
                      <span className="font-medium">{entry.alias}</span>
                      <span className="text-muted-foreground">→ {entry.canonical}</span>
                    </li>
                  ))}
                  {previewEntries.length === 0 && (
                    <li className="px-4 py-6 text-center text-muted-foreground">{isEs ? "Todas las entradas son heredadas del seed estándar." : isEn ? "All entries are inherited from the default seed." : "Todas as entradas são herdadas do seed padrão."}</li>
                  )}
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isEs ? "No se enviaron entradas personalizadas. El seed estándar seguirá disponible, pero puede agregar prioridades específicas enviando un archivo." : isEn ? "No custom entries were uploaded. The default seed will remain available, but you can add specific priorities by uploading a file." : "Nenhuma entrada personalizada foi enviada. O seed padrão continuará disponível, mas você pode adicionar prioridades específicas enviando um arquivo."}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};
