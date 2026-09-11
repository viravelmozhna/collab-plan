# collab-to-do

Monorepo for the collaborative to-do app.

| Workspace | Path | Stack |
| --- | --- | --- |
| Backend | [`apps/backend`](apps/backend) | Express, Socket.IO, Mongoose (MongoDB), JWT |
| Frontend | [`apps/frontend`](apps/frontend) | Next.js 14 (App Router), TypeScript, Tailwind |

Managed with npm workspaces: one `npm install` at the root installs both apps and
writes a single `package-lock.json`.

## Setup

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Then fill in `apps/backend/.env` (`DB_HOST` connection string and `JWT_SECRET`).

## Development

```bash
npm run dev            # backend (:3001) and frontend (:3000) together
npm run dev:backend    # backend only
npm run dev:frontend   # frontend only
```

## Production

```bash
npm run build          # next build
npm start              # backend + next start
```

## Other

```bash
npm run lint           # next lint
```

## Environment variables

`apps/backend/.env`

| Variable | Purpose |
| --- | --- |
| `DB_HOST` | MongoDB connection string |
| `PORT` | Port the API/Socket.IO server listens on (default 3001) |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `FRONTEND_URL` | Allowed CORS origin (the frontend's URL) |

`apps/frontend/.env.local`

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API, e.g. `http://localhost:3001/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Base URL of the Socket.IO server, e.g. `http://localhost:3001` |

## History

This repo was formed from two repos, merged with their full history intact:

- backend — `viravelmozhna/collab-plan-node` → `apps/backend`
- frontend — `viravelmozhna/collab-plan-next` → `apps/frontend`
