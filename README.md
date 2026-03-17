# EventZen — Event Management System

A full-stack microservices-based Event Management System built for the **CloudThat Capstone Project**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Backend | Spring Boot (Java 21) + Node.js (Express) |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) |
| Containerization | Docker + Docker Compose |
| Architecture | Microservices |

## Microservices

| Service | Tech | Port | Description |
|---------|------|------|-------------|
| `user-auth-service` | Spring Boot | 8081 | User registration, login, JWT, roles |
| `event-service` | Spring Boot | 8082 | Event CRUD, venues, vendors |
| `attendee-service` | Node.js | 3001 | Guest lists, RSVPs, invitations |
| `budget-service` | Node.js | 3002 | Budgets, expenses, reports |
| `frontend` | React | 5173 | Single Page Application |

## Project Structure

```
├── frontend/                 # React.js (Vite)
├── user-auth-service/        # Spring Boot
├── event-service/            # Spring Boot
├── attendee-service/         # Node.js + Express
├── budget-service/           # Node.js + Express
├── docs/                     # ER diagrams, wireframes, API docs
├── init.sql                  # Database initialization script
└── docker-compose.yml        # Container orchestration
```

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8
- Docker Desktop (for containerized deployment)

### Database Setup
```bash
mysql -u root -p < init.sql
```

## Modules

### 1. User & Authentication
- User registration and login
- JWT-based authentication
- Role-based access (Admin / Organizer / Attendee)

### 2. Event Management
- Create, read, update, delete events
- Venue booking and management
- Vendor coordination

### 3. Attendee Management
- Guest list management
- RSVP tracking
- Send invitations

### 4. Budget & Finance
- Budget planning per event
- Expense tracking
- Financial reports and summaries

## License
This project is developed as a capstone project submission.
