# LibraKeeper

A personal library management system that helps you track your books and other items, manage lending to friends, and keep your collection organized.

## Features

- 📚 Track books and other items in your personal library
- 👥 Manage item lending to friends and contacts
- 🔔 Get notified when items are borrowed or returned
- 🏷️ Categorize and tag items for easy searching
- 🌓 Dark/light theme support
- 🌐 Multi-language support (i18n)
- 🔒 Secure authentication and authorization
- 📱 Responsive design for all devices
- 📱 Progressive Web App (PWA) support
- ♿ Accessibility-first approach

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **i18n**: next-intl
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod
- **Feature Management**: Dynamic Feature Flags & Admin Settings

### Backend

- **Runtime**: Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended)

## Project structure

```
libra-keeper/
├── .github/
│   └── workflows/     # CI/CD pipelines
├── docs/              # Detailed documentation
├── e2e/               # Playwright E2E tests
├── prisma/
│   └── schema.prisma  # Database schema
├── public/            # Static assets
└── src/
    ├── app/
    │   ├── (protected)/ # Authenticated routes
    │   │   ├── admin/   # Admin management
    │   │   ├── dashboard/
    │   │   ├── items/   # Item details and editing
    │   │   ├── loans/   # User loans
    │   │   ├── messages/# Messaging system
    │   │   ├── profile/ # User profile
    │   │   └── suggestions/ # User suggestions
    │   ├── api/         # Backend API routes
    │   ├── auth/        # Auth pages (login/register)
    │   └── globals.css
    ├── components/    # React components
    │   ├── ui/        # shadcn/ui components
    │   └── activity/  # Activity feed components
    ├── hooks/         # Custom React hooks
    ├── lib/           # Utility functions, configs, logger
    ├── types/         # TypeScript type definitions
    └── messages/      # i18n translation files
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/libra-keeper.git
   cd libra-keeper
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/librakeeper"

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # Email (for notifications)
   RESEND_API_KEY=re_123456789

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   pnpm prisma migrate dev
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Testing

LibraKeeper uses Jest and React Testing Library for unit and integration testing, and Playwright for E2E testing.

```bash
# Run unit and integration tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## CI/CD

The project includes a GitHub Actions workflow for continuous integration. On every push or pull request to the `main` branch, the workflow:

1. Installs dependencies
2. Generates Prisma client
3. Runs linter
4. Runs unit and integration tests with coverage checks
5. Verifies the build

## Documentation

Comprehensive documentation can be found in the `docs` folder:

- [User Guide](docs/user-guide.md)
- [Admin Guide](docs/admin-guide.md)
- [API Reference](docs/api-reference.md)

## Development

- Run the development server:

  ```bash
  pnpm dev
  ```

- Run tests:

  ```bash
  pnpm test
  ```

- Lint and format code:

  ```bash
  pnpm lint
  pnpm format
  ```

- Generate Prisma client:
  ```bash
  pnpm prisma generate
  ```

## Environment Variables

| Variable               | Description                      | Required | Default                 |
|------------------------|----------------------------------|----------|-------------------------|
| `NODE_ENV`             | Application environment          | No       | `development`           |
| `NEXT_PUBLIC_APP_URL`  | Public URL of the application    | Yes      | `http://localhost:3000` |
| `DATABASE_URL`         | PostgreSQL connection string     | Yes      | -                       |
| `NEXTAUTH_SECRET`      | Secret for NextAuth.js           | Yes      | -                       |
| `NEXTAUTH_URL`         | Base URL for NextAuth.js         | Yes      | -                       |
| `RESEND_API_KEY`       | API key for Resend email service | No       | -                       |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID           | No       | -                       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret       | No       | -                       |

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

### Self-hosted

1. Build the application:

   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
