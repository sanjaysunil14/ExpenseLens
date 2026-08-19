# ExpenseLens

ExpenseLens is a full-stack personal expense tracking application built with React, Express, and PostgreSQL.

It lets a user register, log in, record expenses, edit or delete them, filter spending, and view quick summaries by category and month. The project is structured to be understandable during code review while still being practical enough to run and use locally.

## Features

- User registration and login
- JWT-based authenticated API access
- Expense create, read, update, and delete flows
- Category-backed expense classification
- Search, category, and month filters
- Spending summaries by category and month
- Modular backend architecture
- Clean frontend split into reusable components

## Tech Stack

### Frontend

- React
- Vite
- Plain CSS
- Fetch API

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- `bcryptjs`
- `jsonwebtoken`

## Architecture

The backend follows a layered structure:

```text
Route -> Controller -> Service -> Repository -> PostgreSQL
```

This keeps responsibilities separated:

- Routes map HTTP requests to handlers
- Controllers deal with request and response concerns
- Services contain application logic
- Repositories contain SQL and database access

The frontend is organized around:

- page-level orchestration in `App.jsx`
- reusable UI components in `client/src/components`
- shared helpers in `client/src/lib`
- constants in `client/src/constants`

## Project Structure

```text
ExpenseLens/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── index.js
│   ├── test/
│   ├── package.json
│   └── .env.example
├── .editorconfig
├── .gitignore
└── README.md
```

## Environment Variables

The backend expects a `.env` file inside `server/`.

Use `server/.env.example` as the starting point:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/expense_lens_db
JWT_SECRET=replace-this-with-a-long-random-secret
```

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ExpenseLens
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
npm install
```

Update `DATABASE_URL` and `JWT_SECRET` in `server/.env` before starting the API.

### 3. Start the backend

```bash
cd server
npm run dev
```

The API runs on `http://localhost:5000`.

On startup, the server also initializes required tables and default categories if they do not already exist.

### 4. Start the frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

Vite is configured to proxy `/api` requests to the Express server during local development.

## Available Scripts

### Server

- `npm run dev` starts the Express API in watch mode
- `npm test` runs the backend test suite

### Client

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` serves the production build locally

## API Overview

### Health

- `GET /`
- `GET /api/db-check`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/users/me`

### Categories

- `GET /api/categories`

### Expenses

- `GET /api/expenses`
- `GET /api/expenses/summary`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

Authenticated routes require:

```text
Authorization: Bearer <token>
```

## Expense Payload Shape

Example request body for creating or updating an expense:

```json
{
  "merchant": "Weekly groceries",
  "amount": 1450.75,
  "categoryId": 1,
  "expenseDate": "2026-08-19",
  "notes": "Vegetables and staples"
}
```

## Testing and Verification

The project has been verified with:

- backend tests via `npm test` in `server/`
- frontend production build via `npm run build` in `client/`
- live API smoke testing for auth and expense CRUD flows

## Review Notes

- Secrets and generated files are excluded through the root `.gitignore`
- The backend codebase is organized for straightforward code review
- The frontend has been split into reusable components rather than one large file
- The repository is suitable for an initial Git push and follow-up refactoring work

## Future Improvements

- Add ESLint and consistent formatting automation
- Add backend integration tests against a dedicated test database
- Add charts and richer analytics
- Add budgets and budget-vs-actual comparisons
- Add deployment configuration for production hosting
