# EventZen — Features & Module Details

## Architecture Features

| Feature | Technology | Description |
|---------|-----------|-------------|
| API Gateway | Spring Cloud Gateway | Single entry point, routes all requests |
| Inter-Service Communication | OpenFeign | Event Service calls Auth Service for user details |
| Circuit Breaker | Resilience4j | Fallback responses when a service is down |
| Authentication | JWT (JSON Web Tokens) | Stateless auth across all microservices |
| Database-Per-Service | MySQL 8 | Each microservice has its own database |

---

## Module 1: User & Authentication

### Features
- **User Registration** — Sign up with name, email, and password
- **User Login** — Authenticate and receive JWT token
- **Role-Based Access** — Three roles: Admin, Organizer, Attendee
- **Profile Management** — View current user profile via JWT
- **User Administration** — Admin: list, update roles, delete users
- **Password Security** — BCrypt hashing

### Technical Details
- Spring Boot + Spring Security
- JWT tokens contain user ID, email, and role
- Token expiry: 24 hours
- Exposes `GET /api/auth/users/{id}` for OpenFeign calls from other services

---

## Module 2: Event Management

### Features
- **Create Events** — Title, description, dates, venue, capacity
- **Event Listing** — Paginated list with search/filter
- **Event Details** — Includes organizer name (fetched via OpenFeign)
- **Venue Management** — Add and browse venues with capacity and pricing
- **Vendor Coordination** — Assign vendors to events (Many-to-Many)
- **Event Status** — Draft → Published → Ongoing → Completed / Cancelled

### Technical Details
- Spring Boot + Spring Data JPA
- JPA relationships: Event → Venue (Many-to-One), Event ↔ Vendor (Many-to-Many)
- **OpenFeign** to call Auth Service for organizer details
- Pagination and custom query support

---

## Module 3: Attendee Management

### Features
- **RSVP System** — Attendees register for events
- **Guest List** — View all attendees for an event
- **Invitation System** — Organizers invite by email
- **Status Tracking** — Invited → Confirmed / Declined / Waitlisted
- **My Events** — Attendees view their registered events

### Technical Details
- Node.js + Express + Sequelize ORM
- Unique constraint: one registration per user per event
- JWT middleware validates tokens using shared secret

---

## Module 4: Budget & Finance

### Features
- **Budget Creation** — Set total budget per event (one budget per event)
- **Expense Tracking** — Log individual expenses with category, amount, and date
- **5 Categories** — VENUE, CATERING, MARKETING, STAFF, OTHER
- **Financial Reports** — Total budget, total spent, remaining balance, and expense summary

### Technical Details
- Node.js + Express + Sequelize ORM
- One budget per event (unique constraint on event_id)
- Report endpoint calculates aggregates dynamically
