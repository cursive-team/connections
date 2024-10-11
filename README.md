# Cursive Connections

## Dev Setup

From root:

- Create local postgres database, set name to be `connections_test` and port to `5432` (the default).
- `CREATE DATABASE connections_test;`
- `pnpm install`

Frontend:

- `cd apps/frontend`
- Copy over .env.example into .env and update vars
  - Set `NEXT_PUBLIC_API_URL` to point to the backend, defaults to `http://localhost:8080/api`
  - Set `BLOB_READ_WRITE_TOKEN` to point to vercel blob store
  - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` based on supabase instance
- `source .env`
- `pnpm run dev`

Backend:

- In a separate terminal, `cd apps/backend`
- Copy over .env.example into .env and update vars
  - Set `FRONTEND_URL` to point to the frontend (for cors), defaults to `http://localhost:3000`
  - Set `DATABASE_URL` to point to the database, for local dev this defaults to `postgresql://postgres:postgres@localhost:5432/connections_test?schema=public`
  - Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_SES_SENDER_EMAIL` to correspond to IAM credentials for AWS Simple Email Service
- `source .env`
- Run `pnpm prisma migrate dev` to run db migrations
- Run `pnpm prisma generate` to generate the prisma client
- `pnpm run dev`

Testing:

- This is meant to be a mobile browser app. You can either test this on mobile browser by connecting it to localhost or using ngrok/similar service, or test from a desktop web browser using mobile view
- This app does not work in incognito mode
- Make sure you've seeded database with testing UserChip values: `pnpm run seed`
  - To register, visit: http://localhost:3000/tap?chipId=TEST001 and go through registration flow. `TEST002`- `TEST005` are also available for testing.
- Once logged in, to tap another account there are two steps:
  - Create new account, visit http://localhost:3000/tap?chipId=TEST002 in a different browser
  - To tap a connection, visit http://localhost:3000/tap?chipId=TEST002 from your first browser, where the chipId corresponds to the other existing account
- After a full deletion sometimes old local storage values will still be populating site, visit http://localhost:3000/logout to logout or delete the local storage corresponding to localhost:3000.
- To clear the database, run `npx prisma migrate reset` from apps/backend. NOTE THIS WILL WIPE YOUR POSTGRES

Testing Secret Values:

- For the email service, `AWS_SES_SENDER_EMAIL`, `AWS_ACCESS_KEY_ID`, `AWS_REGION`, and `AWS_SECRET_ACCESS_KEY` must be set with target email and key info.
- For the passkey / PSI to work, `BLOB_READ_WRITE_TOKEN` must be set with secret.

Testing Utilities:

- For dropping test DB: `psql`, `DROP DATABASE connections_test WITH (FORCE);`
- To filter requests in Chrome Inspect, use negative filter `-.png -.jpg -.jpeg -.gif -.json -.js` in Network tab.

Notes:

- API/backend uses null types for interop, client storage uses undefined for storage efficiency - conversions are done with zod.transform
