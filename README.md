# Plandica - Cultivation Operations Manager

<p align="center">
  <img src="docs/assets/growops-logo.png" alt="GrowOps Logo" width="200px">
  <h2 align="center">Plandica</h2>
  <h4 align="center">Sistema de Gestão de Cultivo para Jardinagem</h4>
</p>

<p align="center">
  | <a href="#desafio">Desafio</a> |
  <a href="#solucao">Solução</a> |
  <a href="#arquitetura">Arquitetura</a> |
  <a href="#requisitos">Requisitos</a> |
  <a href="#backlog">Backlog</a> |
  <a href="#manual">Manual</a> |
  <a href="#autor">Autor</a> |
</p>

> **Status do Projeto:** Início Fevereiro 2026  \
> **Versão:** 1.0 MVP  \
> **Autor:** Gianluca Lourenço  \
> **Data:** Fevereiro 2026
>
> [Pasta de Documentação](./docs)  \
> [Repositório GitHub](https://github.com/GianlucaAlves/growops)

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

O **Plandica** é um sistema full-stack de gerenciamento de cultivo doméstico que permite ao usuário registrar, rastrear e analisar todo o ciclo de vida de suas plantas de forma organizada, privada e profissional.

**Diferenciais da solução:**
- **Rastreabilidade completa:** De semente/clone até colheita e cura, com histórico detalhado
- **Diário operacional:** Registro padronizado de regas, nutrição, tratamentos, podas e observações
- **Planner inteligente:** Lembretes e tarefas recorrentes para garantir consistência operacional
- **Assistente IA (opcional):** Sugestões contextuais baseadas nos próprios logs do usuário (modo local)
- **Privacidade:** Dados pertencem ao usuário e são isolados por conta
- **Multi-ambiente:** Suporte a múltiplas tendas, runs e cultivares simultâneos

---

## 🏗️ Arquitetura <a id="arquitetura"></a>

### Monorepo (npm workspaces)

```
growops/
  apps/
    web/   (Next.js)
    api/   (Express + Prisma)
  packages/
    shared/ (opcional)
  docs/
  package.json
```

### Runtime (produção)

- `apps/web` (Next.js) e `apps/api` (Express) são deployados separadamente (ex.: Vercel).
- O banco de dados é PostgreSQL (host gerenciado).
- Upload de fotos usa object storage (não depende de “salvar no disco” do servidor).
- IA (Ollama) é opcional e **não é requisito** para o MVP funcionar (pode ficar apenas em dev/local).

### Upload de fotos (UX “tira e pronto”)

Para não exigir configurações do iPhone e ainda manter o projeto sustentável (storage/velocidade), o padrão de upload é:

1. O usuário escolhe/tira a foto no `apps/web`.
2. O `apps/web` normaliza o arquivo:
   - Se vier HEIC/HEIF, converte no navegador para JPEG.
   - Gera **2 versões**: `full` (otimizada) + `thumb` (miniatura).
3. O `apps/web` envia as duas imagens para o `apps/api`.
4. O `apps/api` valida, salva no storage e grava metadados no Postgres.
5. Na timeline, a UI carrega `thumb` primeiro e abre a `full` sob demanda.

---

## 📋 Requisitos <a id="requisitos"></a>

### 🧩 Requisitos Funcionais

| Código   | Descrição |
|----------|-----------|
| **RF01** | **Autenticação e Usuários** |
| RF01.1   | Permitir registro de usuário com email e senha |
| RF01.2   | Implementar autenticação (sessão com access/refresh) |
| RF01.4   | Perfil do usuário com foto, nome e configurações |
| **RF02** | **Ambientes de Cultivo** |
| RF02.1   | Criar e gerenciar ambientes (tendas, grow rooms) com nome, dimensões e tipo |
| RF02.2   | Atribuir plantas a ambientes específicos |
| **RF03** | **Gestão de Plantas** |
| RF03.1   | Cadastrar plantas com strain, origem (seed/clone), data de germinação |
| RF03.2   | Definir fase atual (germination, seedling, vegetative, flowering, harvest, curing) |
| **RF04** | **Diário de Cultivo (Grow Journal)** |
| RF04.1   | Registrar eventos padronizados |
| RF04.2   | Armazenar medições (pH, EC, PPM, temperatura, umidade, etc.) |
| RF04.3   | Anexar fotos aos eventos (full + thumb) |
| RF04.4   | Visualizar linha do tempo completa por planta |
| **RF05** | **Planner e Tarefas** |
| RF05.1   | Criar tarefas manuais e recorrentes |
| RF05.3   | Marcar tarefas como concluídas e registrar observação |
| **RF06** | **Relatórios e Exportação** |
| RF06.2   | Exportar dados em CSV |
| **RF07** | **Assistente IA (Opcional)** |
| RF07.3   | Sugestões contextuais baseadas nos próprios logs do usuário |

### ⚙️ Requisitos Não Funcionais

| Código    | Descrição |
|-----------|-----------|
| **RNF01** | Full-stack responsivo (mobile-first, PWA-ready) |
| **RNF02** | Autenticação segura; cookies HttpOnly quando aplicável; mitigação de CSRF |
| **RNF03** | Autorização rigorosa: usuário só acessa seus próprios recursos |
| **RNF05** | Logs estruturados com requestId, userId (quando autenticado), latency |
| **RNF06** | Configuração via variáveis de ambiente (.env) |
| **RNF08** | PostgreSQL com migrations versionadas (Prisma) |
| **RNF09** | Uploads com validação + otimização de imagem |
| **RNF10** | Testes de integração cobrindo autenticação e fluxos críticos |

---

## 🔌 API (contrato resumido)

Base path: `/api/v1`

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Environments
- `GET /api/v1/environments`
- `POST /api/v1/environments`
- `GET /api/v1/environments/:id`
- `PUT /api/v1/environments/:id`
- `DELETE /api/v1/environments/:id`

### Plants
- `GET /api/v1/plants` (filters: environmentId, phase, active)
- `POST /api/v1/plants`
- `GET /api/v1/plants/:id`
- `PUT /api/v1/plants/:id`
- `DELETE /api/v1/plants/:id`
- `PATCH /api/v1/plants/:id/phase`
- `GET /api/v1/plants/:id/timeline`

### Events (Journal)
- `GET /api/v1/events` (filters: plantId, type, date range)
- `POST /api/v1/events`
- `GET /api/v1/events/:id`
- `PUT /api/v1/events/:id`
- `DELETE /api/v1/events/:id`

### Photos (Uploads)
- `POST /api/v1/events/:id/photos` (recebe `full` + `thumb`)
- `GET /api/v1/photos/:id` (retorna metadados + URL de acesso conforme estratégia)

### Tasks
- `GET /api/v1/tasks` (filters: dueDate, completed)
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id/complete`
- `DELETE /api/v1/tasks/:id`

---

## 🗂️ Modelo de Dados (Prisma) — visão MVP

Observação: o schema real vive em `apps/api/prisma/schema.prisma`. Este trecho é uma referência do MVP.

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  name          String?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  environments Environment[]
  plants       Plant[]
  events       GrowEvent[]
  tasks        Task[]
  photos       Photo[]
}

model Environment {
  id          String   @id @default(uuid())
  user_id     String
  name        String
  type        String
  dimensions  Json?
  description String?
  is_active   Boolean  @default(true)
  created_at  DateTime @default(now())

  user   User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plants Plant[]
}

model Plant {
  id               String   @id @default(uuid())
  user_id          String
  environment_id   String?
  strain_name      String
  origin           String
  germination_date DateTime?
  current_phase    String
  is_active        Boolean  @default(true)
  notes            String?
  created_at       DateTime @default(now())

  user        User         @relation(fields: [user_id], references: [id], onDelete: Cascade)
  environment Environment? @relation(fields: [environment_id], references: [id], onDelete: SetNull)
  events      GrowEvent[]
  tasks       Task[]
  photos      Photo[]

  @@index([user_id])
  @@index([environment_id])
}

model GrowEvent {
  id           String   @id @default(uuid())
  user_id      String
  plant_id     String
  event_type   String
  description  String?
  measurements Json?
  created_at   DateTime @default(now())

  user   User  @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plant  Plant @relation(fields: [plant_id], references: [id], onDelete: Cascade)
  photos Photo[]

  @@index([plant_id, created_at])
}

model Photo {
  id           String   @id @default(uuid())
  user_id      String
  plant_id     String?
  event_id     String
  kind         String   // "full" | "thumb"
  storage_key  String   // path/chave no storage
  content_type String   // "image/jpeg"
  size_bytes   Int
  width        Int?
  height       Int?
  created_at   DateTime @default(now())

  user  User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plant Plant?    @relation(fields: [plant_id], references: [id], onDelete: SetNull)
  event GrowEvent @relation(fields: [event_id], references: [id], onDelete: Cascade)

  @@index([event_id])
  @@index([user_id, created_at])
  @@unique([event_id, kind])
}

model Task {
  id           String   @id @default(uuid())
  user_id      String
  plant_id     String?
  title        String
  description  String?
  due_date     DateTime
  is_recurring Boolean  @default(false)
  recurrence   String?
  is_completed Boolean  @default(false)
  completed_at DateTime?
  created_at   DateTime @default(now())

  user  User   @relation(fields: [user_id], references: [id], onDelete: Cascade)
  plant Plant? @relation(fields: [plant_id], references: [id], onDelete: SetNull)

  @@index([user_id, due_date])
}
```

---

## 📋 Backlog <a id="backlog"></a>

### Sprint 1: Fundação (Semana 1-2)
**Objetivo:** Backend básico + autenticação + estrutura do banco

- Registro/login/refresh/logout
- CRUD: environments + plants
- Prisma + migrations
- Logs + erros padrão (Problem Details)
- Deploy básico

### Sprint 2: Journal + Timeline (Semana 3-4)
- CRUD de events
- Upload de fotos (full + thumb) com otimização no client
- Timeline por planta + filtros

### Sprint 3: Planner + Frontend (Semana 5-6)
- CRUD de tasks
- Dashboard (Today) + páginas principais

### Sprint 4: Export + IA opcional (Semana 7-8)
- Export CSV
- IA local (feature-flagged)
- Hardening + testes + docs

---

## 📖 Manual de Instalação <a id="manual"></a>

### Pré-requisitos
- Node.js 18+
- Git
- Docker (opcional: para Postgres local)

### 1) Clonar
```bash
git clone https://github.com/GianlucaAlves/growops.git
cd growops
npm install
```

### 2) Banco de dados (opções)

**Opção A (recomendada p/ dev): Postgres local via Docker**
- Suba um Postgres local com `docker compose` (mantenha isso no `docker-compose.yml` na raiz).

**Opção B (produção e/ou dev): Postgres gerenciado**
- Crie um Postgres gerenciado e pegue a `DATABASE_URL`.

### 3) Configurar env

- `apps/api/.env` (baseado em `apps/api/.env.example`)
- `apps/web/.env.local` (baseado em `apps/web/.env.example`)

### 4) Prisma (API)
```bash
cd apps/api
npx prisma migrate dev
npm run dev
```

### 5) Next (WEB)
```bash
cd apps/web
npm run dev
```

---

## 👤 Autor <a id="autor"></a>

Gianluca Lourenço
- GitHub: https://github.com/GianlucaAlves
- LinkedIn: https://www.linkedin.com/in/gianluca-alves/
