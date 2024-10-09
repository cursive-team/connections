# Cursive Connections

## Dev Setup

From root:

- Create local postgres database, set name to be `connections` and port to `5432` (the default).
- `createdb connections_test`
- `pnpm install`
- Copy over .env.example into .env and update vars accordingly in frontend and backend

Frontend:

- `cd apps/frontend` 
- `source .env.example`
- `pnpm run dev`

Backend:

- `cd apps/backend`
- `source .env.example`
- `pnpm prisma generate`
- `pnpm prisma migrate dev`
- `pnpm run dev`

Testing:

- Make sure you've seeded database with testing UserChip values: `pnpm run seed`
  - To register, visit: http://localhost:3000/tap#?chipId=TEST001 and go through login flow. `TEST002`- `TEST005` are also available for testing. 
- Once logged in, to tap another account there are two steps: 
  - Log out of account, visit http://localhost:3000/logout
  - Create new account, visit http://localhost:3000/tap#?chipId=TEST001 again but with a different chip 
  - To tap a connection, visit http://localhost:3000/tap#?chipId=TEST001 again, where the chipId corresponds to the other existing account
- After a full deletion sometimes an old cookie will still be populating site, visit http://localhost:3000/logout or delete the cookie corresponding to localhost:3000.

Testing Secret Values: 

- For the email service, `AWS_SES_SENDER_EMAIL`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` must be set with target email and key info. 
- For the passkey / PSI to work, `BLOB_READ_WRITE_TOKEN` must be set with secret. 

Testing Utilities: 
- For dropping test DB: `psql`, `DROP DATABASE connections_test WITH (FORCE);`
- To filter requests in Chrome Inspect, use negative filter `-.png -.jpg -.jpeg -.gif -.json -.js` in Network tab.

Notes:

- API/backend uses null types for interop, client storage uses undefined for storage efficiency - conversions are done with zod.transform
