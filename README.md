# TaskBid

TaskBid is a full-stack marketplace that lets an administrator post paid micro-tasks and lets freelancers bid, complete work, and track their earnings. It combines a Nest.js API, Vue 3 frontend, PostgreSQL via Prisma, and Docker-based infrastructure to deliver an end-to-end workflow similar to a lightweight Upwork/Fiverr.

## Features

- **Role-based auth** – JWT-secured login with Admin and Freelancer roles.
- **Projects & tasks** – Admins organize work into projects and create tasks with lifecycle statuses (OPEN → ASSIGNED → COMPLETED → APPROVED/CANCELLED).
- **Bidding system** – Freelancers submit bids (price + message); admins approve or reject and assign winners.
- **Completion workflow** – Accepted freelancers submit delivery links; admins review, approve, and mark paid.
- **Freelancer earnings** – Dashboard summaries for approved income, pending work, and history.
- **Public area** – Landing page with open tasks and registration for new freelancers.

## Tech Stack

| Layer      | Tech                                                        |
| ---------- | ----------------------------------------------------------- |
| Frontend   | Vue 3, TypeScript, Vite, Pinia, Axios                       |
| Backend    | Nest.js, TypeScript, JWT, class-validator, Swagger (opt)    |
| Database   | PostgreSQL, Prisma ORM                                      |
| Infra      | Docker, docker-compose, hot reload for dev                  |

## Project Structure

```
Bidboard/
├── client/   # Vue 3 SPA
├── server/   # Nest.js API
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+ (for local dev outside Docker)
- Docker & docker-compose

### Environment

Create a `.env` file in the repo root (and service-specific overrides if needed):

```
# Shared
DATABASE_URL=postgresql://taskbid:taskbid@db:5432/taskbid
JWT_SECRET=super-secret
```

For local (non-Docker) runs, add service-specific `.env` files under `client/` and `server/` with their ports and API URLs.

### Run with Docker

```bash
docker compose up --build
```

Services:

- `frontend`: http://localhost:5173
- `backend`: http://localhost:3000
- `db`: PostgreSQL on port 5432

Prisma migrations run inside the backend container (e.g., `docker compose exec server npx prisma migrate dev`).

### Run Locally (without Docker)

```bash
# API
cd server
npm install
npm run start:dev

# Frontend
cd client
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Ensure PostgreSQL is running locally and the `DATABASE_URL` points to it.

## Roadmap

- Seed data for demo users/tasks.
- Complete Vue views for public, freelancer, and admin areas.
- Implement Prisma schema + migrations.
- Add Swagger docs and automated tests.

## License

Proprietary – see project owners for usage terms.

