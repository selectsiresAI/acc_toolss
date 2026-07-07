
# Plano: Conectar frontend AG ao Supabase "Plataform" com tabelas isoladas

## Contexto
Este frontend é da **Accelerated Genetics (AG)**. Vai compartilhar o mesmo projeto Supabase do ToolSS/SelectSires (`odactdxpecpiyiyaqfgi` — "Plataform"), reusando catálogos comuns (ex.: `bulls_denorm`, índices, tabelas de referência), mas com **dados de clientes totalmente isolados** dos dados da Select Sires.

## Pré-requisito (bloqueador)
Preciso da **anon/public key** do projeto Plataform. A chave enviada é `service_role` e **não pode** ser usada no frontend. Assim que você colar a anon key, aplico a configuração.

## 1. Conexão do frontend
- Atualizar `src/integrations/supabase/client.ts` (e `.env` correspondente) para:
  - `VITE_SUPABASE_URL = https://odactdxpecpiyiyaqfgi.supabase.co`
  - `VITE_SUPABASE_PROJECT_ID = odactdxpecpiyiyaqfgi`
  - `VITE_SUPABASE_PUBLISHABLE_KEY = <anon key>` (a fornecer)
- Regenerar `src/integrations/supabase/types.ts` para o schema do Plataform.

## 2. Novas tabelas (sufixo `_ag`, schema `public`)
Criadas via migration, **sem tocar** em nada existente do ToolSS:

```text
farms_ag       -- fazendas/clientes AG
profiles_ag    -- técnicos/usuários AG (1:1 com auth.users)
females_ag     -- fêmeas vinculadas a farms_ag
```

Chaves e relacionamentos:
- `profiles_ag.user_id` → `auth.users.id` (unique)
- `farms_ag.id` (uuid, pk)
- `females_ag.farm_id` → `farms_ag.id`
- Tabela de associação `user_farms_ag (user_id, farm_id, role)` para multi-tenant, seguindo o padrão já usado no ToolSS.

## 3. Segurança (isolamento AG × Select Sires)
- `ENABLE ROW LEVEL SECURITY` nas 4 tabelas `_ag`.
- Grants explícitos: `authenticated` (CRUD conforme policy) e `service_role` (ALL). Sem `anon`.
- Policies via função `SECURITY DEFINER` `has_farm_access_ag(user_id, farm_id)` (search_path fixo em `public`), espelhando o padrão do ToolSS mas em namespace próprio.
- Admin AG via tabela `user_roles` já existente + role nova `ag_admin` (se ainda não existir) — a decidir na implementação; alternativa é `user_roles_ag` separada. **Pergunta aberta:** prefere reusar `user_roles` global ou criar `user_roles_ag`?
- Nenhuma policy nova concede leitura das tabelas AG a usuários "ToolSS-only" e vice-versa (as tabelas do ToolSS ficam intactas; este frontend simplesmente não faz queries nelas).

## 4. Reuso do Plataform
Frontend AG poderá **ler** tabelas/views compartilhadas já existentes (ex.: `bulls_denorm`, catálogos genéticos) usando as policies atuais delas. Sem alterações no schema compartilhado nesta etapa.

## 5. Edge functions
- Nenhuma edge function do ToolSS será modificada.
- Se este frontend precisar de funções próprias (ex.: importador de fêmeas AG), criamos com sufixo `-ag` em passo futuro — fora do escopo deste plano.

## 6. Dados
Começamos com as 3 tabelas vazias. Migração de profiles/farms/fêmeas fica para depois.

## Entregáveis desta execução
1. Atualização do client Supabase + regeneração de types.
2. Migration criando `farms_ag`, `profiles_ag`, `females_ag`, `user_farms_ag` com GRANTs, RLS e policies.
3. Função `has_farm_access_ag` (SECURITY DEFINER, search_path=public).
4. Atualização da memória (`mem://infrastructure/project-connection-details-...`) registrando que o projeto AG usa o mesmo Supabase do ToolSS com namespace `_ag`.

## Fora do escopo (fazer depois)
- Telas de CRUD para farms/fêmeas/profiles AG.
- Importadores/edge functions AG.
- Migração de dados existentes.
