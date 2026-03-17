# EventZen — API Endpoints

## User & Auth Service (Spring Boot — port 8081)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login → returns JWT | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| GET | `/api/auth/users` | List all users | Admin only |
| PUT | `/api/auth/users/{id}` | Update user role | Admin only |
| DELETE | `/api/auth/users/{id}` | Delete user | Admin only |

## Event Service (Spring Boot — port 8082)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/events` | Create event | Organizer/Admin |
| GET | `/api/events` | List events (paginated) | Yes |
| GET | `/api/events/{id}` | Event details | Yes |
| PUT | `/api/events/{id}` | Update event | Organizer/Admin |
| DELETE | `/api/events/{id}` | Delete event | Organizer/Admin |
| GET | `/api/events/venues` | List venues | Yes |
| POST | `/api/events/venues` | Add venue | Admin |
| POST | `/api/events/{id}/vendors` | Assign vendor to event | Organizer/Admin |
| GET | `/api/events/vendors` | List vendors | Yes |

## Attendee Service (Node.js — port 3001)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/attendees/register` | RSVP to an event | Yes |
| GET | `/api/attendees/event/{eventId}` | Get guest list for event | Yes |
| PUT | `/api/attendees/{id}/status` | Update RSVP status | Yes |
| POST | `/api/attendees/invite` | Send invitation | Organizer/Admin |
| GET | `/api/attendees/my-events` | My registered events | Yes |

## Budget Service (Node.js — port 3002)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/budget` | Create budget for event | Organizer/Admin |
| GET | `/api/budget/event/{eventId}` | Get event budget | Yes |
| POST | `/api/budget/expense` | Add expense | Organizer/Admin |
| GET | `/api/budget/event/{eventId}/expenses` | List expenses | Yes |
| GET | `/api/budget/event/{eventId}/report` | Financial summary report | Yes |
