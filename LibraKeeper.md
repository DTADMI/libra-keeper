# LibraKeeper - Personal Library Management System

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Technical Architecture](#technical-architecture)
4. [Tech Stack](#tech-stack)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Authentication & Authorization](#authentication--authorization)
8. [UI/UX Design](#uiux-design)
9. [Deployment Strategy](#deployment-strategy)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Security Considerations](#security-considerations)
12. [Monitoring & Analytics](#monitoring--analytics)
13. [Future Enhancements](#future-enhancements)

## Overview

LibraKeeper is a personal library management system designed for collection owners to maintain complete control over their items while allowing controlled access to friends and family. The owner (admin) has full management capabilities, while other users can only perform limited actions on the shared collection. Built as a monolith for simplicity with a focus on robust inventory and lending management, the application provides powerful tools for inventory management, lending tracking, and collection organization through a user-friendly interface.

## Core Features

### Admin (Owner) Features

- **Complete Item Management**: Add, edit, and remove items from your collection
- - CRUD operations for library items
  - Categorization and tagging
  - Search and filtering
  - Sorting (newest, most liked, etc.)
- **Detailed Item Cataloging**: Rich metadata including title, author, description, condition, and custom fields
- **Tagging System**: Categorize items with multiple tags for easy organization
- **Lending Management**: Track who has borrowed what and when it's due
- - Borrow/return requests
  - Request validation workflow
  - Due date tracking
  - Automatic reminders
- **Friend Management**: Add/remove friends who can access your collection
- **Admin Management**: Designate other users as admins (multi-admin support)
- **User Management**: Manage user accounts and permissions
- - Registration/Login (Email/Password + OAuth)
  - Profile management
  - Role-based access control (Admin, Regular User)
  - Notification system
- **Item Requests**: Review and process item addition requests from friends
- **Messaging**: Communicate with users about their requests and borrows
- **Activity Log**: View complete history of all actions on your collection
- - Dashboard with analytics
  - User management
  - Content moderation
  - System configuration

### Friend (Borrower) Features

- **Browse Collection**: View available items with rich filtering and search
- **Borrow Requests**: Request to borrow available items
- **Return Notifications**: Mark items as returned when done
- **Wishlist**: Save items for future borrowing
- **Comments & Ratings**: Leave feedback on borrowed items
- **Messaging**: Send direct messages to admins
- **Item Requests**: Suggest new items to add to the collection
  - **Borrowed Item Form**: Report items not in catalog but in your possession
  - **Suggestion Form**: Recommend items to acquire, including purchase details
- **Wishlist**: Save items for future borrowing
- **Comments & Ratings**: Leave feedback on borrowed items
- **Messaging**: Send direct messages to admins
- **Item Requests**: Suggest new items to add to the collection
- **Social Features**
  - Like/unlike items
  - Comments and discussions
  - Activity feed

### System Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Choose your preferred color scheme
- **Email Notifications**: Get alerts for due dates, requests, and messages
- **Data Export**: Export your collection data for backup
- **Access Control**: Granular permissions for different user types
- **Messaging System**: Built-in communication between users and admins
- **Request Workflow**: Streamlined process for item addition requests

## Technical Architecture

### Monolithic Architecture with Modular Design

- Single codebase with clear separation of concerns
- Modular structure for maintainability
- API-first design with server-side rendering for optimal performance

```
src/
├── modules/
│   ├── admin/         # Admin-specific functionality
│   ├── auth/          # Authentication and user management
│   ├── catalog/       # Item catalog management
│   ├── lending/       # Lending workflow
│   └── social/        # Comments and interactions
├── shared/
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
└── pages/             # Page components
```

## Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query + Zustand
- **Form Handling**: React Hook Form + Zod
- **i18n**: next-intl
- **Accessibility**: Radix UI primitives, ARIA labels
- **Testing**: Jest, React Testing Library, Cypress

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL (primary), Redis (caching)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Real-time**: Server-Sent Events (SSE)

### DevOps

- **Hosting**: Vercel (Hobby plan)
- **Database**: Supabase (free tier)
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics + LogRocket (free tier)
- **Email**: Resend (free tier)

## Database Design

### Tables

#### Users

```typescript
users {
  id: string (uuid)
  name: string
  email: string (unique)
  emailVerified: timestamp
  password: string (hashed)
  role: 'ADMIN' | 'USER'
  isActive: boolean
  lastActive: timestamp
  image: string (URL)
  createdAt: timestamp
  updatedAt: timestamp
  addedByAdminId: string? (fk -> users.id)
}

sessions {
  id: string
  userId: string (fk -> users.id)
  expires: timestamp
  sessionToken: string
}

accounts {
  id: string
  userId: string (fk -> users.id)
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string?
  access_token: string?
  expires_at: number?
  token_type: string?
  scope: string?
  id_token: string?
  session_state: string?
}
```

#### Library Management

```typescript
items {
  id: string (uuid)
  title: string
  description: text
  type: 'BOOK' | 'MUSIC' | 'MOVIE' | 'GAME' | 'OTHER'
  status: 'AVAILABLE' | 'BORROWED' | 'GIVEN_AWAY' | 'LOST'
  coverImage: string (URL)
  metadata: jsonb (flexible schema for different item types)
  ownerId: string (fk -> users.id)
  createdAt: timestamp
  updatedAt: timestamp
}

tags {
  id: string (uuid)
  name: string (unique)
  color: string
  description: string
  icon: string
}

item_tags {
  itemId: string (fk -> items.id)
  tagId: string (fk -> tags.id)
  icon: string
}

borrow_requests {
  id: string (uuid)
  itemId: string (fk -> items.id)
  borrowerId: string (fk -> users.id)
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED'
  requestDate: timestamp
  dueDate: timestamp?
  approvedAt: timestamp?
  returnedAt: timestamp?
  notes: text
  adminNotes: text
}

messages {
  id: string (uuid)
  senderId: string (fk -> users.id)
  recipientId: string (fk -> users.id)
  content: text
  isRead: boolean
  relatedRequestId: string? (fk -> item_requests.id)
  createdAt: timestamp
  updatedAt: timestamp
}

item_requests {
  id: string (uuid)
  requestedById: string (fk -> users.id)
  processedById: string? (fk -> users.id)
  type: 'BORROWED_ITEM' | 'SUGGESTION'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDED'
  title: string
  description: text
  author: string?
  isbn: string?
  purchaseInfo: jsonb
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  statusMessage: string?
  createdAt: timestamp
  updatedAt: timestamp
}

comments {
  id: string (uuid)
  itemId: string (fk -> items.id)
  userId: string (fk -> users.id)
  content: text
  rating: number (1-5)?
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Design

### RESTful Endpoints

#### Admin Endpoints

```
GET    /api/admin/items           - List all items with filters
POST   /api/admin/items           - Create new item
GET    /api/admin/items/:id       - Get item details
PUT    /api/admin/items/:id       - Update item
DELETE /api/admin/items/:id       - Delete item

GET    /api/admin/borrow-requests - List all borrow requests
PUT    /api/admin/borrow/:id      - Update borrow request status

GET    /api/admin/users            - List all users
POST   /api/admin/users/invite     - Invite new user
PUT    /api/admin/users/:id/role   - Update user role
```

#### User Endpoints

```
GET    /api/items                  - Browse available items
GET    /api/items/:id             - View item details

POST   /api/borrow-requests       - Request to borrow an item
PUT    /api/borrow-requests/:id   - Update borrow request (e.g., mark as returned)

GET    /api/profile               - Get current user profile
PUT    /api/profile              - Update profile
```

## Authentication & Authorization

### Authentication Flow

1. Email/Password with JWT
2. Magic links for passwordless login
3. Social login (Google, GitHub)

### Authorization

- **Admin**: Full access to all features
- **Friends**: Limited to browsing and requesting items
- **Public**: View-only access (configurable)
- Role-based access control
- Resource ownership checks
- Row-level security where applicable

## UI/UX Design

### Theme

- **Primary Color**: Purple (#7C3AED)
- **Accent Colors**:
  - Auburn (#9A2A2A)
  - Emerald (#059669)
  - Royal Blue (#2563EB)
  - Gold (#D97706)
  - Cyan (#0891B2)
  - Pink (#DB2777)
  - Magenta (#C026D3)
  - Red (#DC2626)
- **Neutrals**:
  - Light theme: White (#FFFFFF) to Gray-900 (#111827)
  - Dark theme: Gray-900 (#111827) to White (#FFFFFF)

### Components

- Responsive design with mobile-first approach
- Accessible components with keyboard navigation
- Dark/light theme toggle
- Loading states and skeletons
- Toast notifications
- Confirmation dialogs

### Key Pages

1. **Home**
   - Hero section with app description
   - Newly added items carousel
   - Most liked items carousel
   - Call-to-action buttons

2. **Dashboard (Admin)**
   - Quick stats and recent activity
   - Pending requests
   - Recently added items
   - Analytics
   - User management
   - Item management
   - Content moderation
   - System management

3. **Catalog**
   - Filterable grid of items
   - Advanced search
   - Tag-based filtering

4. **Item Details**
   - Full item information
   - Borrowing history
   - Comments and ratings
   - Related items

5. **User Dashboard**
   - Current loans
   - Borrowing history
   - Due date calendar
   - Item request status
   - Message history

## Deployment Strategy

### Development

- Local development with Docker Compose
- Database migrations with Drizzle
- Hot reloading for frontend and backend

### Staging

- Preview deployments on Vercel
- Test database with seed data
- Automated testing

### Production

- Vercel for frontend and API
- Supabase for PostgreSQL
- Redis for caching and rate limiting
- Automated backups
- CDN for static assets

## CI/CD Pipeline

1. **On Pull Request**:
   - Linting and type checking
   - Unit tests
   - Build verification
   - Preview deployment

2. **On Merge to Main**:
   - Run all PR checks
   - E2E tests
   - Deploy to staging
   - Run integration tests

3. **On Tag**:
   - Deploy to production
   - Run smoke tests
   - Notify team

## Security Considerations

### Data Protection

- Encrypt sensitive data at rest
- Use HTTPS everywhere
- Implement CSP headers
- Rate limiting

### Authentication

- Secure password hashing (Argon2)
- CSRF protection
- Secure cookie settings
- Session management
- Rate limiting for authentication endpoints
- Account lockout after failed attempts

## Monitoring & Analytics

### Error Tracking

- LogRocket for frontend errors
- Sentry for backend errors
- Performance monitoring

### Usage Analytics

- Google Analytics (opt-in)
- Custom event tracking
- User flow analysis

## Future Enhancements

1. **Mobile App**
   - React Native application
   - Offline support
   - Barcode/QR code scanning

2. **Advanced Features**
   - ISBN/IMDb lookup
   - Custom fields for items
   - Collection sharing between admins
   - Bulk item import/export
   - Barcode scanning for item check-in/out

3. **Automation**
   - Email reminders
   - Due date notifications
   - Reports and analytics

4. **Accessibility**
   - Screen reader optimization
   - Keyboard navigation
   - High contrast mode

5. **Integration**
   - Google Books API
   - Goodreads import/export
   - Calendar integration
   - Email notifications with action buttons
   - Webhook support for external services

6. **Advanced Search**

- Full-text search
- Advanced filters
- Saved searches

7. **Monetization**

- Premium features
- Donations
- Affiliate links

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm

### Local Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Run migrations: `pnpm db:migrate`
5. Start development server: `pnpm dev`

## Alternative Tech Stacks

1. Full-Stack TypeScript (Chosen)
   **Pros**: Single language, large ecosystem, great for MVP
   **Cons**: May need optimization at scale
2. Python (Django/DRF + React)
   **Pros**: Robust backend, great for data-heavy apps
   **Cons**: Context switching, more complex deployment
3. Ruby on Rails + Hotwire
   **Pros**: Rapid development, great conventions
   **Cons**: Smaller ecosystem, less performant at scale
4. Elixir/Phoenix + LiveView
   **Pros**: Excellent real-time features, fault-tolerant
   **Cons**: Smaller talent pool, steeper learning curve
5. NestJS + React
   **Pros**: Excellent real-time features, fault-tolerant
   **Cons**: Smaller talent pool, steeper learning curve

## Conclusion

The proposed architecture provides a solid foundation for a scalable, maintainable, and user-friendly library management system. The choice of Next.js with a monorepo structure offers the best balance between development velocity and long-term maintainability, while the selected technologies ensure good performance and developer experience.

The system is designed to be cost-effective, starting with free tiers and scaling up as needed. The modular architecture allows for easy extension and modification as requirements evolve.

## License

MIT
