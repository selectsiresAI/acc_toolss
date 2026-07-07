## Objetivo

Trocar o backend atual (`odactdxpecpiyiyaqfgi`) por um novo projeto Supabase que você criará na sua organização. O novo backend começa **vazio** — sem dados, sem tabelas, sem usuários, sem edge functions.

## O que você precisa fazer antes (manual, no supabase.com)

1. Criar um novo projeto na sua org do Supabase.
2. Anotar do painel do projeto (Project Settings → API):
   - **Project URL** (ex.: `https://xxxxxxx.supabase.co`)
   - **anon public key**
   - **Project ID / ref** (o `xxxxxxx` da URL)
3. Me passar esses 3 valores no chat.

Não me envie a `service_role` key — ela nunca deve ir para o frontend.

## O que eu faço no código depois que você me passar os valores

1. **Atualizar o cliente do Supabase** — `src/integrations/supabase/client.ts`: novos `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`.
2. **Atualizar `supabase/config.toml`** — trocar `project_id` para o ref novo.
3. **Recriar o schema** aplicando as migrations existentes em `supabase/migrations/` no novo projeto, na ordem cronológica. Isso reconstrói: tabelas (`bulls`, `females`, `user_farms`, `profiles`, `user_roles`, etc.), views denormalizadas (`bulls_denorm`, `females_denorm`), funções (`has_role`, cálculo HHP$), triggers, RLS e GRANTs.
4. **Reimplantar as edge functions** existentes (`import-bulls`, `import-females`, `create-users`, `share-farm`, `translate-i18n`, etc.) no novo projeto.
5. **Reconfigurar secrets das edge functions** — vou listar quais secrets o novo projeto precisa (ex.: `SUPABASE_SERVICE_ROLE_KEY`, chaves de IA/tradução, etc.) e você adiciona no painel do novo projeto.
6. **Verificação** — build + rodar o app em preview, testar login/signup, e checar que nenhum código ficou apontando para o ref antigo (`odactdxpecpiyiyaqfgi`).

## O que fica quebrado até você reagir

- **Dados**: catálogo de touros (`bulls_denorm` tem ~44k linhas hoje), fazendas, usuários, fêmeas importadas, relatórios salvos — tudo zerado. Você precisará reimportar (os importadores CSV/XLSX continuam funcionando).
- **Usuários**: contas antigas não migram. Todo mundo precisa se cadastrar de novo. Papéis de admin precisam ser recriados manualmente na tabela `user_roles`.
- **Storage**: arquivos enviados (Pasta de Arquivos, logos, etc.) não migram.
- **Auth providers**: se hoje há Google/Apple configurados no projeto antigo, precisará reconfigurar no novo.

## Alternativa que preserva os dados

Se em algum momento você quiser evitar a perda, o caminho é: fazer backup do banco atual via `pg_dump` no Supabase antigo → restaurar no novo → só então trocar as credenciais. Posso montar um plano separado para isso se decidir mudar de abordagem.

## Próximo passo

Aprove este plano e me envie **URL, anon key e project ref** do novo projeto Supabase.