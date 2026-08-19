# CRM Diamante Imobiliária — v1 (dados em localStorage)

Sistema web de CRM completo para a Diamante Imobiliária, seguindo o relatório anexo: 6 módulos, o **processo** como eixo central, e todo o banco de dados persistido no navegador (localStorage) — sem backend.

## Identidade visual
Paleta extraída da imagem: azul-marinho profundo (#122A5E / #0E2149) como base, laranja Diamante (#F58F45) como destaque, branco e cinza-azulado para textos e superfícies. Layout com sidebar escura fixa, conteúdo claro, cantos suaves, status coloridos e tipografia sem serifa geométrica.

## Módulos

**1. Visão Geral (Dashboard)**
Indicadores derivados dos dados reais: clientes novos e em atendimento, processos por etapa, finalizados, parados, com documentação pendente, tarefas pendentes/atrasadas, compromissos do dia, desempenho por comercial, origem dos clientes, indicados por parceiros, valores recebidos, comissões previstas e pagas. Filtros por período, responsável, parceiro, etapa e status.

**2. Clientes & Processos**
- Clientes: cadastro completo (nome, CPF/CNPJ, telefone, WhatsApp, e-mail, endereço, origem, parceiro indicador, responsável comercial, status, observações), com ficha do cliente reunindo processos, tarefas, documentos e histórico.
- Funil/Processos: kanban arrastável por etapa + visão em lista com filtros. Ficha do processo com abas: dados, tarefas, agenda, documentos, financeiro (recebimentos/NF/comissões) e histórico.
- Documentos & Arquivos: anexos vinculados a cliente ou processo.

**3. Comercial & Parceiros**
Equipe comercial (dados, cargo, status, acordos individuais, regra de comissão), parceiros (imobiliárias, corretoras, outros — com acordo comercial, contatos, documentos, clientes indicados e processos originados) e registro de indicações. As regras de comissão daqui alimentam o Financeiro, sem controle duplicado.

**4. Agenda & Tarefas**
Agenda da equipe (compromissos com data/hora, responsável, cliente, processo, tipo, status) em visão de calendário mensal e lista; visão individual e geral. Tarefas com prazo, prioridade, status e vínculos, filtradas por Hoje / Atrasadas / Próximas / Concluídas / Por responsável. Criação de tarefa direto do cliente ou processo.

**5. Financeiro**
Recebimentos vinculados ao processo; nota fiscal registrada dentro do recebimento (número, valor, data, status, arquivo); comissões geradas a partir do recebimento aplicando a regra do responsável, com valor-base, percentual, valor, status (prevista, calculada, aprovada, paga) e data de pagamento.

**6. Comunicação**
Banco de mensagens prontas por categoria (primeiro contato, solicitação de documentos, atualização de processo, etc.), com variáveis {nome}, {processo}, pré-visualização preenchida e botão copiar.

## Detalhes técnicos
- Rotas TanStack: `/` (visão geral), `/clientes`, `/clientes/$id`, `/processos`, `/processos/$id`, `/comercial`, `/agenda`, `/financeiro`, `/comunicacao`, cada uma com metadados próprios.
- Camada de dados: store tipado em `src/lib/db/` com entidades (cliente, processo, membro, parceiro, acordo, tarefa, compromisso, documento, recebimento, nota fiscal, comissão, modelo de mensagem, evento de histórico), CRUD, relacionamentos por id e persistência em localStorage com versionamento de schema; hook reativo para sincronizar telas.
- Documentos/anexos: arquivos convertidos para data URL e guardados no mesmo store (com aviso de limite de tamanho), já que não há backend.
- Histórico automático: toda mudança de etapa, status, criação de tarefa/documento/recebimento gera evento rastreável.
- Seed opcional de dados de exemplo, com botão para limpar/reiniciar a base.
- Tokens de cor da paleta definidos em `src/styles.css`; componentes shadcn ajustados às variantes da marca.

## Fora do escopo desta versão
Login/permissões multiusuário e sincronização em nuvem — a estrutura fica preparada para receber backend depois.
