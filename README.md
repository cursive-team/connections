# Cursive Connections

## Dev Setup

From root:

- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `pnpm install`

Frontend:

- `cd apps/frontend && pnpm run dev`

Backend:

- `cd apps/backend`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `pnpm run dev`
- To seed database with testing UserChip values: `pnpm run seed`

Notes:

- API/backend uses null types for interop, client storage uses undefined for storage efficiency - conversions are done with zod.transform
