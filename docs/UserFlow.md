# EventZen — User Flow

## User Roles
- **Admin** — Full system access, manages users and venues
- **Organizer** — Creates and manages events, attendees, budgets
- **Attendee** — Browses events, RSVPs, views details

## Authentication Flow

```mermaid
flowchart TD
    A[User opens EventZen] --> B{Has account?}
    B -->|No| C[Register Page]
    C --> D[Fill name, email, password]
    D --> E["POST /api/auth/register<br/>(via Gateway :8080)"]
    E --> F[Account created]
    F --> G[Redirect to Login]
    B -->|Yes| G[Login Page]
    G --> H[Enter email & password]
    H --> I["POST /api/auth/login<br/>(via Gateway :8080)"]
    I --> J{Valid?}
    J -->|No| K[Show error]
    K --> G
    J -->|Yes| L[JWT token returned]
    L --> M[Store in localStorage]
    M --> N[Redirect to Dashboard]
```

## Organizer Flow

```mermaid
flowchart TD
    A[Organizer Dashboard] --> B[Create New Event]
    B --> C[Fill event details]
    C --> D[Select Venue]
    D --> E[Set dates & capacity]
    E --> F["POST /api/events<br/>(via Gateway → Event Service)"]
    F --> G[Event Created]

    G --> H{Manage Event}
    H --> I[Manage Attendees]
    H --> J[Manage Budget]
    H --> K[Assign Vendors]

    I --> I1[Send Invitations]
    I --> I2[View Guest List]
    I --> I3[Track RSVPs]

    J --> J1[Set Total Budget]
    J --> J2[Add Expenses]
    J --> J3[View Financial Report]

    K --> K1[Browse Vendors]
    K --> K2[Assign to Event]
```

## Attendee Flow

```mermaid
flowchart TD
    A[Attendee Dashboard] --> B[Browse Events]
    B --> C[View Event Details]
    C --> D{RSVP?}
    D -->|Confirm| E[CONFIRMED status]
    D -->|Decline| F[DECLINED status]
    E --> G[Added to Guest List]
    G --> H[View My Events]
```

## Admin Flow

```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Manage Users]
    A --> C[Full Organizer Privileges]
    A --> D[System Registries]

    B --> B1[View All Users]
    B --> B2[Change Roles]
    B --> B3[Delete Users]

    D --> D1[Add Venues]
    D --> D2[Add Vendors]
```

## Request Flow Through System

```mermaid
sequenceDiagram
    participant U as User Browser
    participant R as React App
    participant GW as API Gateway
    participant AS as Auth Service
    participant ES as Event Service

    U->>R: Click "Create Event"
    R->>GW: POST /api/events (JWT header)
    GW->>ES: Route to Event Service
    ES->>ES: Validate JWT
    ES->>AS: OpenFeign: GET /api/auth/users/5
    AS-->>ES: User details (organizer name)
    ES->>ES: Save event to DB
    ES-->>GW: Event JSON response
    GW-->>R: Pass response
    R-->>U: Show "Event Created!"
```
