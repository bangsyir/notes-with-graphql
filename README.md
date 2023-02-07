# Create Note app using graphql

### stack

#### server

- express
- graphql + apollo server
- typeorm + sqlite3

#### client

- nextjs
- codegen graphql
- @tanstack/react-query / apollo-client

# how ro run ?

- Server

`cd express-server && pnpm dev`

- Client

`cd next-client && pnpm dev`

- Database (redis)

`cd nodedock && docker compose up -d notes-redis`
