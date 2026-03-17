# EventZen — Features & Module Details

## Module 1: User & Authentication

### Features
- **User Registration** — New users can sign up with name, email, and password
- **User Login** — Authenticate with email/password, receive JWT token
- **Role-Based Access** — Three roles: Admin, Organizer, Attendee
- **Profile Management** — View and update own profile
- **User Administration** — Admin can list, update roles, and delete users
- **JWT Security** — Stateless authentication across all microservices

### Technical Details
- Passwords hashed with BCrypt
- JWT tokens contain user ID, email, and role
- Token expiry: 24 hours

---

## Module 2: Event Management

### Features
- **Create Events** — Organizers create events with title, description, dates, venue
- **Event Listing** — Browse all published events with pagination
- **Event Details** — View complete event information
- **Venue Management** — Add and browse venues with capacity and pricing
- **Vendor Coordination** — Assign vendors (caterers, decorators, etc.) to events
- **Event Status Tracking** — Draft → Published → Ongoing → Completed / Cancelled

### Technical Details
- JPA relationships: Event → Venue (Many-to-One), Event ↔ Vendor (Many-to-Many)
- Pagination and sorting support
- Only organizer/admin can create and modify events

---

## Module 3: Attendee Management

### Features
- **RSVP System** — Attendees can register for events
- **Guest List** — View all attendees for an event
- **Invitation System** — Organizers send email invitations
- **RSVP Tracking** — Track statuses: Invited, Confirmed, Declined, Waitlisted
- **My Events** — Attendees view their registered events

### Technical Details
- Unique constraint: one registration per user per event
- Status transitions: Invited → Confirmed/Declined

---

## Module 4: Budget & Finance

### Features
- **Budget Creation** — Set a total budget for each event
- **Expense Tracking** — Log individual expenses by category
- **Categories** — Venue, Catering, Decoration, Entertainment, Marketing, Transportation, Staff, Miscellaneous
- **Financial Reports** — Summary of total budget, total spent, remaining balance
- **Expense Breakdown** — View expenses by category with percentages

### Technical Details
- One budget per event (unique constraint)
- Report includes: total budget, total expenses, balance, category-wise breakdown
