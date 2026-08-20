# Plano de Correção e Migração — CRM Diamante

O sistema foi migrado do armazenamento local (`localStorage`) para o backend real no **Supabase**. Esta mudança garante que os dados sejam centralizados, seguros e persistentes.

## Alterações Realizadas

### 1. Camada de Dados (Backend)
- **Migração de Esquema:** Criadas tabelas para `clients`, `processes`, `tasks`, `financials`, `commissions` e `message_templates` no Supabase.
- **Segurança (RLS):** Implementadas políticas de *Row Level Security* para garantir o isolamento de dados por empresa (`company_id`).
- **Autenticação:** Integrado o `supabase.auth` para login e controle de sessão.

### 2. Frontend (Integração)
- **Clientes & Processos:** Atualizadas as rotas `/clientes` e `/processos` para ler e gravar diretamente no banco de dados remoto.
- **Agenda & Financeiro:** Migradas as funcionalidades de tarefas e controle financeiro para o backend.
- **Sincronização:** O dashboard agora reflete métricas reais extraídas do banco de dados.

### 3. Autenticação e Acesso
- O sistema agora utiliza o email do usuário logado para vincular registros à empresa correta via tabela `profiles`.
- O login local anterior foi desativado em favor do login oficial do Supabase.

## Próximos Passos
- **Criação de Usuário:** O usuário deve se cadastrar/logar no sistema. O primeiro acesso criará o vínculo necessário para gerenciar a empresa.
- **Limpeza:** O arquivo `src/lib/db/store.ts` (localStorage) será removido em breve, após confirmação de que todos os dados legados foram ignorados ou migrados.

## Detalhes Técnicos
- Uso de `useSupabaseAuth` para gestão de estado global de usuário.
- Atualização das tipagens em `src/lib/db/types.ts` para suportar `snake_case` (padrão Postgres).
- Inclusão de `attachSupabaseAuth` no middleware do TanStack Start para proteger chamadas de servidor.
