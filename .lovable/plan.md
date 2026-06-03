## Resposta direta

**De onde vêm os dados:** a Nexus 2 (predição por pedigree) lê touros do projeto Supabase `odactdxpecpiyiyaqfgi`, tabela base `public.bulls`, exposta pela view `public.bulls_denorm` e consultada pelas funções RPC `get_bull_by_naab` / `get_bulls_by_naabs`.

**Por que algumas traits não saem:** identifiquei a causa real analisando o arquivo `nexus2_resultados (13).xlsx`. As colunas que vêm **sempre vazias** (`F SAV`, `DCE`, `H LIV`, `CCR`, `HCR`, `GL`, `RFI`) NÃO são bug de fórmula — é dado faltando no touro buscado. E o motivo é:

A tabela `bulls` tem **35 NAABs duplicados**, com dois registros para o mesmo touro (um vindo da importação com código original `11HO12418` e outro da importação zero-padded `011HO12418`). Cada uma das duas linhas tem apenas **um subconjunto parcial das traits**.

Exemplo confirmado por consulta SQL para `11HO12418`:

| Linha | f_sav | dce(=pta_sire_sce) | h_liv | ccr_num | gl   | rfi  |
|-------|-------|---------------------|-------|---------|------|------|
| `11HO12418`  | 149  | 1.5 | 0.9 | NULL | -1.2 | 60   |
| `011HO12418` | NULL | NULL | NULL | 1.8 | NULL | NULL |

O RPC `get_bull_by_naab` faz:
```sql
WHERE code_normalized = ANY(variants) ORDER BY tpi DESC LIMIT 1
```
e retorna **apenas uma** das duas linhas. As traits que estão na outra linha vêm `NULL` — exatamente o que aparece como colunas vazias no Excel.

Touros 100% afetados no arquivo (todos sires usados): `200HO11431`, `11HO15985`, `11HO12418`, `11HO11422`, `11HO11736`, `1HO12996` — todos têm linha duplicada.

## Plano de correção

### 1. Consolidar duplicatas em `bulls` (migration)
Para cada `code_normalized` com duas linhas, fazer `UPDATE` na linha vencedora (maior `tpi`, ou a com mais campos não-nulos) preenchendo via `COALESCE` os campos faltantes da linha perdedora, depois deletar a perdedora. Mover também `bull_naab_aliases` que apontarem para o id removido.

Pseudo-SQL:
```sql
WITH dups AS (
  SELECT code_normalized,
         (array_agg(id ORDER BY (CASE WHEN tpi IS NULL THEN 0 ELSE 1 END) DESC, tpi DESC NULLS LAST))[1] AS keep_id,
         (array_agg(id ORDER BY (CASE WHEN tpi IS NULL THEN 0 ELSE 1 END) DESC, tpi DESC NULLS LAST))[2] AS drop_id
  FROM bulls
  GROUP BY code_normalized
  HAVING count(*) > 1
)
UPDATE bulls k SET
  f_sav      = COALESCE(k.f_sav,      d.f_sav),
  h_liv      = COALESCE(k.h_liv,      d.h_liv),
  ccr_num    = COALESCE(k.ccr_num,    d.ccr_num),
  hcr_num    = COALESCE(k.hcr_num,    d.hcr_num),
  gl         = COALESCE(k.gl,         d.gl),
  rfi        = COALESCE(k.rfi,        d.rfi),
  pta_sire_sce = COALESCE(k.pta_sire_sce, d.pta_sire_sce),
  -- ... todos os demais campos numeric/text usados pela Nexus 2 ...
FROM dups x JOIN bulls d ON d.id = x.drop_id
WHERE k.id = x.keep_id;

UPDATE bull_naab_aliases SET bull_id = x.keep_id
FROM dups x WHERE bull_id = x.drop_id;

DELETE FROM bulls WHERE id IN (SELECT drop_id FROM dups);
```

### 2. Prevenir reincidência
Criar índice único parcial:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS bulls_code_normalized_unique
  ON public.bulls(code_normalized) WHERE code_normalized IS NOT NULL;
```
Isso bloqueia novas duplicatas em futuros imports.

### 3. Endurecer o RPC (defesa em profundidade)
Ajustar `get_bull_by_naab` (e a versão batch `get_bulls_by_naabs`) para, caso ainda existam múltiplas linhas, ordenar por "completude" (número de campos críticos não-nulos) antes do `tpi`, evitando que um valor parcial mascare dados reais durante a janela de migração.

### 4. Verificação
- Re-rodar a planilha do usuário pela Nexus 2 e conferir que `F SAV / DCE / H LIV / CCR / HCR / GL / RFI` agora aparecem.
- Query de auditoria: `SELECT count(*) FROM (SELECT code_normalized FROM bulls GROUP BY 1 HAVING count(*)>1) s;` deve retornar 0.

### Detalhes técnicos
- O passo 1 é uma migration de DML pura. Nenhum schema novo.
- `bulls_denorm` é apenas SELECT da `bulls`, então a correção propaga automaticamente — não precisa recriar a view.
- O frontend (`src/services/prediction.service.ts`, `Nexus2PredictionIndividual.tsx`, `Nexus2PredictionBatch.tsx`) não precisa de mudança; o problema é 100% de dados na origem.
