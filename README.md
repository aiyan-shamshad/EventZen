# EventZen — Event Management System

A full-stack microservices-based Event Management System built for the **CloudThat Capstone Project**.

## Architecture

```
React (5173) → API Gateway (8080) → Microservices → MySQL
```

All client requests go through a **Spring Cloud API Gateway** which routes to the correct microservice. Services communicate via **OpenFeign** and are protected by **Circuit Breakers**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| API Gateway | Spring Cloud Gateway |
| Backend | Spring Boot (Java 21) + Node.js (Express) |
| Database | MySQL 8 (database-per-service) |
| Auth | JWT (JSON Web Tokens) |
| Inter-Service | OpenFeign |
| Resilience | Resilience4j Circuit Breaker |
| Containerization | Docker + Docker Compose |

## Microservices

| Service | Tech | Port | Database |
|---------|------|------|----------|
| `api-gateway` | Spring Cloud Gateway | 8080 | — |
| `user-auth-service` | Spring Boot | 8081 | eventzen_users |
| `event-service` | Spring Boot + OpenFeign | 8082 | eventzen_events |
| `attendee-service` | Node.js + Express | 3001 | eventzen_attendees |
| `budget-service` | Node.js + Express | 3002 | eventzen_budget |
| `frontend` | React (Vite) | 5173 | — |

## Project Structure

```
├── api-gateway/              # Spring Cloud Gateway
├── user-auth-service/        # Spring Boot
├── event-service/            # Spring Boot + OpenFeign
├── attendee-service/         # Node.js + Express
├── budget-service/           # Node.js + Express
├── frontend/                 # React.js (Vite)
├── docs/                     # ER diagrams, wireframes, API docs
├── init.sql                  # Database initialization
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

### Local Setup & Security
To avoid exposing passwords in GitHub, this project uses environment variables.

#### For Spring Boot Services
The `application.yml` files use placeholders like `${DB_PASSWORD:default}`. You can override these by:
1. Setting system environment variables (e.g., `export DB_PASSWORD=your_pass`).
2. Passing them as Maven arguments: `mvn spring-boot:run -Dspring-boot.run.arguments="--DB_PASSWORD=your_pass"`.

#### For Node.js Services
1. Copy the `.env.example` file to create a `.env` file in each service folder.
2. Update the `.env` file with your actual credentials.
3. The `.env` files are ignored by Git.

### Run Individual Services
```bash
# Spring Boot services
cd user-auth-service && mvn spring-boot:run
cd event-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run

# Node.js services
cd attendee-service && npm start
cd budget-service && npm start

# React frontend
cd frontend && npm run dev
```

## Modules

### 1. User & Authentication
- User registration and login with JWT
- Role-based access control (Admin / Organizer / Attendee)
- BCrypt password hashing

### 2. Event Management
- Create, read, update, delete events
- Venue booking and management
- Vendor coordination
- Uses OpenFeign to fetch user details from Auth Service

### 3. Attendee Management
- Guest list management and RSVP tracking
- Send invitations
- Status tracking: Invited → Confirmed / Declined / Waitlisted

### 4. Budget & Finance
- Budget planning per event
- Expense tracking across 8 categories
- Financial reports with summaries

## License
This project is developed as a capstone project submission.
