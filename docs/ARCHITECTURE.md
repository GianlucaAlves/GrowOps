# GrowOps Architecture

## 1) Overview
GrowOps is a fullstack monorepo:
- `apps/web`: Next.js UI
- `apps/api`: Express REST API (TypeScript)
- `packages/shared`: optional shared types/schemas/client helpers
- PostgreSQL: persistence (Prisma)
- Object Storage: uploads (photos)
- Optional local AI: Ollama (feature-flagged)

## 2) Runtime components
Web (Next.js) -> API (Express) -> Prisma -> Postgres

Web (Next.js) -> API (Express) -> Object Storage (photos)

(Optional) API -> retrieval -> local LLM (Ollama) -> API

## 3) Backend layering (rules)
- routes: register endpoints + middleware only
- controllers: HTTP handlers only (parse input, call service, respond)
- services: business rules + orchestration + transactions
- repositories: Prisma queries only
- middlewares: auth, validate(Zod), requestId, error handling

## 4) Versioning
- All routes under `/api/v1`
- Breaking changes require `/api/v2`

## 5) Error format standard
All errors must be returned as `application/problem+json` using RFC 9457 fields:
- type: stable identifier (URL or urn)
- title: short summary
- status: HTTP status code
- detail: human readable explanation
- instance: request path or requestId
- errors: optional, used for validation details (array)

## 6) Auth model
- Access token (JWT): short lived, used in Authorization header
- Refresh token: stored as HttpOnly cookie, used to obtain a new access token
- Logout invalidates refresh session (server-side storage recommended)

Notes:
- If you use refresh cookies, you must implement CSRF mitigation.
- Always set cookies with Secure + SameSite in production.

## 7) Authorization model
- Every user-owned resource includes `userId` in DB.
- Every read/write must be scoped by `userId` (query + checks).
- Never trust client-provided identifiers beyond UUID format.
- For uploads, storage keys must be user-scoped (e.g. `users/{userId}/...`).

## 8) Uploads (Photos)
Goal: UX “take photo and upload” without device configuration.

Approach:
- Client normalizes images before upload (HEIC -> JPEG, then resize/compress).
- Store 2 variants: `full` and `thumb`.
- API stores metadata in Postgres and bytes in object storage.

## 9) Observability
- Structured logs to stdout
- Include requestId, userId, method, path, status, durationMs
- No secrets in logs
