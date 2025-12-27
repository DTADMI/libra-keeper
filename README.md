# 📚 LibraKeeper

A personal library management system that helps you track your books and other items, manage lending to friends, and keep your collection organized.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/libra-keeper/pulls)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/yourusername/libra-keeper)

## 🚀 Quick Start

Get up and running in minutes with the automated local setup:

```bash
# Clone the repository
git clone https://github.com/yourusername/libra-keeper.git
cd libra-keeper

# Run the automated setup (starts Docker, initializes DB, runs tests)
pnpm setup:local

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action!

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

## 🛠 Prerequisites

### Option 1: Local Development with Docker (Recommended)

- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) 18+ (for local development)
- [pnpm](https://pnpm.io/) (recommended)

### Option 2: Local Development without Docker

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/download/) 14+
- [pnpm](https://pnpm.io/) (recommended)

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

## 🏁 Getting Started

### With Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/libra-keeper.git
   cd libra-keeper
   ```

2. **Run the automated setup** (Recommended)
   This will automatically create your `.env` file with secure random secrets, start the Docker container, run
   migrations, and execute tests.
   ```bash
   pnpm install
   pnpm setup:local
   ```

3. **Alternative: Manual setup**
   If you prefer to set up manually:

   a. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   ```
   *Note: If you use manual setup, ensure you update the secrets and database credentials in `.env`.*

   b. **Start the database**:
   ```bash
   docker-compose up -d
   ```

   c. **Run migrations**:
   ```bash
   pnpm prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Without Docker

Follow the manual steps as above, but make sure you have PostgreSQL running locally (port 5433 by default, or update
`DB_PORT` in `.env`) and update the `DATABASE_URL` in your `.env` file to point to your local PostgreSQL instance.

## 🐳 Docker Development

The project includes a `docker-compose.yml` file that sets up:

- **PostgreSQL 15** with persistent storage
- **Port 5433** (to avoid conflicts with default PostgreSQL installations)
- Health checks to ensure the database is ready
- Automatic initialization of root and application users

### Useful Docker Commands

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (warning: deletes all data!)
docker-compose down -v
```

### Resetting the Database

To completely reset your development database:

```bash
pnpm setup:local
```

*Note: This script handles stopping existing containers, cleaning up, and restarting everything fresh.*

Or manually:

```bash
docker-compose down -v
docker-compose up -d
pnpm prisma migrate dev
```

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

## ⚙️ Environment Variables

| Variable                   | Description                       | Required | Default                 |
|----------------------------|-----------------------------------|----------|-------------------------|
| `NODE_ENV`                 | Application environment           | No       | `development`           |
| `NEXT_PUBLIC_APP_URL`      | Public URL of the application     | Yes      | `http://localhost:3000` |
| `DATABASE_URL`             | PostgreSQL connection string      | Yes      | -                       |
| `NEXTAUTH_SECRET`          | Secret for NextAuth.js            | Yes      | -                       |
| `NEXTAUTH_URL`             | Base URL for NextAuth.js          | Yes      | `http://localhost:3000` |
| `RESEND_API_KEY`           | API key for Resend email service  | No       | -                       |
| `GOOGLE_CLIENT_ID`         | Google OAuth client ID            | No       | -                       |
| `GOOGLE_CLIENT_SECRET`     | Google OAuth client secret        | No       | -                       |
| `DOCKER_POSTGRES_USER`     | PostgreSQL username (Docker)      | No       | `user`                  |
| `DOCKER_POSTGRES_PASSWORD` | PostgreSQL password (Docker)      | No       | `password`              |
| `DOCKER_POSTGRES_DB`       | PostgreSQL database name (Docker) | No       | `librakeeper`           |

### Generating Secure Secrets

For production, generate secure secrets:

```bash
# Generate a secure NEXTAUTH_SECRET
openssl rand -base64 32

# Generate a secure database password
openssl rand -base64 16
```

## 🔒 Production Deployment

For production deployments, we recommend using a managed database service and setting appropriate environment variables.
Update your `.env.production` file with production credentials and never commit it to version control.

### Security Best Practices

- Use different secrets for development and production
- Regularly rotate your database credentials
- Enable SSL for database connections in production
- Set appropriate CORS policies
- Use environment-specific configuration files

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Flibra-keeper)

1. **Prepare your repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Create a production database (e.g., [Supabase](https://supabase.com/), [Neon](https://neon.tech/),
     or [Railway](https://railway.app/))

2. **Deploy to Vercel**
   - Import your repository to Vercel
   - Add your environment variables in the Vercel project settings
   - Set the build command: `pnpm build`
   - Set the output directory: `.next`
   - Deploy!

### Docker Production

For production deployments with Docker:

1. Build the production image:
   ```bash
   docker build -t librakeeper .
   ```

2. Run with production environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL="your-production-db-url" \
     -e NEXTAUTH_SECRET="your-secure-secret" \
     -e NEXTAUTH_URL="https://your-domain.com" \
     librakeeper
   ```

### Health Checks

The application includes health check endpoints:

- `GET /api/health` - Basic health check
- `GET /api/health/db` - Database connection check

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and
the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [shadcn/ui](https://ui.shadcn.com/)
- Inspired by [Libib](https://www.libib.com/) and [Goodreads](https://www.goodreads.com/)
- Icons by [Lucide](https://lucide.dev/)

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
