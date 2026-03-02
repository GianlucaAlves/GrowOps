# GrowOps Conventions (Code + API + Repo)

## 1) Repository layout (target)
growops/
  apps/
    api/
      prisma/
        schema.prisma
        migrations/
        seed.ts
      src/
        app.ts
        server.ts
        config/
          env.ts
        lib/
          prisma.ts
          logger.ts
          http.ts
        middlewares/
          auth.middleware.ts
          validate.middleware.ts
          requestId.middleware.ts
          error.middleware.ts
        routes/
          index.ts
          auth.routes.ts
          environments.routes.ts
          plants.routes.ts
          events.routes.ts
          tasks.routes.ts
          photos.routes.ts
          ai.routes.ts
        controllers/
          auth.controller.ts
          environments.controller.ts
          plants.controller.ts
          events.controller.ts
          tasks.controller.ts
          photos.controller.ts
          ai.controller.ts
        services/
          auth.service.ts
          environments.service.ts
          plants.service.ts
          events.service.ts
          tasks.service.ts
          photos.service.ts
          ai.service.ts
        repositories/
          environments.repo.ts
          plants.repo.ts
          events.repo.ts
          tasks.repo.ts
          photos.repo.ts
          ai.repo.ts
        schemas/
          auth.schemas.ts
          environments.schemas.ts
          plants.schemas.ts
          events.schemas.ts
          tasks.schemas.ts
          photos.schemas.ts
          ai.schemas.ts
        types/
          express.d.ts
          api.ts
        openapi/
          swagger.ts
      tests/
        integration/
          auth.test.ts
          plants.test.ts
          events.test.ts
          tasks.test.ts
          photos.test.ts
      package.json
      tsconfig.json
      .env.example
    web/
      src/
        app/
        components/
        lib/
        styles/
      package.json
      tsconfig.json
      .env.example
  packages/
    shared/
      src/
        dto/
        schemas/
        index.ts
      package.json
      tsconfig.json
  docs/
    ARCHITECTURE.md
    CONVENTIONS.md
  package.json
  README.md
  .gitignore

## 2) Naming conventions
- files: kebab-case + role suffix
  - plants.routes.ts
  - plants.controller.ts
  - plants.service.ts
  - plants.repo.ts
- symbols:
  - PascalCase: types/classes
  - camelCase: functions/vars
  - SCREAMING_SNAKE_CASE: constants

## 3) Endpoint conventions
- base path: `/api/v1`
- plural nouns for resources
- actions as subroutes only when needed
- always return JSON with the standard response shapes

## 4) Validation conventions
- Zod schemas live in `src/schemas/*`
- `validate(schema)` middleware runs before controller
- Controllers assume validated input

## 5) Authorization conventions
- Pattern: whenever a model is user-owned, repository methods take `userId` and include it in `where`.
- Never accept `userId` from request body.
- Storage keys must be user-scoped and never accept raw “path” from client.

## 6) Error conventions (Problem Details)
- Use `application/problem+json`
- Standard problems:
  - validation-error (422)
  - unauthorized (401)
  - forbidden (403)
  - not-found (404)
  - conflict (409)
  - internal-server-error (500)

## 7) Logging conventions
- required fields: requestId, method, path, status, durationMs, userId?
- prohibited: tokens, cookies, passwords, entire prompts, raw image bytes

## 8) Prisma conventions
- One prisma client instance in `src/lib/prisma.ts`
- Use transactions inside services when needed
- No Prisma calls in controllers

## 9) Uploads (Photos) conventions
- The UX must not require device configuration.
- Client uploads 2 variants: `full` and `thumb`.
- Client performs conversion/compression before upload.
- API validates (type, size) and stores:
  - bytes in object storage
  - metadata in Postgres (Photo table)
- Timeline loads thumbs first; full image is opened on demand.

## 10) AI conventions (optional)
- AI provider abstraction in service layer
- Retrieval limited to user-owned notes/events
- Always return sources
- Rate limit and cache results

## 11) Definition of Done (per feature)
- endpoint validated (Zod)
- auth + authz implemented
- errors use Problem Details
- tests updated
- docs updated (OpenAPI + README where needed)
