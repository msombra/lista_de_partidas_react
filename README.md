# SM Beta

Aplicação web para gerenciar partidas de futebol, campeonatos, clubes e canais de transmissão. O projeto reúne uma interface em React e uma API em Express, com persistência em SQLite por meio do Prisma.

## Funcionalidades

- Cadastro, edição e exclusão de campeonatos, clubes e transmissões.
- Cadastro e edição de partidas com campeonato, mandante, visitante, dia da semana, horário e transmissão.
- Visitante selecionado entre os clubes cadastrados ou informado manualmente.
- Partidas organizadas por dia da semana, com opções para expandir e recolher os grupos.
- Exclusão individual de partidas ou limpeza de toda a programação.
- Interface responsiva.
- Temas claro, escuro e conforme o sistema, com preferência salva no navegador.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, Vite 8, Ant Design 6, React Router 7 e Axios |
| Backend | Node.js, Express 5 e Prisma 7 |
| Banco de dados | SQLite, com adaptador `@prisma/adapter-better-sqlite3` |
| Qualidade de código | ESLint no frontend |

## Pré-requisitos

- Node.js 22.13 ou superior na linha 22, ou Node.js 24.
- npm.

Frontend e backend possuem dependências e comandos próprios. Execute os comandos abaixo a partir da raiz do projeto, salvo quando indicado.

## Instalação e configuração

### 1. Preparar o backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

O comando de cópia usa PowerShell. Em Linux ou macOS, utilize `cp .env.example .env`. Se o arquivo `.env` já existir, mantenha as configurações necessárias ao seu ambiente.

Configure `backend/.env`:

```dotenv
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | Endereço do banco SQLite. |
| `PORT` | Porta da API. |
| `FRONTEND_URL` | Origem do frontend permitida pelo CORS. |

Ainda na pasta `backend`, gere o cliente Prisma e aplique as migrações existentes:

```powershell
npm run prisma:generate
npm run db:deploy
```

Opcionalmente, carregue os dados de demonstração:

```powershell
npm run db:seed
```

O seed cadastra campeonatos, clubes e transmissões de exemplo. As partidas de demonstração são inseridas somente se não houver partidas no banco. A programação é fictícia.

### 2. Preparar o frontend

Em outro terminal, a partir da raiz do projeto:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

Configure `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3001/api
```

`VITE_API_URL` define o endereço da API consumida pela interface, incluindo o prefixo `/api`.

## Executar em desenvolvimento

Inicie a API em um terminal:

```powershell
cd backend
node src/server.js
```

Inicie o frontend em outro terminal:

```powershell
cd frontend
npm run dev
```

- Interface: <http://localhost:5173>
- Verificação da API: <http://localhost:3001/api/health>

A rota de verificação retorna `{"status":"ok"}` quando a API está em execução. Ela não consulta o banco de dados.

Se alterar as portas ou os endereços, ajuste `FRONTEND_URL` e `VITE_API_URL` e reinicie os serviços correspondentes.

## Como usar

1. Cadastre os campeonatos na página **Campeonatos**.
2. Cadastre os clubes e vincule cada um ao seu campeonato na página **Clubes**.
3. Cadastre as opções de transmissão na página **Transmissões**. A opção com o nome `Outro` permite informar uma transmissão manualmente no formulário de partida.
4. Na página **Partidas**, selecione **Inserir Partida** e preencha os dados do jogo.
5. Use **Exibir Ações** para acessar a edição e a exclusão das partidas.

### Regras de partidas

- O mandante deve ser um clube cadastrado.
- O visitante pode ser cadastrado ou informado pelo nome. O nome manual fica associado à partida e não cria um registro na lista de clubes.
- Mandante e visitante cadastrados devem ser diferentes.
- Um clube cadastrado não pode participar de outra partida no mesmo campeonato enquanto a partida anterior permanecer na programação.
- Nos campeonatos comuns, os clubes selecionados devem pertencer ao campeonato da partida.
- O campeonato chamado `Champions League` permite selecionar clubes de outros campeonatos e restringe os jogos a terça, quarta e quinta-feira.
- O horário deve estar no formato de 24 horas, `HH:mm`.
- A programação usa dias da semana, sem data de calendário.

## Comandos disponíveis

### Backend

Execute na pasta `backend`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API com reinicialização automática ao alterar arquivos. |
| `npm start` | Inicia a API sem monitoramento de arquivos. |
| `npm run prisma:generate` | Gera o cliente Prisma. |
| `npm run db:migrate` | Cria e aplica migrações durante o desenvolvimento. |
| `npm run db:deploy` | Aplica as migrações existentes. |
| `npm run db:seed` | Carrega dados de demonstração. |

### Frontend

Execute na pasta `frontend`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm run build` | Gera a aplicação em `frontend/dist`. |
| `npm run preview` | Disponibiliza uma prévia local do build. |
| `npm run lint` | Verifica o código com ESLint. |

O projeto ainda não possui scripts de testes automatizados nos arquivos `package.json`.

## API

Endereço padrão: `http://localhost:3001/api`.

| Recurso | Rota |
| --- | --- |
| Campeonatos | `/championships` |
| Clubes | `/clubs` |
| Partidas | `/matches` |
| Transmissões | `/transmissions` |

Todos os recursos oferecem:

- `GET /recurso`: listar registros.
- `GET /recurso/:id`: consultar um registro.
- `POST /recurso`: cadastrar.
- `PUT /recurso/:id`: atualizar.
- `DELETE /recurso/:id`: excluir.

Além dessas operações, `DELETE /matches` remove todas as partidas.

Exemplo de corpo JSON para cadastrar uma partida com visitante não cadastrado em `POST /matches`:

```json
{
  "championshipId": 1,
  "homeClubId": 1,
  "awayClubId": null,
  "awayTeamName": "time visitante",
  "weekDay": "sábado",
  "time": "16:00",
  "broadcast": "ESPN"
}
```

Use IDs existentes e compatíveis com as regras do campeonato. Para um visitante cadastrado, informe `awayClubId` e envie `awayTeamName` como `null`.

## Estrutura do projeto

```text
sm_beta/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Histórico de migrações
│   │   ├── schema.prisma     # Modelos do banco
│   │   └── seed.js           # Dados de demonstração
│   ├── src/
│   │   ├── controllers/      # Validação e processamento das requisições
│   │   ├── errors/           # Erros da aplicação
│   │   ├── lib/              # Cliente Prisma
│   │   ├── middlewares/      # Tratamento de erros
│   │   ├── repositories/     # Acesso ao banco
│   │   ├── routes/           # Rotas da API
│   │   ├── app.js            # Configuração do Express
│   │   └── server.js         # Inicialização da API
│   └── prisma.config.js
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes e formulário de partidas
│   │   ├── data/             # Opções de dias da semana
│   │   ├── hooks/            # Controle do tema
│   │   ├── pages/            # Telas da aplicação
│   │   ├── routes/           # Navegação
│   │   └── services/         # Comunicação com a API
│   └── vite.config.js
└── README.md
```

## Build e hospedagem

Gere o frontend com `npm run build` na pasta `frontend` e publique o conteúdo de `dist` em um servidor de arquivos estáticos. Configure o servidor para encaminhar rotas da interface, como `/partidas`, para `index.html`, pois a aplicação utiliza `BrowserRouter`.

Defina `VITE_API_URL` antes de gerar o build: as variáveis do Vite são incorporadas durante essa etapa. No backend, configure `FRONTEND_URL` com a origem publicada, gere o cliente Prisma, aplique as migrações e inicie a API com `npm start`.

O arquivo SQLite precisa permanecer em armazenamento persistente para conservar os dados entre reinicializações e publicações.
