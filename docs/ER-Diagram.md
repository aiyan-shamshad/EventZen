# EventZen — ER Diagram

## Complete Entity-Relationship Diagram

```mermaid
erDiagram
    %% ==========================================
    %% DATABASE: eventzen_users
    %% ==========================================
    USERS {
        BIGINT id PK "Auto-increment"
        VARCHAR name "NOT NULL"
        VARCHAR email "UNIQUE, NOT NULL"
        VARCHAR password_hash "NOT NULL"
        ENUM role "ADMIN / ORGANIZER / ATTENDEE"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% ==========================================
    %% DATABASE: eventzen_events
    %% ==========================================
    VENUES {
        BIGINT id PK "Auto-increment"
        VARCHAR name "NOT NULL"
        VARCHAR address "NOT NULL"
        VARCHAR city
        INT capacity "NOT NULL"
        DECIMAL cost_per_day "NOT NULL"
        TIMESTAMP created_at
    }

    EVENTS {
        BIGINT id PK "Auto-increment"
        VARCHAR title "NOT NULL"
        TEXT description
        DATETIME start_date "NOT NULL"
        DATETIME end_date "NOT NULL"
        BIGINT venue_id FK "References venues"
        BIGINT organizer_id "References users (cross-service)"
        ENUM status "DRAFT / PUBLISHED / ONGOING / COMPLETED / CANCELLED"
        INT max_attendees
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    VENDORS {
        BIGINT id PK "Auto-increment"
        VARCHAR name "NOT NULL"
        VARCHAR service_type "NOT NULL"
        VARCHAR contact_email
        VARCHAR contact_phone
        DECIMAL cost
        TIMESTAMP created_at
    }

    EVENT_VENDORS {
        BIGINT id PK "Auto-increment"
        BIGINT event_id FK "References events"
        BIGINT vendor_id FK "References vendors"
        TIMESTAMP assigned_at
    }

    %% ==========================================
    %% DATABASE: eventzen_attendees
    %% ==========================================
    REGISTRATIONS {
        BIGINT id PK "Auto-increment"
        BIGINT event_id "References events (cross-service)"
        BIGINT user_id "References users (cross-service)"
        ENUM status "INVITED / CONFIRMED / DECLINED / WAITLISTED"
        TIMESTAMP registered_at
        TIMESTAMP updated_at
    }

    INVITATIONS {
        BIGINT id PK "Auto-increment"
        BIGINT event_id "References events (cross-service)"
        VARCHAR email "NOT NULL"
        VARCHAR invitee_name
        TIMESTAMP sent_at
        ENUM rsvp_status "PENDING / ACCEPTED / DECLINED"
        TIMESTAMP rsvp_at
    }

    %% ==========================================
    %% DATABASE: eventzen_budget
    %% ==========================================
    BUDGETS {
        BIGINT id PK "Auto-increment"
        BIGINT event_id "UNIQUE, references events (cross-service)"
        DECIMAL total_budget "NOT NULL"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    EXPENSES {
        BIGINT id PK "Auto-increment"
        BIGINT budget_id FK "References budgets"
        ENUM category "VENUE / CATERING / DECORATION / etc."
        VARCHAR description
        DECIMAL amount "NOT NULL"
        DATE expense_date "NOT NULL"
        TIMESTAMP created_at
    }

    %% ==========================================
    %% RELATIONSHIPS
    %% ==========================================
    VENUES ||--o{ EVENTS : "hosts"
    EVENTS ||--o{ EVENT_VENDORS : "has"
    VENDORS ||--o{ EVENT_VENDORS : "assigned to"
    EVENTS ||--o{ REGISTRATIONS : "has attendees"
    EVENTS ||--o{ INVITATIONS : "sends"
    EVENTS ||--|| BUDGETS : "has budget"
    BUDGETS ||--o{ EXPENSES : "tracks"
```

## Database Boundaries

```mermaid
graph LR
    subgraph "eventzen_users"
        U[USERS]
    end
    subgraph "eventzen_events"
        V[VENUES]
        E[EVENTS]
        VD[VENDORS]
        EV[EVENT_VENDORS]
    end
    subgraph "eventzen_attendees"
        R[REGISTRATIONS]
        I[INVITATIONS]
    end
    subgraph "eventzen_budget"
        B[BUDGETS]
        EX[EXPENSES]
    end

    U -.->|"organizer_id<br/>(cross-service ref)"| E
    U -.->|"user_id<br/>(cross-service ref)"| R
    E -.->|"event_id<br/>(cross-service ref)"| R
    E -.->|"event_id<br/>(cross-service ref)"| I
    E -.->|"event_id<br/>(cross-service ref)"| B
```

> **Note:** Dotted lines represent cross-service references. These are stored as IDs but NOT enforced by foreign keys since they span different databases. The application layer ensures consistency.
