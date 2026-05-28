import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Circle, 
  FileJson, 
  Languages, 
  Code, 
  BookOpen,
  ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export default function I18nDashboard() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const [completedPhases, setCompletedPhases] = useState({
    phase0: true,  // Infraestrutura já implementada
    phase1: false, // Extração
    phase2: false, // Tradução IA
    phase3: false, // Aplicação
    phase4: false, // Integração glossário
    phase5: false, // Revisão
  });

  const phases = [
    {
      id: 'phase0',
      title: isEs ? 'Fase 0: Infraestructura i18n' : isEn ? 'Phase 0: i18n Infrastructure' : 'Fase 0: Infraestrutura i18n',
      status: completedPhases.phase0 ? 'complete' : 'pending',
      credits: '7-10',
      description: isEs ? 'Sistema i18n, Selector de Idioma y Glosario Técnico' : isEn ? 'i18n system, Language Selector and Technical Glossary' : 'Sistema i18n, Language Selector e Glossário Técnico',
      items: isEs
        ? ['I18nProvider y Context global', 'Selector de Idioma en Login y Dashboard', 'Tabla technical_glossary en Supabase', 'Interfaz de gestión (/admin/glossary)']
        : isEn
        ? ['I18nProvider and global Context', 'Language Selector on Login and Dashboard', 'technical_glossary table on Supabase', 'Management interface (/admin/glossary)']
        : ['I18nProvider e Context global', 'Language Selector em Login e Dashboard', 'Tabela technical_glossary no Supabase', 'Interface de gerenciamento (/admin/glossary)'],
      action: completedPhases.phase0 ? null : (isEs ? 'Ya implementado' : isEn ? 'Already implemented' : 'Já implementado'),
    },
    {
      id: 'phase1',
      title: isEs ? 'Fase 1: Extracción Automatizada' : isEn ? 'Phase 1: Automated Extraction' : 'Fase 1: Extração Automatizada',
      status: completedPhases.phase1 ? 'complete' : 'pending',
      credits: '2-3',
      description: isEs ? 'Extraer strings hardcoded del código' : isEn ? 'Extract hardcoded strings from code' : 'Extrair strings hardcoded do código',
      items: isEs
        ? ['Script extract-strings.ts', 'Genera src/locales/pt-BR.json (~500-800 strings)', 'Informe detallado de extracción']
        : isEn
        ? ['Script extract-strings.ts', 'Generates src/locales/pt-BR.json (~500-800 strings)', 'Detailed extraction report']
        : ['Script extract-strings.ts', 'Gera src/locales/pt-BR.json (~500-800 strings)', 'Relatório detalhado de extração'],
      command: 'npx tsx scripts/extract-strings.ts',
      action: '/admin/glossary',
    },
    {
      id: 'phase2',
      title: isEs ? 'Fase 2: Traducción vía IA' : isEn ? 'Phase 2: AI Translation' : 'Fase 2: Tradução via IA',
      status: completedPhases.phase2 ? 'complete' : 'pending',
      credits: '3-5',
      description: isEs ? 'Traducir JSON por lotes con Lovable AI' : isEn ? 'Batch translate JSON with Lovable AI' : 'Traduzir JSON em lote com Lovable AI',
      items: isEs
        ? ['Edge function translate-i18n', 'Interfaz admin de traducción', 'Preserva términos técnicos (PTAs)', 'Genera src/locales/en-US.json']
        : isEn
        ? ['Edge function translate-i18n', 'Admin translation interface', 'Preserves technical terms (PTAs)', 'Generates src/locales/en-US.json']
        : ['Edge function translate-i18n', 'Interface admin de tradução', 'Preserva termos técnicos (PTAs)', 'Gera src/locales/en-US.json'],
      action: '/admin/translation',
    },
    {
      id: 'phase3',
      title: isEs ? 'Fase 3: Aplicación de Traducciones' : isEn ? 'Phase 3: Apply Translations' : 'Fase 3: Aplicação de Traduções',
      status: completedPhases.phase3 ? 'complete' : 'pending',
      credits: '5-8',
      description: isEs ? 'Reemplazar hardcoded por t()' : isEn ? 'Replace hardcoded with t()' : 'Substituir hardcoded por t()',
      items: isEs
        ? ['Script apply-translations.ts', 'Reemplaza strings por t(key)', 'Agrega imports automáticamente', 'Modo dry-run para validación']
        : isEn
        ? ['Script apply-translations.ts', 'Replaces strings with t(key)', 'Adds imports automatically', 'Dry-run mode for validation']
        : ['Script apply-translations.ts', 'Substitui strings por t(key)', 'Adiciona imports automaticamente', 'Modo dry-run para validação'],
      command: 'npx tsx scripts/apply-translations.ts --dry-run',
      action: null,
    },
    {
      id: 'phase4',
      title: isEs ? 'Fase 4: Integración del Glosario' : isEn ? 'Phase 4: Glossary Integration' : 'Fase 4: Integração Glossário',
      status: completedPhases.phase4 ? 'complete' : 'pending',
      credits: '3-4',
      description: isEs ? 'Conectar glosario técnico al sistema i18n' : isEn ? 'Connect technical glossary to i18n system' : 'Conectar glossário técnico ao sistema i18n',
      items: isEs
        ? ['Merge en-US.json con glosario', 'Asegurar que PTAs no se traduzcan', 'Validar términos de dominio']
        : isEn
        ? ['Merge en-US.json with glossary', 'Ensure PTAs are not translated', 'Validate domain terms']
        : ['Merge en-US.json com glossário', 'Garantir PTAs não traduzidos', 'Validar termos de domínio'],
      action: '/admin/glossary',
    },
    {
      id: 'phase5',
      title: isEs ? 'Fase 5: Revisión y Pulido' : isEn ? 'Phase 5: Review and Polish' : 'Fase 5: Revisão e Polimento',
      status: completedPhases.phase5 ? 'complete' : 'pending',
      credits: '5-8',
      description: isEs ? 'Pruebas y ajustes finales' : isEn ? 'Testing and final adjustments' : 'Testes e ajustes finais',
      items: isEs
        ? ['Prueba de navegación completa en EN', 'Validar pluralización', 'Ajustar layouts si es necesario', 'Revisar contextos técnicos']
        : isEn
        ? ['Full EN navigation test', 'Validate pluralization', 'Adjust layouts if needed', 'Review technical contexts']
        : ['Teste navegação completa em EN', 'Validar pluralização', 'Ajustar layouts se necessário', 'Review contextos técnicos'],
      action: null,
    },
  ];

  const totalCredits = phases.reduce((sum, phase) => {
    const [min, max] = phase.credits.split('-').map(Number);
    return { min: sum.min + min, max: sum.max + max };
  }, { min: 0, max: 0 });

  const completedCount = Object.values(completedPhases).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / phases.length) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEs ? "Panel de Internacionalización" : isEn ? "Internationalization Dashboard" : "Dashboard de Internacionalização"}</CardTitle>
          <CardDescription>
            {isEs ? "Acompañe el progreso de la implementación completa del sistema i18n" : isEn ? "Track the progress of the full i18n system implementation" : "Acompanhe o progresso da implementação completa do sistema i18n"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isEs ? "Progreso General" : isEn ? "Overall Progress" : "Progresso Geral"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{progressPercent}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedCount} {isEs ? "de" : isEn ? "of" : "de"} {phases.length} {isEs ? "fases" : isEn ? "phases" : "fases"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isEs ? "Créditos Estimados" : isEn ? "Estimated Credits" : "Créditos Estimados"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCredits.min}-{totalCredits.max}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isEs ? "Total para implementación completa" : isEn ? "Total for full implementation" : "Total para implementação completa"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isEs ? "Idiomas" : isEn ? "Languages" : "Idiomas"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  pt-BR / en-US / es
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="mb-6">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>{isEs ? "Documentación completa" : isEn ? "Full documentation" : "Documentação completa"}</strong>: {isEs ? "Consulte" : isEn ? "See" : "Consulte"}{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">docs/i18n-implementation-guide.md</code>
              {' '}{isEs ? "y" : isEn ? "and" : "e"}{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">scripts/README.md</code>
              {' '}{isEs ? "para instrucciones detalladas." : isEn ? "for detailed instructions." : "para instruções detalhadas."}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {phases.map((phase, index) => {
              const isComplete = completedPhases[phase.id as keyof typeof completedPhases];
              const isPending = !isComplete;
              
              return (
                <Card key={phase.id} className={isComplete ? 'border-green-200 bg-green-50/50' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground mt-1" />
                        )}
                        <div>
                          <CardTitle className="text-base">{phase.title}</CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={isComplete ? "default" : "secondary"}>
                        {phase.credits} {isEs ? "créditos" : isEn ? "credits" : "créditos"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 flex-wrap">
                      {phase.command && (
                        <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono">
                          {phase.command}
                        </code>
                      )}
                      
                      {phase.action && phase.action.startsWith('/') && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={phase.action}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {isEs ? "Abrir Interfaz" : isEn ? "Open Interface" : "Abrir Interface"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {isEs ? "Próximos Pasos Recomendados" : isEn ? "Recommended Next Steps" : "Próximos Passos Recomendados"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">1. {isEs ? "Ejecute la extracción de strings" : isEn ? "Run string extraction" : "Execute a extração de strings"}</p>
                <code className="block bg-white px-3 py-2 rounded text-xs">
                  npx tsx scripts/extract-strings.ts
                </code>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">2. {isEs ? "Revise el glosario técnico" : isEn ? "Review the technical glossary" : "Revise o glossário técnico"}</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/glossary">
                    {isEs ? "Gestionar Glosario" : isEn ? "Manage Glossary" : "Gerenciar Glossário"}
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">3. {isEs ? "Traduzca el JSON vía IA" : isEn ? "Translate JSON via AI" : "Traduza o JSON via IA"}</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/translation">
                    {isEs ? "Traducción por Lotes" : isEn ? "Batch Translation" : "Tradução em Lote"}
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">4. {isEs ? "Aplique las traducciones en el código" : isEn ? "Apply translations to code" : "Aplique as traduções no código"}</p>
                <code className="block bg-white px-3 py-2 rounded text-xs">
                  npx tsx scripts/apply-translations.ts --dry-run
                </code>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}