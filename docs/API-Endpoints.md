# EventZen — API Endpoints

> All requests go through **API Gateway (port 8080)**. Gateway routes by path prefix.

## API Gateway Routes (Spring Cloud Gateway — port 8080)

| Path Pattern | Routes To | Port |
|---|---|---|
| `/api/auth/**` | User & Auth Service | 8081 |
| `/api/events/**` | Event Service | 8082 |
| `/api/attendees/**` | Attendee Service | 3001 |
| `/api/budget/**` | Budget Service | 3002 |

---

## User & Auth Service (Spring Boot — port 8081)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login → JWT token | No |
| GET | `/api/auth/me` | Current user profile | Yes |
| GET | `/api/auth/users` | List all users | Admin |
| GET | `/api/auth/users/{id}` | Get user by ID (used by OpenFeign) | Yes |
| PUT | `/api/auth/users/{id}` | Update user role | Admin |
| DELETE | `/api/auth/users/{id}` | Delete user | Admin |

## Event Service (Spring Boot + OpenFeign — port 8082)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/events` | Create event | Organizer/Admin |
| GET | `/api/events` | List events (paginated) | Yes |
| GET | `/api/events/{id}` | Event details (includes organizer name via OpenFeign) | Yes |
| PUT | `/api/events/{id}` | Update event | Organizer/Admin |
| DELETE | `/api/events/{id}` | Delete event | Organizer/Admin |
| GET | `/api/events/venues` | List venues | Yes |
| POST | `/api/events/venues` | Add venue | Admin |
| GET | `/api/events/vendors` | List vendors | Yes |
| POST | `/api/events/{id}/vendors` | Assign vendor to event | Organizer/Admin |

## Attendee Service (Node.js — port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/attendees/register` | RSVP to an event | Yes |
| GET | `/api/attendees/event/{eventId}` | Guest list for event | Yes |
| PUT | `/api/attendees/{id}/status` | Update RSVP status | Yes |
| POST | `/api/attendees/invite` | Send invitation | Organizer/Admin |
| GET | `/api/attendees/my-events` | My registered events | Yes |

## Budget Service (Node.js — port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/budget` | Create budget for event | Organizer/Admin |
| GET | `/api/budget/event/{eventId}` | Get event budget | Yes |
| POST | `/api/budget/expense` | Add expense | Organizer/Admin |
| GET | `/api/budget/event/{eventId}/expenses` | List expenses | Yes |
| GET | `/api/budget/event/{eventId}/report` | Financial summary | Yes |
