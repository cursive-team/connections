# Cursive Connections

Dev Setup
- `pnpm install`
- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/connections_test?schema=public"`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `cd apps/frontend && pnpm run dev`
- `cd apps/backend && pnpm run dev`

Docker

The `Dockerfile` corresponds to the backend service. Its context is the repo root because of the shared packages. 

To locally build the image and run the container: 
- `docker image build -t connections:1 -f ./Dockerfile .`
- `docker run -td -p 8080:8080 connections:1`

For reducing the size of the docker image, I found this utility to be useful: 
- `du -shc $dir-or-file`