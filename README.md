# SprintDesk Dashboard 🚀

A modern, full-featured Sprint Management & Agile Kanban Dashboard built with React 19, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, and @dnd-kit.

## ✨ Features

- 📋 **Interactive Kanban Board**: Drag-and-drop task workflow with `@dnd-kit` (To Do, In Progress, In Review, Done).
- 📊 **Sprint Analytics & Metrics**: Velocity charts, burn-up/burn-down trends, task distribution by priority and status powered by Recharts.
- 🔍 **Advanced Filtering & Search**: Multi-criteria task filtering by assignee, priority, tags, status, and instant text search.
- 🔔 **Real-time Notifications**: Toast notifications and alert center for sprint deadlines, assignments, and workflow updates.
- 🎨 **Dark / Light Theme Support**: Polished UI with Tailwind CSS and custom theme toggling via Zustand.
- 🔐 **Authentication Flow**: Mock authentication with protected routes and role-based access.
- 📥 **Export & Reporting**: Export board data to CSV and visual snapshot exports via `html-to-image`.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Drag and Drop**: [@dnd-kit](https://dndkit.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Linting**: [Oxlint](https://oxc.rs/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/himani1902/sprintdesk-dashboard.git
cd sprintdesk-dashboard

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
