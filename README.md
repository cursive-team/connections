# Cursive Connections

## Dev Setup

From root:

- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `pnpm install`
<<<<<<< HEAD
<<<<<<< HEAD
- Copy over .env.example into .env and update vars accordingly in frontend and backend
=======
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
=======
- Copy over .env.example into .env and update vars accordingly in frontend and backend
>>>>>>> 7edace6 (pr feedback, refactors)

Frontend:

- `cd apps/frontend && pnpm run dev`

Backend:

- `cd apps/backend`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `pnpm run dev`
- To seed database with testing UserChip values: `pnpm run seed`
<<<<<<< HEAD
<<<<<<< HEAD

Docker

The `Dockerfile` corresponds to the backend service. Its context is the repo root because of the shared packages. 

To locally build the image and run the container: 
- `docker image build -t connections:1 -f ./Dockerfile .`
- `docker run -td -p 8080:8080 connections:1`

For reducing the size of the docker image, I found this utility to be useful: 
- `du -shc $dir-or-file`
=======
>>>>>>> c10b8a5 (working chip registration and tap)

Notes:

- API/backend uses null types for interop, client storage uses undefined for storage efficiency - conversions are done with zod.transform
<<<<<<< HEAD
=======
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
=======
>>>>>>> c10b8a5 (working chip registration and tap)
