# Bidboard

Bidboard / Taskbid is a full-stack marketplace platform that enables administrators to post paid micro-tasks and allows freelancers to bid, complete work, and track their earnings. Built with NestJS backend, Vue 3 frontend, MySQL database via Prisma 7, and Docker-based infrastructure.

## Features

- **Role-based Authentication** – JWT-secured login with Admin and Freelancer roles
- **Projects & Tasks Management** – Admins organize work into projects and create tasks with lifecycle statuses (OPEN → ASSIGNED → COMPLETED → APPROVED/CANCELLED)
- **Bidding System** – Freelancers submit bids (message + task reference); admins accept or reject bids
- **Work Assignment** – When a bid is accepted, work is automatically created and assigned to the freelancer
- **Completion Workflow** – Freelancers submit completion URLs; admins review and approve work
- **Payment System** – Admins can mark work as paid, which increases freelancer balance
- **Role-based Data Access** – Different views for admins and freelancers based on their roles
- **Public Area** – Landing page with open tasks accessible without authentication

## Tech Stack

| Layer      | Tech                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Frontend   | Vue 3, TypeScript, Vite                                             |
| Backend    | NestJS, TypeScript, JWT (Passport), class-validator, class-transformer |
| Database   | MySQL 8.0, Prisma 7 ORM with MariaDB adapter                        |
| Infra      | Docker, docker-compose, hot reload for dev                           |

## Project Structure

```
Bidboard/
├── client/          # Vue 3 SPA
│   ├── src/
│   └── package.json
├── server/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication & Authorization
│   │   ├── projects/ # Projects module
│   │   ├── tasks/    # Tasks module
│   │   ├── bids/     # Bids module
│   │   ├── works/    # Works module
│   │   └── database/ # Database service
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── adapter.ts
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+ (for local dev outside Docker)
- Docker & docker-compose
- MySQL client (optional, for database inspection)

### Environment Variables

The application uses environment variables configured in `docker-compose.yml`. For local development, you can create a `.env` file:

```env
# Database
DATABASE_URL=mysql://taskbid:taskbid@localhost:3306/taskbid
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=taskbid
DB_PASSWORD=taskbid
DB_NAME=taskbid

# JWT
JWT_SECRET=your-secret-key-here

# Server
NODE_ENV=development
PORT=3000

# Client
VITE_API_URL=http://localhost:3000
```

### Run with Docker

```bash
# Start all services
docker compose up --build

# Start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f server

# Stop services
docker compose down
```

**Services:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Database**: MySQL on port 3306

### Database Setup

After starting the services, run migrations and seed the database:

```bash
# Enter the server container
docker compose exec server bash

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

**Default Credentials (from seed):**
- Admin: `admin@taskbid.com` / `password123`
- Freelancer: `freelancer@taskbid.com` / `password123`

### Run Locally (without Docker)

**Backend:**
```bash
cd server
npm install
npm run start:dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Ensure MySQL is running locally and the `DATABASE_URL` points to it.

## API Documentation

All API endpoints are prefixed with `/api`.

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "names": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Include the token in subsequent requests:
```http
Authorization: Bearer <access_token>
```

### Projects

#### List Projects
```http
GET /api/projects?currentPage=1&limit=10&search=
```
- **Auth:** Not required
- **Response:** Paginated list of projects with task counts

#### Get Project
```http
GET /api/projects/:id
```
- **Auth:** Not required
- **Response:** Project details with associated tasks

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description"
}
```
- **Auth:** Required (ADMIN only)

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```
- **Auth:** Required (ADMIN only)

### Tasks

#### List Tasks
```http
GET /api/tasks?currentPage=1&limit=10&search=
Authorization: Bearer <token> (optional)
```
- **Auth:** Optional
- **Behavior:**
  - **Admin:** Sees all tasks
  - **Freelancer/Unauthenticated:** Sees only OPEN tasks

#### Get Task
```http
GET /api/tasks/:id
Authorization: Bearer <token> (optional)
```
- **Auth:** Optional
- **Behavior:**
  - **Admin:** Sees all task details including assigned freelancer and bids
  - **Freelancer/Unauthenticated:** Sees only OPEN tasks

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Task Name",
  "description": "Task description",
  "project_id": "project-uuid",
  "price": 100,
  "skills": ["React", "TypeScript", "CSS"]
}
```
- **Auth:** Required (ADMIN only)

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Task Name",
  "description": "Updated description",
  "price": 150,
  "skills": ["Vue", "TypeScript"]
}
```
- **Auth:** Required (ADMIN only)

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```
- **Auth:** Required (ADMIN only)

### Bids

#### List Bids
```http
GET /api/bids?currentPage=1&limit=10
Authorization: Bearer <token>
```
- **Auth:** Required
- **Behavior:**
  - **Admin:** Sees all bids with freelancer details
  - **Freelancer:** Sees only their own bids

#### Get Bid
```http
GET /api/bids/:id
Authorization: Bearer <token>
```
- **Auth:** Required

#### Create Bid
```http
POST /api/bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task-uuid",
  "message": "I can complete this task efficiently"
}
```
- **Auth:** Required (FREELANCER only)
- **Validation:**
  - Task must exist
  - Task must be OPEN
  - Freelancer must not have already bid on this task

#### Accept Bid
```http
PUT /api/bids/:id/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "endDate": "2025-12-31"
}
```
- **Auth:** Required (ADMIN only)
- **Behavior:**
  - Updates bid status to ACCEPTED
  - Creates Work record for the freelancer
  - Rejects all other bids for the same task
  - Updates task status to ASSIGNED

#### Reject Bid
```http
PUT /api/bids/:id/reject
Authorization: Bearer <token>
```
- **Auth:** Required (ADMIN only)
- **Behavior:** Updates bid status to REJECTED

### Works

#### List Works
```http
GET /api/works?currentPage=1&limit=10&workStatus=IN_PROGRESS
Authorization: Bearer <token>
```
- **Auth:** Required
- **Query Parameters:**
  - `workStatus` (optional): Filter by `IN_PROGRESS` or `COMPLETED`
- **Behavior:**
  - **Admin:** Sees all works with freelancer details
  - **Freelancer:** Sees only their own works

#### Get Work
```http
GET /api/works/:id
Authorization: Bearer <token>
```
- **Auth:** Required

#### Complete Work
```http
PUT /api/works/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "completionUrl": "https://example.com/completed-work"
}
```
- **Auth:** Required (FREELANCER only)
- **Behavior:**
  - Updates work with completion URL
  - Sets work status to COMPLETED

#### Pay Work
```http
PUT /api/works/:id/pay
Authorization: Bearer <token>
```
- **Auth:** Required (ADMIN only)
- **Behavior:**
  - Increases freelancer balance by task price
  - Updates work status (if needed)

## Authentication & Authorization

### JWT Strategy

The application uses JWT tokens for authentication. Tokens are issued on login and must be included in the `Authorization` header for protected routes.

### Role-Based Access Control

- **ADMIN:** Full access to all resources, can create/update/delete projects and tasks, accept/reject bids, pay works
- **FREELANCER:** Can view open tasks, create bids, view their own bids and works, complete work

### Guards

- `JwtGuard`: Requires valid JWT token
- `OptionalJwtGuard`: Allows both authenticated and unauthenticated access
- `RolesGuard`: Enforces role-based access (used with `@Roles()` decorator)

## Development

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration-name

# Apply migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Code Structure

The backend follows NestJS best practices:

- **Modules:** Each feature has its own module (auth, projects, tasks, bids, works)
- **Controllers:** Handle HTTP requests and responses
- **Services:** Contain business logic
- **Helpers:** Reusable helper functions (e.g., data fetching based on user role)
- **DTOs:** Data Transfer Objects for validation
- **Guards:** Authentication and authorization guards

### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { DatabaseService } from '@/database/database.service';
import { CurrentUser } from '@/auth/current-user.decorator';
```

### Validation

All DTOs use `class-validator` decorators. The global `ValidationPipe` is configured with:
- `whitelist: true` - Strips non-whitelisted properties
- `forbidNonWhitelisted: true` - Throws error for non-whitelisted properties
- `transform: true` - Automatically transforms payloads to DTO instances


## Troubleshooting

### Database Connection Issues

If you encounter connection errors:
1. Ensure MySQL container is running: `docker compose ps`
2. Check database credentials in `docker-compose.yml`
3. Verify Prisma client is generated: `npx prisma generate`

### Port Already in Use

If ports 3000, 5173, or 3306 are already in use:
1. Stop the conflicting service
2. Or modify port mappings in `docker-compose.yml`

### Prisma Client Errors

If you see "Cannot find module" errors:
1. Regenerate Prisma client: `npx prisma generate`
2. Restart the server container

##Live Demo
https://drive.google.com/file/d/1-QENoU-pbiU61kGgnyrEAeOlaCQpbYfZ/view?usp=drive_link

