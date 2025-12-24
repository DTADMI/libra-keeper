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
- ♿ Accessibility-first approach

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **State Management**: React Query + Zustand
- **Form Handling**: React Hook Form + Zod
- **i18n**: next-intl
- **Testing**: Jest, React Testing Library, Cypress

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Email**: Resend

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended)

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

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Application environment | No | `development` |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | Yes | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes | - |
| `NEXTAUTH_URL` | Base URL for NextAuth.js | Yes | - |
| `RESEND_API_KEY` | API key for Resend email service | No | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |

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
