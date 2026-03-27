# EventZen — API Endpoints

> All requests go through **API Gateway (port 8080)**. Gateway routes by path prefix.

## API Gateway Routes (Spring Cloud Gateway — port 8080)

| Path Pattern | Routes To | Port |
|---|---|---|
| `/api/auth/**` | User & Auth Service | 8081 |
| `/api/events/**` | Event Service | 8082 |
| `/api/venues/**` | Event Service | 8082 |
| `/api/vendors/**` | Event Service | 8082 |
| `/api/attendees/**` | Attendee Service | 3001 |
| `/api/budget/**` | Budget Service | 3002 |

---

## User & Auth Service (Spring Boot — port 8081)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user |  Public |
| POST | `/api/auth/login` | Login → JWT token |  Public |
| GET | `/api/auth/me` | Current user profile |  Any Auth |
| GET | `/api/auth/users` | List all users |  Admin |
| GET | `/api/auth/users/{id}` | Get user by ID | Any Auth |
| PUT | `/api/auth/users/{id}` | Update user role |  Admin |
| DELETE | `/api/auth/users/{id}` | Delete user |  Admin |

## Event Service (Spring Boot — port 8082)

###  Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List events (paginated: `?page=0&size=10`) |  Any Auth |
| POST | `/api/events` | Create new event |  Org/Admin |
| GET | `/api/events/{id}` | Event Details | Any Auth |
| DELETE | `/api/events/{id}` | Delete event |  Org/Admin |
| POST | `/api/events/{eventId}/vendors/{vendorId}` | Assign vendor to event |  Org/Admin |

###  Venues &  Vendors
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/venues` | List all venues |  Any Auth |
| POST | `/api/venues` | Create venue |  Org/Admin |
| GET | `/api/venues/{id}` | Venue details |  Any Auth |
| GET | `/api/vendors` | List all vendors |  Any Auth |
| POST | `/api/vendors` | Create vendor |  Org/Admin |
| GET | `/api/vendors/{id}` | Vendor details | Any Auth |

## Attendee Service (Node.js/Express — port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/attendees/register` | RSVP to an event |  Any Auth |
| GET | `/api/attendees/my-events` | Personal registration list |  Any Auth |
| GET | `/api/attendees/event/{eventId}` | Guest list for specific event | Org/Admin |
| PUT | `/api/attendees/{id}/status` | Update RSVP status |  Org/Admin |

## Budget Service (Node.js/Express — port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/budget` | Set/Update event budget |  Org/Admin |
| GET | `/api/budget/event/{eventId}` | Get event budget details |  Any Auth |
| POST | `/api/budget/expense` | Log a new expense |  Org/Admin |
| GET | `/api/budget/{budgetId}/expenses` | List all expenses for a budget |  Any Auth |
| GET | `/api/budget/event/{eventId}/report` | Budget vs. Spending summary |  Any Auth |
| DELETE | `/api/budget/expense/{id}` | Remove an expense |  Org/Admin |
