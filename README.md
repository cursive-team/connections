# Cursive Connections

## Dev Setup

From root:

- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `pnpm install`
- Copy over .env.example into .env and update vars accordingly in frontend and backend

Frontend:

- `cd apps/frontend && pnpm run dev`

Backend:

- `cd apps/backend`
- `source .env.example`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `pnpm run dev`

Testing:

- Make sure you've seeded database with testing UserChip values: `pnpm run seed`
- To mock a tap, visit: http://localhost:3000/tap#?chipId=TEST001


Notes:

- API/backend uses null types for interop, client storage uses undefined for storage efficiency - conversions are done with zod.transform
