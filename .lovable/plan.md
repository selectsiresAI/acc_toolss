
## Objetivo

Na aba "Processamento em Lote" do Nexus 2, adicionar uma **segunda área de upload** ao lado da atual ("Enviar planilha"), permitindo que o usuário envie a planilha **nativa do seu software de rebanho** (IDEAGRI, Afidata, DairyComp, planilhas próprias, etc.) sem precisar reformatar manualmente. O sistema detecta automaticamente as 6 colunas necessárias, mostra uma revisão rápida do mapeamento e injeta as linhas no fluxo de validação NAAB + predição já existente.

## UX

Na seção "Processamento em Lote", o usuário verá dois caminhos lado a lado (cards):

```text
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Planilha no formato ToolSS  │  │ Planilha nativa (auto)      │
│ [Enviar planilha]           │  │ [Enviar planilha nativa]    │
│ Colunas: ID_Fazenda, Nome…  │  │ Detectamos as colunas para  │
│                             │  │ você. Sem reformatar nada.  │
└─────────────────────────────┘  └─────────────────────────────┘
```

Ao enviar uma planilha nativa:
1. Lemos a primeira aba e extraímos os cabeçalhos originais.
2. Para cada uma das 6 colunas-alvo (ID_Fazenda, Nome, Data_de_Nascimento, naab_pai, naab_avo_materno, naab_bisavo_materno), buscamos a melhor correspondência usando o `defaultLegendBank` + heurísticas regex + `jaroWinkler` (mesmas funções já usadas em `src/pages/tools/conversao`).
3. Abre um **diálogo de revisão** mostrando, para cada coluna-alvo: a coluna detectada da planilha do usuário, método (legenda/regex/fuzzy), confiança, e um `Select` para o usuário trocar se necessário. Campos com confiança ≥ 0.88 ou match por legenda já vêm pré-aprovados.
4. Botão "Confirmar e carregar" converte internamente as linhas no formato canônico esperado pelo `parseFile` atual e popula o estado `rows` do componente — daí em diante é o mesmo fluxo (preview, validação de NAABs no Supabase, predição, envio ao rebanho).

Quando não é possível detectar `naab_pai`, bloqueamos o "Confirmar" (campo obrigatório). `data_nascimento`, `naab_avo_materno` e `naab_bisavo_materno` são opcionais (o sistema já trata placeholders).

## Implementação técnica

**Arquivos novos**
- `src/components/nexus2/NativeSheetImporter.tsx` — Card de upload + diálogo de revisão de mapeamento. Recebe `onConverted(rows: ParsedNativeRow[])` como prop.
- `src/components/nexus2/nativeSheetMapping.ts` — Função pura `detectNativeMapping(headers: string[]): Record<TargetField, Suggestion>` reaproveitando `normalizeKey`, `jaroWinkler`, `defaultLegendBank` e adicionando aliases extras para os 6 campos (ex.: "pai", "sire", "father", "padre" → naab_pai; "data nascimento", "DN", "nasc" → data_nascimento; etc.).

**Edições**
- `src/components/nexus2/Nexus2PredictionBatch.tsx`:
  - Extrair a lógica que transforma linhas brutas (objetos `{idFazenda, nome, dataNascimento, naabPai, naabAvoMaterno, naabBisavoMaterno}`) em `BatchRow[]` para uma função reutilizável `ingestRawRows(rows, sourceFileName)` (faz lookup de NAABs no Supabase, monta `BatchRow` com `status/fieldErrors`). Essa função hoje vive dentro de `parseFile`.
  - Renderizar os dois cards lado a lado (grid 2 colunas no md+, empilhado no mobile). O segundo card é o `<NativeSheetImporter onConverted={ingestRawRows} />`.
  - Após `onConverted`, o estado `rows` é populado e o preview/validação/predição existentes funcionam sem outras mudanças.

**Internacionalização**
- Adicionar chaves em `src/lib/i18n.ts` (PT/EN/ES):
  - `nexus2.batch.native.title`, `.description`, `.upload`, `.helper`
  - `nexus2.batch.native.review.title`, `.column`, `.detected`, `.method`, `.confidence`, `.required`, `.optional`, `.confirm`, `.cancel`
  - `nexus2.batch.native.errors.missingSire`

**Sem mudanças de backend.** Toda detecção é client-side. Validação de NAABs continua usando `getBullByNaab` do Supabase exatamente como hoje.

## Fora de escopo

- Persistir mapeamentos customizados do usuário (banco de legendas próprio) — fica para um futuro incremento.
- Suporte a múltiplas abas na planilha nativa (continuamos lendo só a primeira).
