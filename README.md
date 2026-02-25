# GrowOps - Cultivation Operations Manager

<p align="center">
      <img src="docs/assets/growops-logo.png" alt="GrowOps Logo" width="200px">
      <h2 align="center"> GrowOps</h2>
      <h4 align="center">Sistema de Gestão de Cultivo para Jardinagem Legalizada</h4>
</p>

<p align="center">
  | <a href ="#desafio"> Desafio</a>  |
  <a href ="#solucao"> Solução</a>  |
  <a href="#requisitos">Requisitos</a> |
  <a href ="#backlog"> Backlog do Produto</a>  |
  <a href ="#dor">DoR</a>  |
  <a href ="#dod">DoD</a>  |
  <a href ="#arquitetura"> Arquitetura</a> |
  <a href ="#tecnologias">Tecnologias</a> |
  <a href ="#manual">Manual de Instalação</a>  | 
  <a href ="#autor"> Autor</a> |      
</p>

> **Status do Projeto:** Início Fevereiro 2026  
> **Versão:** 1.0 MVP  
> **Autor:** Gianluca Lourenço  
> **Data:** Fevereiro 2026  
>
> [Pasta de Documentação](./docs) 📄
> 
> [Repositório GitHub](https://github.com/Duraxxi/growops) 💻

---

## 🎯 Desafio <a id="desafio"></a>

Jardineiros domésticos enfrentam dificuldades em manter registros consistentes, rastrear o ciclo de vida das plantas, documentar tratamentos e aprender com seus próprios dados históricos. A falta de organização e rastreabilidade dificulta a identificação de padrões, diagnóstico de problemas e replicação de resultados bem-sucedidos.

**Problemas identificados:**
- Registros dispersos em cadernos, fotos no celular e memória
- Dificuldade em rastrear histórico de pH, EC, nutrição e sintomas
- Ausência de lembretes para tarefas recorrentes (rega, podas, tratamentos)
- Falta de um sistema unificado para relacionar anotações com resultados
- Impossibilidade de consultar informações relevantes de forma contextual

---

## 💡 Solução <a id="solucao"></a>

O **GrowOps** é um sistema fullstack de gerenciamento de cultivo doméstico que permite ao usuário registrar, rastrear e analisar todo o ciclo de vida de suas plantas de forma organizada, privada e profissional.

**Diferenciais da solução:**
- **Rastreabilidade completa:** De semente/clone até colheita e cura, com histórico detalhado
- **Diário operacional:** Registro padronizado de regas, nutrição, tratamentos, podas e observações
- **Planner inteligente:** Lembretes e tarefas recorrentes para garantir consistência operacional
- **Assistente IA (opcional):** Sugestões contextuais baseadas nos próprios logs do usuário (RAG local via Ollama)
- **Privacidade total:** Dados pertencem ao usuário, sem dependência de serviços externos pagos
- **Multi-ambiente:** Suporte a múltiplas tendas, runs e cultivares simultâneos

**Engenharia profissional:**
- Autenticação segura (JWT)
- Controle de acesso (RBAC)
- API REST documentada (OpenAPI/Swagger)
- Logs estruturados e auditoria
- Testes de integração
- Deploy containerizado (Docker)
- Boas práticas 12-factor

---

## 📋 Requisitos <a id="requisitos"></a>

### 🧩 Requisitos Funcionais

| Código   | Descrição |
|----------|-----------|
| **RF01** | **Autenticação e Usuários** |
| RF01.1   | Permitir registro de usuário com email e senha |
| RF01.2   | Implementar autenticação via JWT com refresh token |
| RF01.3   | Permitir recuperação de senha via email |
| RF01.4   | Perfil do usuário com foto, nome e configurações |
| **RF02** | **Ambientes de Cultivo** |
| RF02.1   | Criar e gerenciar ambientes (tendas, grow rooms) com nome, dimensões e tipo |
| RF02.2   | Atribuir plantas a ambientes específicos |
| RF02.3   | Exibir status agregado por ambiente (plantas ativas, fase predominante) |
| **RF03** | **Gestão de Plantas** |
| RF03.1   | Cadastrar plantas com strain, origem (seed/clone), data de germinação |
| RF03.2   | Definir fase atual (germination, seedling, vegetative, flowering, harvest, curing) |
| RF03.3   | Associar plantas a ambientes e runs (ciclos de cultivo) |
| RF03.4   | Gerar QR code por planta para acesso rápido via mobile |
| RF03.5   | Marcar planta como inativa/perdida com motivo |
| **RF04** | **Diário de Cultivo (Grow Journal)** |
| RF04.1   | Registrar eventos padronizados: watering, feeding, pruning, training, ipm, transplant, observation |
| RF04.2   | Armazenar medições: pH, EC, PPM, temperatura, umidade |
| RF04.3   | Anexar fotos aos eventos com upload seguro |
| RF04.4   | Visualizar linha do tempo completa por planta |
| RF04.5   | Filtrar eventos por tipo, data e planta |
| **RF05** | **Planner e Tarefas** |
| RF05.1   | Criar tarefas manuais e recorrentes (diária, semanal, personalizada) |
| RF05.2   | Atribuir tarefas a plantas ou ambientes específicos |
| RF05.3   | Marcar tarefas como concluídas e registrar observação |
| RF05.4   | Exibir calendário de tarefas pendentes e futuras |
| RF05.5   | Notificações in-app para tarefas do dia (email opcional) |
| **RF06** | **Relatórios e Exportação** |
| RF06.1   | Gerar linha do tempo visual por planta com eventos e fotos |
| RF06.2   | Exportar dados de run completo em CSV (eventos, medições, plantas) |
| RF06.3   | Gráficos básicos de pH/EC ao longo do tempo (opcional MVP) |
| RF06.4   | Comparar múltiplos runs (yield, duração, problemas) |
| **RF07** | **Assistente IA (Opcional)** |
| RF07.1   | Indexar anotações do usuário em vector database (pgvector) |
| RF07.2   | Permitir perguntas em linguagem natural sobre o cultivo |
| RF07.3   | Recuperar notas relevantes e gerar sugestões contextuais via LLM local (Ollama) |
| RF07.4   | Exibir fontes (notas utilizadas) nas respostas |
| RF07.5   | Limitar sugestões por dia para controlar custo/uso |

### ⚙️ Requisitos Não Funcionais

| Código    | Descrição |
|-----------|-----------|
| **RNF01** | O sistema deve ser fullstack responsivo (mobile-first, PWA-ready) |
| **RNF02** | Autenticação segura com JWT, httpOnly cookies e proteção CSRF |
| **RNF03** | Autorização rigorosa: usuário só acessa seus próprios recursos |
| **RNF04** | API REST documentada via OpenAPI/Swagger com exemplos |
| **RNF05** | Logs estruturados (stdout) com requestId, userId, latency |
| **RNF06** | Configuração via variáveis de ambiente (.env), seguindo 12-factor |
| **RNF07** | Deploy containerizado com Docker Compose (app + db + ollama opcional) |
| **RNF08** | Banco de dados relacional (PostgreSQL) com migrations versionadas |
| **RNF09** | Suporte a uploads de imagens com validação de tipo e tamanho |
| **RNF10** | Testes de integração cobrindo autenticação e endpoints críticos |
| **RNF11** | Tempo de resposta < 500ms para 95% das requisições |
| **RNF12** | Interface em português brasileiro (internacionalização futura) |

---

## 🗂️ Modelo de Dados (Prisma Schema)

### Entidades Principais

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  name          String?
  avatar_url    String?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  environments Environment[]
  plants       Plant[]
  events       GrowEvent[]
  tasks        Task[]
  ai_suggestions AiSuggestion[]
}

model Environment {
  id          String   @id @default(uuid())
  user_id     String
  name        String
  type        String   // tent, room, outdoor
  dimensions  Json?    // {width, height, depth, unit}
  description String?
  is_active   Boolean  @default(true)
  created_at  DateTime @default(now())
  
  user   User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plants Plant[]
}

model Plant {
  id              String   @id @default(uuid())
  user_id         String
  environment_id  String?
  strain_name     String
  origin          String   // seed, clone
  germination_date DateTime?
  current_phase   String   // germination, seedling, vegetative, flowering, harvest, curing
  is_active       Boolean  @default(true)
  notes           String?
  qr_code         String?  @unique
  created_at      DateTime @default(now())
  
  user        User         @relation(fields: [user_id], references: [id], onDelete: Cascade)
  environment Environment? @relation(fields: [environment_id], references: [id], onDelete: SetNull)
  events      GrowEvent[]
  tasks       Task[]
}

model GrowEvent {
  id          String   @id @default(uuid())
  user_id     String
  plant_id    String
  event_type  String   // watering, feeding, pruning, training, ipm, transplant, observation, phase_change
  description String?
  measurements Json?   // {ph, ec, ppm, temp, humidity, ...}
  photos      Json?    // [{url, caption}]
  created_at  DateTime @default(now())
  
  user  User  @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plant Plant @relation(fields: [plant_id], references: [id], onDelete: Cascade)
  
  @@index([plant_id, created_at])
}

model Task {
  id            String   @id @default(uuid())
  user_id       String
  plant_id      String?
  title         String
  description   String?
  due_date      DateTime
  is_recurring  Boolean  @default(false)
  recurrence    String?  // daily, weekly, custom
  is_completed  Boolean  @default(false)
  completed_at  DateTime?
  created_at    DateTime @default(now())
  
  user  User   @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plant Plant? @relation(fields: [plant_id], references: [id], onDelete: Cascade)
  
  @@index([user_id, due_date])
}

model NoteEmbedding {
  id         String @id @default(uuid())
  event_id   String @unique
  embedding  Unsupported("vector(1536)")
  metadata   Json
  created_at DateTime @default(now())
}

model AiSuggestion {
  id         String   @id @default(uuid())
  user_id    String
  plant_id   String?
  question   String
  answer     String
  sources    Json     // [eventIds]
  created_at DateTime @default(now())
  
  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@index([user_id, created_at])
}
```

---

## 🏗️ Arquitetura <a id="arquitetura"></a>

### Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│          Frontend (Next.js)             │
│  - Pages: Dashboard, Plants, Journal    │
│  - Components: PlantCard, Timeline      │
│  - State: React Context / Zustand       │
└─────────────────────────────────────────┘
                    ↓ HTTP/REST
┌─────────────────────────────────────────┐
│       Backend API (Node.js + TS)        │
│  ┌────────────────────────────────────┐ │
│  │     Controllers (HTTP handlers)    │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Services (Business Logic + RAG)   │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Repositories (Prisma ORM)         │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Middlewares (Auth, Validation)    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
          ↓                      ↓
┌──────────────────┐   ┌──────────────────┐
│   PostgreSQL     │   │  Ollama (LLM)    │
│   + pgvector     │   │   localhost      │
└──────────────────┘   └──────────────────┘
```

### Endpoints Principais (API REST)

#### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login (retorna JWT)
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Invalidar sessão
- `POST /api/auth/forgot-password` - Recuperação de senha

#### Ambientes
- `GET /api/environments` - Listar ambientes do usuário
- `POST /api/environments` - Criar ambiente
- `GET /api/environments/:id` - Detalhe do ambiente
- `PUT /api/environments/:id` - Atualizar ambiente
- `DELETE /api/environments/:id` - Remover ambiente

#### Plantas
- `GET /api/plants` - Listar plantas (filtros: environment, phase, active)
- `POST /api/plants` - Cadastrar planta
- `GET /api/plants/:id` - Detalhe da planta
- `PUT /api/plants/:id` - Atualizar planta
- `DELETE /api/plants/:id` - Remover planta
- `PATCH /api/plants/:id/phase` - Alterar fase
- `GET /api/plants/:id/timeline` - Timeline completa de eventos

#### Eventos (Journal)
- `GET /api/events` - Listar eventos (filtros: plant, type, date range)
- `POST /api/events` - Criar evento
- `GET /api/events/:id` - Detalhe do evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Remover evento

#### Tarefas
- `GET /api/tasks` - Listar tarefas (filtros: due_date, completed)
- `POST /api/tasks` - Criar tarefa
- `PATCH /api/tasks/:id/complete` - Marcar como concluída
- `DELETE /api/tasks/:id` - Remover tarefa

#### Relatórios
- `GET /api/reports/plant/:id` - Relatório completo da planta
- `GET /api/reports/export/csv` - Exportar dados em CSV

#### IA (Opcional)
- `POST /api/ai/suggest` - Enviar pergunta e receber sugestão com contexto
- `GET /api/ai/history` - Histórico de sugestões

---

## 📋 Backlog do Produto <a id="backlog"></a>

### Sprint 1: Fundação (Semana 1-2)
**Objetivo:** Backend básico + autenticação + estrutura do banco

| ID | História de Usuário | Prioridade | Estimativa |
|----|---------------------|------------|------------|
| US01 | Como usuário, quero me registrar no sistema com email e senha | Alta | 5 |
| US02 | Como usuário, quero fazer login e receber um token JWT | Alta | 5 |
| US03 | Como usuário, quero criar ambientes de cultivo | Alta | 3 |
| US04 | Como usuário, quero cadastrar plantas e associá-las a ambientes | Alta | 5 |
| US05 | Como desenvolvedor, quero configurar Prisma + PostgreSQL com migrations | Alta | 3 |
| US06 | Como desenvolvedor, quero implementar middleware de autenticação | Alta | 3 |

**Entregáveis:**
- Backend API funcional
- Autenticação JWT
- CRUD de ambientes e plantas
- Docker Compose (api + db)
- Swagger/OpenAPI básico

---

### Sprint 2: Journal + Timeline (Semana 3-4)
**Objetivo:** Diário de cultivo com eventos e linha do tempo

| ID | História de Usuário | Prioridade | Estimativa |
|----|---------------------|------------|------------|
| US07 | Como usuário, quero registrar eventos de rega com medições (pH, EC) | Alta | 5 |
| US08 | Como usuário, quero registrar eventos de alimentação e tratamentos | Alta | 3 |
| US09 | Como usuário, quero anexar fotos aos eventos | Média | 5 |
| US10 | Como usuário, quero visualizar a timeline completa de uma planta | Alta | 5 |
| US11 | Como usuário, quero filtrar eventos por tipo e data | Média | 3 |
| US12 | Como desenvolvedor, quero implementar upload seguro de imagens | Alta | 5 |

**Entregáveis:**
- CRUD completo de eventos
- Upload e storage de fotos
- Endpoint de timeline por planta
- Validação de medições

---

### Sprint 3: Planner + Frontend (Semana 5-6)
**Objetivo:** Sistema de tarefas + interface Next.js

| ID | História de Usuário | Prioridade | Estimativa |
|----|---------------------|------------|------------|
| US13 | Como usuário, quero criar tarefas e lembretes | Alta | 5 |
| US14 | Como usuário, quero marcar tarefas como concluídas | Alta | 2 |
| US15 | Como usuário, quero visualizar tarefas pendentes no dashboard | Alta | 3 |
| US16 | Como desenvolvedor, quero criar interface Next.js com dashboard | Alta | 8 |
| US17 | Como desenvolvedor, quero implementar listagem e formulários de plantas | Alta | 5 |
| US18 | Como desenvolvedor, quero criar componente de timeline visual | Média | 5 |

**Entregáveis:**
- CRUD de tarefas
- Dashboard funcional (Next.js)
- Páginas de plantas e ambientes
- Timeline visual com eventos

---

### Sprint 4: Relatórios + IA (Semana 7-8)
**Objetivo:** Exportação de dados + assistente IA opcional

| ID | História de Usuário | Prioridade | Estimativa |
|----|---------------------|------------|------------|
| US19 | Como usuário, quero exportar dados de run em CSV | Média | 5 |
| US20 | Como usuário, quero fazer perguntas sobre meu cultivo e receber sugestões | Baixa | 8 |
| US21 | Como desenvolvedor, quero implementar RAG com pgvector + Ollama | Baixa | 8 |
| US22 | Como desenvolvedor, quero escrever testes de integração (auth + CRUD) | Alta | 5 |
| US23 | Como desenvolvedor, quero documentar setup completo no README | Alta | 3 |
| US24 | Como desenvolvedor, quero configurar CI básico (lint + test) | Média | 3 |

**Entregáveis:**
- Exportação CSV
- Assistente IA com RAG (opcional)
- Testes de integração
- README completo
- CI pipeline

---

## ✅ DoR - Definition of Ready <a id="dor"></a>

Uma história de usuário está pronta para desenvolvimento quando:

- [ ] História escrita no formato: "Como [usuário], quero [ação] para [benefício]"
- [ ] Critérios de aceitação definidos e claros
- [ ] Dependências técnicas identificadas (endpoints, schemas, libs)
- [ ] Prioridade definida (Alta, Média, Baixa)
- [ ] Estimativa de esforço realizada (story points ou horas)
- [ ] Casos de uso mapeados (fluxo principal e alternativos)
- [ ] Design/wireframe disponível (se front-end)

---

## ✅ DoD - Definition of Done <a id="dod"></a>

Uma história de usuário está completa quando:

- [ ] Código implementado e revisado (self-review ou pair)
- [ ] Testes unitários/integração escritos e passando
- [ ] Validação de dados implementada (Zod/Joi)
- [ ] Endpoint documentado no Swagger (se backend)
- [ ] Logs estruturados adicionados (info, error, warn)
- [ ] Tratamento de erros implementado (status codes corretos)
- [ ] Migrations aplicadas e testadas (se schema)
- [ ] README atualizado (se feature nova)
- [ ] Deploy local testado via Docker Compose
- [ ] Critérios de aceitação validados

---

## 💻 Tecnologias <a id="tecnologias"></a>

### Backend
<p>
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/></a>
<a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/></a>
<a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/></a>
<a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
<a href="https://github.com/colinhacks/zod"><img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white"/></a>
<a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/></a>
</p>

### Frontend
<p>
<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/></a>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/></a>
<a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"/></a>
</p>

### IA / LLM
<p>
<a href="https://ollama.com/"><img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white"/></a>
<a href="https://github.com/pgvector/pgvector"><img src="https://img.shields.io/badge/pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
</p>

### DevOps & Tools
<p>
<a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/></a>
<a href="https://swagger.io/"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/></a>
<a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
<a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/></a>
<a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"/></a>
</p>

---

## 📖 Manual de Instalação <a id="manual"></a>

### 🛠 Pré-requisitos

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker & Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))
- **Ollama** (opcional, para IA) ([Download](https://ollama.com/download))

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/Duraxxi/growops.git
cd growops
```

---

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/growops"
# JWT_SECRET="seu-secret-super-seguro"
# AI_PROVIDER="ollama"  # ou "openai"
# OLLAMA_BASE_URL="http://localhost:11434"
```

#### Subir banco de dados com Docker

```bash
docker-compose up -d postgres
```

#### Aplicar migrations

```bash
npx prisma migrate dev
npx prisma db seed  # (opcional: dados de exemplo)
```

#### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

**Saída esperada:**
```
🚀 Server running on http://localhost:3000
📄 API docs: http://localhost:3000/api-docs
```

---

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local
# NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### Iniciar aplicação Next.js

```bash
npm run dev
```

**Saída esperada:**
```
▲ Next.js 14.x.x
- Local:   http://localhost:5173
```

---

### 4. Configuração IA (Opcional)

#### Instalar Ollama

```bash
# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Windows: baixar instalador
```

#### Baixar modelo

```bash
ollama pull llama3.1:8b
# ou outro modelo de sua preferência
```

#### Testar integração

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Hello, how are you?"
}'
```

---

### 5. Rodar tudo com Docker Compose

```bash
# Na raiz do projeto
docker-compose up -d

# Verificar logs
docker-compose logs -f api
```

**Serviços disponíveis:**
- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`
- Swagger UI: `http://localhost:3000/api-docs`

---

## 🧪 Testes

```bash
# Backend
cd backend
npm run test              # Rodar todos os testes
npm run test:watch        # Watch mode
npm run test:coverage     # Cobertura

# Frontend
cd frontend
npm run test
```

---

## 🎓 Autor <a id="autor"></a>

<div align="center">
  <table>
    <tr>
      <th>Nome</th>
      <th>Função</th>
      <th>GitHub</th>
      <th>LinkedIn</th>
    </tr>
    <tr>
      <td>Gianluca Lourenço</td>
      <td>Desenvolvedor Full Stack</td>
      <td><a href="https://github.com/Duraxxi"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/gianluca-lourencco/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
  </table>
</div>

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📞 Contato

Para dúvidas, sugestões ou parcerias:
- 📧 Email: gianluca@exemplo.com
- 💼 LinkedIn: [Gianluca Lourenço](https://www.linkedin.com/in/gianluca-lourencco/)
- 🐙 GitHub: [@Duraxxi](https://github.com/Duraxxi)

---

<p align="center">
  Feito com 💚 e ☕ por <a href="https://github.com/Duraxxi">Gianluca Lourenço</a>
</p>
