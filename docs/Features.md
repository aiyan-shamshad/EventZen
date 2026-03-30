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

## Role Permissions
- **Attendee:** Attendees are the default users in the system. They can browse through the list of published events and view specific event details. Attendees have the ability to register (RSVP) to events, managing their own registrations, and can view a personal list of events they are attending.
- **Organizer:** Organizers have elevated privileges designed for event creation and management. An organizer can create new events, assign venues, and coordinate vendors. They can also delete events, but strictly only the ones they themselves have created. They have full control over the attendee list for their events, can send out invitations, and update RSVP statuses manually. Additionally, organizers have complete financial control, allowing them to create budgets, log expenses, and generate financial reports for their events.
- **Admin:** Admins possess the highest level of access within the system. They inherit all the capabilities of an Organizer (creating events, managing budgets, coordinating attendees, etc.) but also have exclusive system-wide administrative powers. This includes managing the global catalog of venues and vendors. Admins have full user administration rights, allowing them to view all users in the system, change user roles, and delete accounts. Furthermore, admins bypass creator restrictions and can delete any event in the system.

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
