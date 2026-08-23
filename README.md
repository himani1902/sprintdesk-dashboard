# SprintDesk — Sprint Management Dashboard

A production-grade Sprint Management and Agile Kanban Dashboard built with **React 18+**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, **Zustand**, **TanStack Query v5**, and **@dnd-kit/core**.

---

## Assignment Overview and Compliance Matrix

| Area | Requirement | Implementation Status |
| :--- | :--- | :--- |
| **Framework & Build** | React 18+, TypeScript (Strict), Vite | Completed |
| **State Separation** | TanStack Query v5 (Server) + Zustand (Client) | Completed |
| **Drag & Drop** | `@dnd-kit/core` with cross-column reordering & undo | Completed |
| **Data Visualizations** | Recharts (Velocity, Status, Priority, Completion Trend) | Completed |
| **Design System** | Handcrafted Tailwind UI (Button, Input, Modal, Toast, etc.) | 100% Zero External UI Libraries |
| **Authentication** | DummyJSON Auth API + In-memory token + Silent refresh queue | Completed |
| **Real-time System** | Notification polling with tab visibility pausing (`document.hidden`) | Completed |
| **Responsive & A11y** | 375px mobile responsive, WCAG AA contrast, keyboard navigation | Completed |
| **Testing** | Vitest + React Testing Library (Unit & Integration tests) | 100% Passing |

---

## Architecture and Technical Decisions

### 1. State Management Architecture

The application strictly separates **Server State**, **Application Client State**, and **Local Component State**:

```text
+--------------------------------------------------------+
|                     UI Layer                           |
|     (Pages, Kanban Board, Analytics Charts, Modals)    |
+-------------------+--------------------------------+---+
                    |                                |
                    v                                v
       +------------------------+       +-------------------------+
       |   Client State Store   |       |   Server / Cache State  |
       |       (Zustand)        |       |   (TanStack Query v5)   |
       +------------------------+       +-------------------------+
       | * Active Kanban Tasks  |       | * Initial Mock Data     |
       | * Auth & User Session  |       | * Polled Notifications  |
       | * Notifications Queue  |       | * Automatic Refetching  |
       | * Theme Preference     |       | * Window Focus Controls |
       | * Undo History Stack   |       | * Tab Visibility Guard  |
       +------------------------+       +------------+------------+
                                                     |
                                                     v
                                        +-------------------------+
                                        |   API & Service Layer   |
                                        |  (apiClient Interceptor)|
                                        +-------------------------+
                                        | * POST /auth/login      |
                                        | * POST /auth/refresh    |
                                        | * GET /posts (polling)  |
                                        | * GET /mock-data.json   |
                                        +-------------------------+
```

### 2. Authentication & Interceptor Pipeline
- **In-Memory Access Token**: Access tokens are kept strictly in-memory (`inMemoryAccessToken`) to prevent XSS exfiltration.
- **Silent Refresh & Concurrency Queue**: When a `401 Unauthorized` is returned by protected endpoints:
  1. Requests are queued in `failedQueue`.
  2. The interceptor initiates a silent refresh request to `https://dummyjson.com/auth/refresh`.
  3. On success, the in-memory token is updated, and all queued requests are replayed with the new Bearer token.
  4. On failure, the session is invalidated and the user is redirected to `/login`.
- **Strict Route Protection**: All internal workspace views (`/dashboard`, `/board`, `/analytics`) are protected via `<ProtectedRoute requireAuth={true} />`.

### 3. Drag-and-Drop Kanban (`@dnd-kit/core`)
- Built using `@dnd-kit/core` with `PointerSensor` and `KeyboardSensor`.
- Supports intra-column sorting and cross-column status transitions (Backlog to In Progress to Review to Done).
- **Undo Operation**: Every task drag records an `UndoOperation` in Zustand. A 6-second snackbar allows instant rollback to the previous column position.

### 4. Custom Design System (Zero External UI Libraries)
Crafted entirely from scratch using Tailwind CSS:
- `Button`: Primary, secondary, outline, ghost, danger variants with loading spinner states.
- `Input`: Integrated floating labels, error states, left/right icon slots, and password strength evaluation.
- `Select`: Fully accessible custom dropdown select.
- `Modal` & `Drawer`: Focus-trapped accessible dialogs with backdrop click handling and ESC key dismiss.
- `Toast` (`useToast`): Imperative hook dispatching stackable success, error, warning, and info notifications.
- `DataTable`: Column sorting, stacked responsive pagination, and badge indicators.
- `Skeleton`: Reusable loading pulse primitives (`SkeletonText`, `SkeletonCard`, `SkeletonAvatar`).

---

## Analytics and Visualizations

The `/analytics` page derives real-time metrics dynamically from the active board state:
1. **Sprint Velocity**: Bar chart comparing completed story points vs. planned points across sprints.
2. **Status Distribution**: Donut chart breakdown across workflow stages.
3. **Priority Breakdown**: Multi-bar breakdown of high, medium, and low priority tasks per status column.
4. **Completion Trend**: Area curve tracking cumulative task completions over sprint timelines.
5. **Bonus Capabilities**:
   - **PNG Export**: Exports the analytics dashboard canvas directly as high-resolution PNG image.
   - **Sprint Filtering**: Filter charts across individual sprints or all sprints combined.

---

## Real-Time Notification System

- Polls `https://jsonplaceholder.typicode.com/posts?_limit=5` at regular 15-second intervals.
- **Tab Visibility Guard**: Automatically halts network polling when the browser tab is inactive (`document.hidden === true`) and resumes on focus.
- **Unread Badge & Toast Dispatch**: New items increment the header notification bell badge and trigger a non-blocking toast when the panel is closed.

---

## Project Structure

```text
sprintdesk-dashboard/
|-- public/
|   |-- favicon.svg
|   |-- icons.svg
|   `-- mock-data.json          # Primary initial dataset (Users, Sprints, 30 Tasks, Comments, Notifications)
|-- src/
|   |-- api/                    # Centralized API service layer
|   |   |-- auth.api.ts         # Login & token refresh API
|   |   |-- client.ts           # Interceptor, token management & retry queue
|   |   |-- notifications.api.ts# JSONPlaceholder polling API
|   |   `-- tasks.api.ts        # Board data service & mock-data loader
|   |-- components/
|   |   |-- analytics/          # Recharts visualizations (Velocity, Status, Priority, Trend)
|   |   |-- board/              # Kanban board, columns, cards, drawer, filters, create task modal
|   |   |-- common/             # ProtectedRoute guards & PageLoader
|   |   |-- layout/             # AppLayout, Header, Sidebar, NotificationBell
|   |   `-- ui/                 # Reusable UI primitives (Button, Input, Select, Modal, Drawer, Toast, etc.)
|   |-- hooks/                  # Custom hooks (useAuth, useBoardTasks, useNotifications, useToast)
|   |-- pages/                  # Route views (LoginPage, DashboardPage, BoardPage, AnalyticsPage)
|   |-- store/                  # Zustand global stores (auth, board, notifications, theme)
|   |-- test/                   # Vitest unit & integration test suites
|   |-- types/                  # TypeScript interfaces & type definitions
|   |-- utils/                  # Export utilities, storage wrappers, date formatters
|   |-- App.tsx                 # Route declarations & QueryClient provider
|   |-- index.css               # Base Tailwind CSS styles
|   `-- main.tsx                # React DOM root mounting
|-- index.html
|-- package.json
|-- tailwind.config.js
|-- tsconfig.json
`-- vite.config.ts
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/himani1902/sprintdesk-dashboard.git
cd sprintdesk-dashboard

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
The application will be live at `http://localhost:5173/`.

### Running Unit Tests
```bash
npm test
```

### Production Build & Type Check
```bash
npm run build
```

---

## Submission Details

| Field | Submission Value |
| :--- | :--- |
| **Candidate Name** | Himani |
| **Role Applied** | Frontend Engineer |
| **GitHub Repository** | [https://github.com/himani1902/sprintdesk-dashboard](https://github.com/himani1902/sprintdesk-dashboard) |
| **Live Deployment** | [https://sprintdesk-dashboard.vercel.app](https://sprintdesk-dashboard.vercel.app/) |

### Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Lead Engineer** | `emilys` | `emilyspass` (or click **Quick Fill**) |

---

## Architecture and System Design

### 1. High-Level Data Flow

```text
+-------------------------------------------------------------------------+
|                               UI LAYER                                  |
|  (AppLayout, ProtectedRoute, KanbanBoard, AnalyticsPage, TaskDrawer)    |
+--------------------+--------------------------------+-------------------+
                     |                                |
                     v                                v
        +-------------------------+      +---------------------------+
        |   Client State Store    |      |    Server State Cache     |
        |        (Zustand)        |      |    (TanStack Query v5)    |
        +-------------------------+      +---------------------------+
        | * Active Board Tasks    |      | * Initial Mock Data Cache |
        | * Drag-and-Drop History |      | * Polled Notifications    |
        | * User Auth Session     |      | * Tab Visibility Control  |
        | * Theme Preference      |      | * Stale Time & Refetching |
        | * Undo Stack (10 steps) |      | * Error Boundaries        |
        +-------------------------+      +-------------+-------------+
                                                       |
                                                       v
                                         +---------------------------+
                                         |    API & SERVICE LAYER    |
                                         |   (apiClient Interceptor) |
                                         +---------------------------+
                                         | * Request Bearer Header   |
                                         | * 401 Silent Refresh Loop |
                                         | * Queued Request Replay   |
                                         +-------------+-------------+
                                                       |
                                                       v
                                         +---------------------------+
                                         |      DATA SOURCES         |
                                         +---------------------------+
                                         | * DummyJSON Auth API      |
                                         | * JSONPlaceholder Polling |
                                         | * public/mock-data.json   |
                                         +---------------------------+
```

### 2. State Boundary Separation
- **Server State (TanStack Query v5)**: Manages remote HTTP data fetching, asynchronous loading/error lifecycles, and window tab visibility pausing (`refetchInterval` paused on `document.hidden`).
- **Application Client State (Zustand)**: Manages interactive client-side operations including `@dnd-kit/core` Kanban task positions, optimistic comment additions, undo history stack, and session state.
- **Local Component State (`useState`, `useRef`)**: Confined to self-contained UI interactions such as dropdown popovers, modal visibility, and controlled form inputs.

---

## API Documentation (OpenAPI / Swagger Specification)

### 1. Authentication Service (`https://dummyjson.com`)

#### `POST /auth/login`
Authenticates user credentials and returns JWT tokens with user metadata.

- **Request Body**:
```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 43200
}
```
- **Response `200 OK`**:
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@example.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://i.pravatar.cc/150?img=47",
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "e3b0c44298fc1c149afb..."
}
```
- **Response `400 / 401 Error`**:
```json
{
  "message": "Invalid credentials"
}
```

#### `POST /auth/refresh`
Performs silent token rotation when access token expires.

- **Request Body**:
```json
{
  "refreshToken": "e3b0c44298fc1c149afb...",
  "expiresInMins": 60
}
```
- **Response `200 OK`**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "new_refresh_token_string..."
}
```

---

### 2. Real-Time Polling Service (`https://jsonplaceholder.typicode.com`)

#### `GET /posts?_limit=5`
Simulates incoming server-sent notification events via background polling.

- **Query Parameters**: `_limit=5`
- **Response `200 OK`**:
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident",
    "body": "quia et suscipit suscipit recusandae consequuntur expedita..."
  }
]
```

---

### 3. Initial Mock Data Service (`/mock-data.json`)

#### `GET /mock-data.json`
Provides initial seed data for 6 team members, 3 sprints, 30 tasks, and comments.

---



## Setup and Installation Instructions

### Prerequisites
- Node.js: `v18.0.0` or higher
- Package Manager: `npm` (v9+) or `yarn`

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/himani1902/sprintdesk-dashboard.git

# 2. Navigate to project root
cd sprintdesk-dashboard

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```
Open `http://localhost:5173/` in your browser.

### Verification & Testing
```bash
# Run unit & integration test suites
npm test

# Run production build and TypeScript strict check
npm run build

# Preview production build locally
npm run preview
```

---

## Security Practices

- **Zero Committed Secrets**: No passwords, private tokens, or environment API keys are hardcoded or committed to git.
- **In-Memory Access Tokens**: Access tokens are kept in JavaScript memory (`inMemoryAccessToken`) rather than localStorage to prevent persistent XSS exploitation.
- **Automatic Session Invalidation**: Corrupted or expired refresh tokens automatically trigger a clean session reset and redirect to `/login`.

---

## License
This project is open-source and available under the [MIT License](LICENSE).




