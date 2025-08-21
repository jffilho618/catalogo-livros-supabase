# Catálogo de Livros (Vue + Express + Supabase)

Este repositório contém um projeto de catálogo de livros com frontend em Vue 3 (Vite) e backend em Node.js (Express) que usa Supabase para autenticação e armazenamento dos dados.

Este README fornece instruções passo-a-passo para instalar, configurar e executar o projeto no Windows (PowerShell), além de seções específicas para colocar prints das páginas da aplicação.

## Sumário

- Visão geral
- Requisitos
- Estrutura do projeto
- Variáveis de ambiente (.env)
- Instalação (servidor e cliente) — passo a passo (PowerShell)
- Como executar (desenvolvimento e produção)
- Onde colocar prints/screenshots
- Contrato técnico e casos de borda
- Lint / Build / Verificação rápida
- Troubleshooting comum

---

## Visão geral

Arquitetura:

- Frontend: Vue 3 + Vite, com roteamento por `vue-router` e comunicação HTTP por `axios`.
- Backend: Node.js + Express que expõe uma API REST (porta 3000 por padrão) e usa o client oficial do Supabase para persistência e autenticação.
- Comunicação: frontend faz requisições para `http://localhost:3000/api` (ver `client/src/api.js`).

Propósito do projeto: exemplo de CRUD de livros com autenticação via Supabase e separação frontend/backend.

---

## Requisitos

- Node.js: recomendado usar Node 20.x (o package.json do cliente recomenda `^20.19.0 || >=22.12.0`).
- npm (vem com o Node) ou outro gerenciador compatível (yarn/pnpm — instruções assumem npm).
- Windows 10/11 com PowerShell (as instruções de terminal abaixo estão em PowerShell).
- Conta Supabase (para criar `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`) e tabela `books` com colunas compatíveis (ex.: id, title, author, year, image, pages, user_id).

---

## Estrutura principal do repositório

- `client/vue-project/` — frontend Vue + Vite
  - `src/api.js` — instância do Axios; baseURL padrão: `http://localhost:3000/api`
  - `src/` — componentes, views e router
- `server/` — backend Express (arquivo principal: `index.js`)

---

## Variáveis de ambiente (servidor)

O backend usa duas variáveis de ambiente obrigatórias:

- SUPABASE_URL
- SUPABASE_SERVICE_KEY

Crie um arquivo `.env` dentro da pasta `server/` com o conteúdo (exemplo):

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJ...sua_service_key_aqui
```

Importante:

- Nunca comite `SUPABASE_SERVICE_KEY` em repositórios públicos. Trate como segredo.
- Em produção, prefira usar um segredo gerenciado (Azure Key Vault, AWS Secrets Manager, etc.).

---

## Instalação — passo a passo (PowerShell)

Observação: abra duas janelas/abas do PowerShell se quiser rodar cliente e servidor simultaneamente.

1) Clone ou navegue até a raiz do projeto (ex.: pasta que contém `client/` e `server/`).

2) Instalar dependências do servidor

No PowerShell, execute:

```powershell
cd .\server
npm install
# Crie o arquivo .env (manual): abra o Notepad e cole as variáveis de ambiente de exemplo
# notepad .\.env
```

3) Instalar dependências do cliente

Abra outro PowerShell (ou retorne à raiz) e execute:

```powershell
cd .\client\vue-project
npm install
```

Explanação rápida:

- `npm install` na pasta `server` instalará: `express`, `dotenv`, `cors`, `@supabase/supabase-js`.
- `npm install` na pasta `client/vue-project` instalará dependências do Vue (Vite, vue-router, axios, primevue etc.).

---

## Como executar

Desenvolvimento (recomendado durante o desenvolvimento local):

1) Inicie o servidor (em `server/`):

```powershell
cd .\server
node index.js
# Você deve ver: Servidor rodando em http://localhost:3000
```

2) Inicie o front-end (em `client/vue-project/`):

```powershell
cd .\client\vue-project
npm run dev
```

3) Acesse o frontend (o Vite mostrará a URL, normalmente `http://localhost:5173`).

Observações:

- O `client` faz requisições para `http://localhost:3000/api` (definido em `client/src/api.js`). Se desejar usar outra porta ou domínio, atualize `baseURL` nesse arquivo.
- Em produção, faça o build do cliente (`npm run build`) e hospede os arquivos estáticos em um servidor web apropriado (ou configure o Express para servi-los).

Build de produção (cliente):

```powershell
cd .\client\vue-project
npm run build
# Depois, opcionalmente: npm run preview
```

---

## Telas do Sistema

- Login view

![Login view](/screenshots/Captura%20de%20tela%202025-08-21%20172251.png)

- Dashboard / Catálogo


![Dashboard view](/screenshots/Captura%20de%20tela%202025-08-21%20172223.png)


## Contrato mínimo da API (para entendimento rápido)

- Inputs: requisições HTTP (JSON) do frontend para endpoints em `/api`.
- Outputs: respostas JSON do servidor (200/201/204 para sucesso; 4xx/5xx para erros).
- Erros esperados: validação de campos, autenticação (401), problemas com Supabase (400).

Critério de sucesso local: backend responde em `http://localhost:3000/api/public/books` com um array JSON (mesmo vazio) e o frontend carrega sem erros no console.

---

## Casos de borda / checklist de testes manuais

- Sem `.env` ou com chaves inválidas => endpoints devem retornar erro ao acessar rotas que usam Supabase.
- Token inválido no header Authorization => 401 retornado.
- Requisições sem campos obrigatórios (ex.: criar livro sem title/author) => 400 com mensagem.
- Deleção/atualização de livro que não pertence ao usuário => 404 ou 401 conforme a lógica do servidor.

---

## Lint / Build / Verificação rápida

- Lint (cliente):

```powershell
cd .\client\vue-project
npm run lint
# Formatar código (prettier): npm run format
```

- Iniciar servidor (verificar logs):

```powershell
cd .\server
node index.js
```

Verifique o console do browser (f12) para mensagens do frontend e o terminal do servidor para logs/erros.

---

## Troubleshooting comum

- Erro de porta ocupada (3000 ou porta do Vite): pare o processo que estiver usando a porta ou ajuste as portas (no código do servidor ou nas configurações do Vite).
- Erros de CORS: o servidor já habilita `cors()`; se o frontend estiver hospedado em domínio diferente, ajuste a política de CORS.
- Problemas com chaves Supabase: verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretos e se a tabela `books` existe.

---

## Segurança e boas práticas

- Nunca publique a `SUPABASE_SERVICE_KEY` em repositórios públicos.
- Considere usar chaves limitadas a runtime no cliente (anon key) e manter a `service_role` apenas no servidor.
- Para produção, habilite HTTPS, políticas CORS restritivas e rotacione chaves periodicamente.

