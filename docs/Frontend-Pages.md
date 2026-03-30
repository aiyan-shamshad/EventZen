# EventZen — Frontend URLs & Pages

The EventZen frontend is a Single Page Application (SPA) built with React and Vite. It uses `react-router-dom` for client-side routing.

## Public Pages
These pages are accessible to anyone, whether they are logged in or not.

| URL Path | Component / Page | Description |
|---|---|---|
| `/` | **Landing Page** | The main marketing page featuring the hero section, core features, and links to register or login. |
| `/login` | **Login Page** | User authentication. On successful login, stores the JWT token and redirects to the Dashboard. |
| `/register` | **Register Page** | New user sign-up form. Captures name, email, and password. |

---

## Protected Pages (Requires Authentication)
Accessing these URLs without a valid JWT token will automatically redirect the user back to `/login`.

| URL Path | Component / Page | Description | Role Access |
|---|---|---|---|
| `/dashboard` | **Dashboard** | The central hub for the user. Displays personalized content based on role (e.g., Attendee sees their upcoming events; Organizer sees events they manage). | All Authenticated Users |
| `/events` | **Events List** | A paginated list or grid of all published events available in the system. Users can browse and click to view details. | All Authenticated Users |
| `/events/new` | **Create Event** | Form for Organizers and Admins to create a new event (title, description, dates, venue selection). | Organizer / Admin |
| `/events/:id` | **Event Details** | Comprehensive view of a specific event. Shows guest lists, budget information (if allowed), and provides RSVP/registration functionality. | All Authenticated Users |
| `/admin` | **Admin Panel** | High-level system dashboard for managing users, venues, and vendors. | Admin Only |

## Route Behaviors
- **Catch-all Redirect:** Any undefined route or base nested path generally redirects to `/dashboard` if authenticated, or falls back appropriately to prevent 404 dead-ends.
- **Navigation Navbar:** The top `Navbar` component persists across all routes, dynamically showing login/register buttons for guests, or logout/user profile information for authenticated users.
