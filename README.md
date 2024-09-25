# Cursive Connections

Dev Setup
- `pnpm install`
- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `cd apps/frontend && pnpm run dev`
- `cd apps/backend && pnpm run dev`