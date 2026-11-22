# To-Do App — GRP2

A task management application with user authentication and task management functionality.

## Project Structure

```text
Todo-app-project-2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
├── docs/
├── frontend/
└── README.md
```

## Backend Setup

### 1. Requirements

- Node.js and npm
- PostgreSQL
- Git

### 2. Install dependencies

Open a terminal in the `backend` directory:

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Update `backend/.env` with your local configuration:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:4200
```

**Environment variable descriptions:**

| Variable | Purpose |
|---|---|
| PORT | Backend server port |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name; defaults to `todo_app` |
| DB_USER | PostgreSQL username |
| DB_PASSWORD | Local PostgreSQL password |
| JWT_SECRET | Secret used to sign authentication tokens |
| JWT_EXPIRES_IN | Authentication token expiry |
| CORS_ORIGIN | Allowed frontend origin |

Do not commit `.env` or expose database passwords and JWT secrets.

### 4. Database setup

The backend expects a PostgreSQL database named `todo_app`.

Make sure the database exists and the project database schema has been applied before starting the backend.

The database schema and seed instructions are maintained in the `database/` directory.

### 5. Start the backend

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Health check

Check whether the backend is running:

```text
GET http://localhost:5000/
```

Check the PostgreSQL connection:

```text
GET http://localhost:5000/api/health/db
```

A successful database health check returns:

```json
{
  "message": "PostgreSQL connection successful."
}
```

## Authentication API

Base URL:

```text
http://localhost:5000/api/auth
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |

## Project Environment Notes

- The backend authentication service uses `DB_NAME`, which defaults to `todo_app`.
- The Tasks API has a separate `DATABASE_URL` configuration requirement. Refer to its implementation and documentation.
- The frontend API URL should match the backend URL used by the frontend integration.
- Confirm frontend and Tasks API environment variable names with their respective owners.

## Security Notes

- Never commit `.env` files.
- Never commit passwords, API keys, or JWT secrets.
- Use strong, unique JWT secrets.
- Keep local development credentials private.

## Development Workflow

1. Work on your assigned feature branch.
2. Test changes locally.
3. Commit and push changes to the feature branch.
4. Request review before merging into `main`.
