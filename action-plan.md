# LibraKeeper Action Plan

## Legend

- ✅ Completed
- 🟡 In Progress
- 🔜 Next
- 🗂️ Backlog

## Phase 1: Project Setup & Foundation

- [x] Initialize Next.js project with TypeScript
- [x] Set up ESLint, Prettier, and Husky
- [x] Configure Tailwind CSS with theme colors
- [x] Set up i18n with next-intl
- [x] Implement authentication with NextAuth.js
- [x] Set up database with Prisma and PostgreSQL
- [x] Configure CI/CD pipeline

## Phase 2: Core Features

### Authentication & User Management

- [x] User registration and login
- [x] Role-based access control (Admin/User)
- [x] Profile management
- [x] Admin user management

### Library Management

- [x] Item CRUD operations
- [x] Item categorization and tagging
- [x] Search and filter functionality
- [x] Item details page
- [x] Like and comment functionality

### Borrowing System

- [x] Borrow/return request system
- [x] Request approval/rejection flow
- [x] Due date tracking
- [x] Email notifications

### User Interface

- [x] Responsive layout
- [x] Dark/light theme
- [x] Accessible components
- [x] Loading and error states

## Phase 3: Advanced Features

- [x] Suggestion system for new items
- [x] Missing item reporting
- [x] Messaging system
- [x] Activity feed
- [x] Data export (import in progress)

## Phase 4: Testing & Optimization

- [x] Set up testing environment (Jest, React Testing Library)
- [x] Write unit tests for core utilities
- [x] Integration tests
- [x] E2E tests (Playwright set up)
- [x] Performance optimization (Initial build check)
- [x] Security audit (Dependency check)
- [x] Improve test coverage to >70% for core logic
- [x] Implement automated coverage checks in CI/CD

## Phase 5: Deployment & Documentation

- [x] Production deployment setup (Vercel ready)
- [x] Monitoring and logging
- [x] User documentation
- [x] Admin documentation
- [x] API documentation
- [x] Implement a successful CI/CD

## Phase 6: Maintenance & Security

- [x] Configure code formatting (semicolons, braces, spacing)
- [x] Address Next.js security vulnerabilities (CVE-2025-66478, CVE-2025-55182, etc.)
- [x] Implement dynamic Feature Flagging system
- [x] Implement Admin App Settings management

## Phase 7: Future Improvements & Suggestions

- [x] Add barcode scanning for quick item entry
- [x] Implement a waitlist for borrowed items
- [x] Add calendar view for loans and due dates
- [x] Integrate with external book metadata APIs (Open Library, Google Books)
- [x] Add multi-collection support for different categories of items
- [x] Mobile application (PWA)

## Status: Completed

### Tasks:

1. **Initialize action plan and documentation** [COMPLETED]
    - [x] Analyze current state
    - [x] Create `action-plan.md`
    - [x] Update `README.md`
2. **Configure Environment Variables** [COMPLETED]
    - [x] Update `.env` with actual generated secrets (no shell commands)
    - [x] Synchronize `DATABASE_URL` with credentials
3. **Enhance Docker Configuration** [COMPLETED]
    - [x] Rename container to `libra-keeper` (as per issue description)
    - [x] Ensure image name is `librakeeper-db`
    - [x] Create `docker/Dockerfile.db`
4. **Automate Local Setup and Testing** [COMPLETED]
    - [x] Create automation script `scripts/setup-local.js`
    - [x] Add `package.json` scripts

### 6. Fix Setup Issues [COMPLETED]

- [x] Fix `DATABASE_URL` parsing errors by using URL-safe characters and providing guidance in `.env.example`.
- [x] Switch from port 5432 to 5433 to avoid conflicts with other PostgreSQL instances on the host.
- [x] Update `docker/init-db.sh` to grant necessary permissions (`CREATEDB`, `ALL ON SCHEMA public`, role membership) to
  the application user for Prisma migrations and shadow database creation.
- [x] Update `scripts/setup-local.js` to use `pnpm exec`, add a stabilization delay, and improve logs.
- [x] Update `package.json` to consistently use `pnpm` for all database and setup commands.
- [x] Resolve authentication mismatches by synchronizing `.env` variables with Docker environment and removing random
  password generation from `docker-compose.yml`.
- [x] Fix syntax errors in `init-db.sh` by properly escaping PostgreSQL `$$` blocks and using `EXECUTE format` for
  dynamic SQL.
- [x] Verify the entire flow with `pnpm setup:local`.
- [x] Update `README.md` with new automated setup instructions and Docker configuration details.
- [x] Resolve Next.js 16/Turbopack and Prisma Compatibility Issues:
    - [x] Rename `src/middleware.ts` to `src/proxy.ts` to address Next.js 16 deprecation warning.
    - [x] Update `next.config.ts` to include `turbopack: {}` and `outputFileTracingRoot` to silence builder and
      workspace root warnings.
    - [x] Implement Prisma Driver Adapter using `@prisma/adapter-pg` and `pg` to resolve
      `PrismaClientConstructorValidationError` in Next.js 16 environment.
    - [x] Enable `driverAdapters` preview feature in `schema.prisma` and regenerate Prisma client.
    - [x] Verify development server starts successfully with `pnpm dev`.