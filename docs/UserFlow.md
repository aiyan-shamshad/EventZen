# EventZen — User Flow

## User Roles
- **Admin** — Full system access, manages users
- **Organizer** — Creates and manages events, attendees, budgets
- **Attendee** — Browses events, RSVPs, views details

## Flow Diagrams

### Registration & Authentication Flow
```mermaid
flowchart TD
    A[User visits EventZen] --> B{Has account?}
    B -->|No| C[Register Page]
    C --> D[Fill name, email, password]
    D --> E[POST /api/auth/register]
    E --> F[Account created]
    F --> G[Redirect to Login]
    B -->|Yes| G[Login Page]
    G --> H[Enter email & password]
    H --> I[POST /api/auth/login]
    I --> J{Valid credentials?}
    J -->|No| K[Show error]
    K --> G
    J -->|Yes| L[JWT token returned]
    L --> M[Store token in localStorage]
    M --> N[Redirect to Dashboard]
```

### Organizer Flow
```mermaid
flowchart TD
    A[Organizer Dashboard] --> B[Create New Event]
    B --> C[Fill event details]
    C --> D[Select/Add Venue]
    D --> E[Set dates & capacity]
    E --> F[Publish Event]
    
    F --> G{Manage Event}
    G --> H[Manage Attendees]
    G --> I[Manage Budget]
    G --> J[Assign Vendors]
    
    H --> H1[Send Invitations]
    H --> H2[View Guest List]
    H --> H3[Track RSVPs]
    
    I --> I1[Set Total Budget]
    I --> I2[Add Expenses]
    I --> I3[View Financial Report]
    
    J --> J1[Browse Vendors]
    J --> J2[Assign to Event]
```

### Attendee Flow
```mermaid
flowchart TD
    A[Attendee Dashboard] --> B[Browse Events]
    B --> C[View Event Details]
    C --> D{RSVP?}
    D -->|Yes| E[Confirm Attendance]
    D -->|No| F[Decline]
    E --> G[Added to Guest List]
    G --> H[View My Events]
```

### Admin Flow
```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Manage Users]
    A --> C[View All Events]
    A --> D[System Overview]
    
    B --> B1[View All Users]
    B --> B2[Change User Roles]
    B --> B3[Delete Users]
    
    C --> C1[Monitor Events]
    C --> C2[Manage Venues]
```
