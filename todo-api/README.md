## Environment variables

Create a `.env` file in this folder (never commit it):

| Variable | Example | Purpose |
|---|---|---|
| DATABASE_URL | postgres://postgres:YOUR_PASSWORD@localhost:5432/todo_db | PostgreSQL connection string |
| PORT | 3000 | API port |
| JWT_SECRET | (ask the team) | Secret used to verify login tokens. Must match the auth service |
| CORS_ORIGIN | http://localhost:4200 | Allowed browser origin (defaults to this) |

URL-encode special characters in the password (`@` becomes `%40`, a space becomes `%20`).

## Run

```
npm install
npm run dev
```