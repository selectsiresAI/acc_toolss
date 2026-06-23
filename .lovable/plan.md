## Objetivo

Remover o fator de regressão `0,93` da fórmula de predição **apenas quando a característica for SCS**. Para todas as outras traits, a fórmula permanece inalterada (`((Mãe + Touro) / 2) × 0,93`).

Motivo: SCS já é uma escala logarítmica em que a média geracional não regride como as traits lineares. Aplicar 0,93 estava puxando o valor das filhas para baixo artificialmente (no exemplo: pais 2,82 + mães 2,90 → esperado ≈ 2,86, mas saía 2,60).

## Escopo — Nexus 1 (Genômica) e Nexus 3 (Grupos) e ToolSSApp

A predição de pedigree do **Nexus 2** usa fórmula diferente (0,57·Pai + 0,28·MGS + 0,15·MGGS), sem fator 0,93 — **não será alterada**.

### Arquivos afetados

1. **`src/components/Nexus1GenomicPrediction.tsx`** (linha 98-101)
   - `calculateGenomicPrediction(femalePTA, bullPTA, traitKey?)` passa a aceitar a trait.
   - Quando `traitKey` (case-insensitive) for `"scs"`, retorna `(femalePTA + bullPTA) / 2` sem multiplicar por 0,93.
   - Atualizar todas as chamadas do componente para passar a chave da PTA.
   - Atualizar os textos de ajuda (PT/EN/ES) para registrar a exceção do SCS.

2. **`src/components/ToolSSApp.tsx`** (linha 2507-2510 e callers em `generateComparisonData`)
   - `calculateOffspringPTA(motherPTA, bullPTA, ptaKey?)` recebe a chave; se `SCS`, não aplica 0,93.
   - `generateComparisonData(ptaKey)` já tem `ptaKey` — apenas repassa.

3. **`src/components/nexus/Nexus3Groups.tsx`** (linha 146-153 e textos linhas 761-764)
   - No `useMemo` do `chartData`, calcular `daughters_pred` condicionalmente: se `trait === 'SCS'` (ou normalizado), usar `(m.avg_value + bullsAvg) / 2`; caso contrário, manter `× 0.93`.
   - Atualizar as legendas PT/EN/ES para indicar “exceto SCS”.

### Não alterar

- `src/services/prediction.service.ts` e `src/hooks/usePedigreeStore.ts` (Nexus 2 pedigree) — não usam 0,93.
- Outras ocorrências de `0.9` no projeto pertencem à Calculadora de Reposição (taxa de fêmeas vivas / sêmen convencional) e não têm relação com predição genética.

### Validação

- Reabrir Nexus 1 com a fêmea e touro do exemplo (pais SCS 2,82; mães 2,90): a coluna SCS das filhas deve ficar próxima de **2,86**, não mais 2,60.
- Conferir que demais traits (HHP$, TPI, NM$, PTAM, PTAF) continuam aplicando 0,93 e batem com os valores de validação já documentados no comentário do `calculateGenomicPrediction`.
- Conferir o gráfico do Nexus 3 ao selecionar SCS e ao selecionar outra trait.
