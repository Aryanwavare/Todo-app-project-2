# To-Do App — GRP2

A task management application with user authentication and task management functionality.

## Project Structure

```text
Todo-app-project-2/
├── backend/                  # Authentication backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── todo-api/                 # Tasks CRUD API
│   ├── server.js
│   ├── db.js
│   ├── knexfile.js
│   ├── package.json
│   └── README.md
├── database/
├── docs/
├── frontend/
└── README.md
```

## Requirements

- Node.js and npm
- PostgreSQL
- Git

# 1. Authentication Backend Setup

The authentication backend is located in the `backend/` directory.

### Install dependencies

Open a terminal in the project root:

```bash
cd backend
npm install
```

### Configure environment variables

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

### Authentication backend environment variables

| Variable | Purpose |
|---|---|
| PORT | Authentication server port |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name; defaults to `todo_app` |
| DB_USER | PostgreSQL username |
| DB_PASSWORD | Local PostgreSQL password |
| JWT_SECRET | Secret used to sign authentication tokens |
| JWT_EXPIRES_IN | Authentication token expiry |
| CORS_ORIGIN | Allowed frontend origin |

### Database setup

The authentication backend expects a PostgreSQL database named `todo_app`.

Make sure the database exists and the project database schema has been applied before starting the backend.

The database schema and seed instructions are maintained in the `database/` directory.

### Start the authentication backend

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The authentication backend runs at:

```text
http://localhost:5000
```

### Health checks

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

# 2. Tasks CRUD API Setup

The Tasks API is maintained separately in the root-level `todo-api/` directory. It is not inside `backend/`.

### Install dependencies

From the project root:

```bash
cd todo-api
npm install
```

### Configure environment variables

Create a `.env` file inside the `todo-api/` directory.

Example configuration:

```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/todo_db
PORT=3000
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:4200
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

**Important:** URL-encode special characters in the PostgreSQL password when using `DATABASE_URL`.

Examples:

| Character | URL-encoded value |
|---|---|
| @ | %40 |
| Space | %20 |

The example database name is `todo_db`. Confirm that this database exists and has the required Tasks API schema before running the service.

### Tasks API environment variables

| Variable | Purpose |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| PORT | Tasks API port; example value is 3000 |
| JWT_SECRET | Secret used to verify authentication tokens; must match the authentication service |
| CORS_ORIGIN | Allowed frontend origin; defaults to `http://localhost:4200` |

### Start the Tasks API

Development mode:

```bash
npm run dev
```

For additional implementation details, refer to `todo-api/README.md`.

The Tasks API runs at:

```text
http://localhost:3000
```

# 3. JWT Secret Configuration

Both the authentication backend and Tasks API use JWT authentication.

The `JWT_SECRET` value must be identical in:

- `backend/.env`
- `todo-api/.env`

Generate a secure random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated value into both `.env` files.

Keep the secret private. Never commit it to GitHub or share it publicly.

# 4. Database Configuration Notes

This project currently has two separate PostgreSQL connection configurations:

| Service | Configuration | Example database |
|---|---|---|
| Authentication backend | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | `todo_app` |
| Tasks API | `DATABASE_URL` | `todo_db` |

These are separate configurations. Confirm the actual database names and schema requirements with the respective service owners before running the APIs.

# 5. Frontend Configuration

The frontend runs on:

```text
http://localhost:4200
```

The frontend API URLs must match the backend services:

| Service | Local URL |
|---|---|
| Authentication backend | `http://localhost:5000` |
| Tasks API | `http://localhost:3000` |
| Angular frontend | `http://localhost:4200` |

Both backend services should allow the frontend origin through their `CORS_ORIGIN` configuration.

# 6. Security Notes

- Never commit `.env` files.
- Never commit passwords, API keys, or JWT secrets.
- Use strong, unique database passwords.
- Use the same JWT secret in both services.
- URL-encode special characters in `DATABASE_URL` passwords.
- Keep local development credentials private.

# 7. Development Workflow

1. Work on your assigned feature branch.
2. Install dependencies for the service you are working on.
3. Configure the required local environment variables.
4. Test changes locally.
5. Commit and push changes to your feature branch.
6. Request review before merging into `main`.