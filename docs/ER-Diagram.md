# EventZen — ER Diagram

## Complete Entity-Relationship Diagram

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password_hash
        ENUM role "ADMIN/ORGANIZER/ATTENDEE"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    VENUES {
        BIGINT id PK
        VARCHAR name
        VARCHAR address
        VARCHAR city
        INT capacity
        DECIMAL cost_per_day
        TIMESTAMP created_at
    }

    EVENTS {
        BIGINT id PK
        VARCHAR title
        TEXT description
        DATETIME start_date
        DATETIME end_date
        BIGINT venue_id FK
        BIGINT organizer_id "cross-service ref to users"
        ENUM status "DRAFT/PUBLISHED/ONGOING/COMPLETED/CANCELLED"
        INT max_attendees
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    VENDORS {
        BIGINT id PK
        VARCHAR name
        VARCHAR service_type
        VARCHAR contact_email
        VARCHAR contact_phone
        DECIMAL cost
        TIMESTAMP created_at
    }

    EVENT_VENDORS {
        BIGINT id PK
        BIGINT event_id FK
        BIGINT vendor_id FK
        TIMESTAMP assigned_at
    }

    REGISTRATIONS {
        BIGINT id PK
        BIGINT event_id "cross-service ref to events"
        BIGINT user_id "cross-service ref to users"
        ENUM status "INVITED/CONFIRMED/DECLINED/WAITLISTED"
        TIMESTAMP registered_at
        TIMESTAMP updated_at
    }

    INVITATIONS {
        BIGINT id PK
        BIGINT event_id "cross-service ref to events"
        VARCHAR email
        VARCHAR invitee_name
        TIMESTAMP sent_at
        ENUM rsvp_status "PENDING/ACCEPTED/DECLINED"
        TIMESTAMP rsvp_at
    }

    BUDGETS {
        BIGINT id PK
        BIGINT event_id "UNIQUE, cross-service ref to events"
        DECIMAL total_budget
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    EXPENSES {
        BIGINT id PK
        BIGINT budget_id FK
        ENUM category "VENUE/CATERING/DECORATION/etc."
        VARCHAR description
        DECIMAL amount
        DATE expense_date
        TIMESTAMP created_at
    }

    VENUES ||--o{ EVENTS : "hosts"
    EVENTS ||--o{ EVENT_VENDORS : "has"
    VENDORS ||--o{ EVENT_VENDORS : "assigned to"
    EVENTS ||--o{ REGISTRATIONS : "has attendees"
    EVENTS ||--o{ INVITATIONS : "sends"
    EVENTS ||--|| BUDGETS : "has budget"
    BUDGETS ||--o{ EXPENSES : "tracks"
```

## Database Boundaries (Microservice Pattern)

```mermaid
graph LR
    subgraph "eventzen_users (Auth Service)"
        U[USERS]
    end
    subgraph "eventzen_events (Event Service)"
        V[VENUES]
        E[EVENTS]
        VD[VENDORS]
        EV[EVENT_VENDORS]
    end
    subgraph "eventzen_attendees (Attendee Service)"
        R[REGISTRATIONS]
        I[INVITATIONS]
    end
    subgraph "eventzen_budget (Budget Service)"
        B[BUDGETS]
        EX[EXPENSES]
    end

    U -.->|"organizer_id (OpenFeign)"| E
    U -.->|"user_id"| R
    E -.->|"event_id"| R
    E -.->|"event_id"| I
    E -.->|"event_id"| B
```

> Dotted lines = cross-service references (stored as IDs, not enforced by FK). Event Service uses **OpenFeign** to call Auth Service for user details.
