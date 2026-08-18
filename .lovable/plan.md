# CRM Diamante Imobiliária — v1 (dados em localStorage)

Sistema web de CRM completo para a Diamante Imobiliária, estruturado em 6 módulos com foco no **Processo** como eixo central. Toda a persistência será feita via `localStorage`, ideal para baixo volume de documentos e uso independente por navegador.

## Identidade visual
- **Base:** Azul-marinho profundo (#122A5E) extraído da marca.
- **Destaque:** Laranja Diamante (#F58F45).
- **Interface:** Sidebar escura fixa, tipografia geométrica moderna, cards limpos com cantos suaves e status coloridos para o funil.

## Estrutura de Módulos (TanStack Router)

1.  **Visão Geral (Dashboard):** `/`
    - Cards de indicadores (Clientes novos, Processos ativos, Tarefas pendentes).
    - Gráfico simples de origem de clientes e financeiro (recebimentos x comissões).
    - Lista de compromissos do dia.
2.  **Clientes & Processos:** `/clientes` e `/processos`
    - **Clientes:** Listagem e cadastro completo. Ficha do cliente com histórico e documentos.
    - **Funil (Kanban):** Visualização de processos por etapas (Lead, Atendimento, Documentação, Fechamento, etc).
3.  **Comercial & Parceiros:** `/comercial`
    - Gestão de equipe e parceiros externos (imobiliárias/corretoras).
    - Regras de comissão vinculadas a cada membro/parceiro.
4.  **Agenda & Tarefas:** `/agenda`
    - Calendário de compromissos e lista de tarefas (Hoje, Atrasadas, Concluídas).
5.  **Financeiro:** `/financeiro`
    - Registro de recebimentos e notas fiscais vinculadas a processos.
    - Cálculo automático de comissões baseado nas regras do comercial.
6.  **Comunicação:** `/comunicacao`
    - Templates de mensagens para WhatsApp com placeholders (ex: {nome}, {processo}).

## Implementação Técnica
- **Data Store:** Camada de serviço em `src/lib/db/` gerenciando o `localStorage` com tipos Zod.
- **Relacionamentos:** Processos vinculados a Clientes, Parceiros e Financeiro via IDs.
- **Documentos:** Armazenamento em Base64 (limitado a arquivos pequenos para não estourar o limite do browser).
- **SEO:** Head metadata específico para cada rota.

## Próximos Passos
1. Definir o schema de dados e store do localStorage.
2. Configurar o tema de cores Diamante no `styles.css`.
3. Criar a estrutura de rotas e o layout com Sidebar.
4. Implementar o Funil Kanban e o cadastro de Clientes.
