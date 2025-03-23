# Startup Directory Platform

A modern web platform for discovering, managing, and connecting with startups. Built with Next.js 15 and TypeScript.

## 🌟 Features

- **Authentication System**

  - Secure email/password authentication
  - Role-based access control (Admin, Startup Owner, User)
  - Protected routes and API endpoints

- **User Management**

  - User profiles with customizable avatars
  - Role-based permissions
  - Email verification system

- **Admin Dashboard**

  - Comprehensive startup management
  - User management interface
  - Analytics and reporting tools
  - Review moderation system
  - Job listing approval workflow

- **Startup Profiles**

  - Detailed startup information
  - Image management with ImageKit integration
  - Search and filtering capabilities
  - Advanced analytics and view tracking
  - Performance metrics and insights
  - Visitor engagement stats

- **Review System**

  - User-generated reviews and ratings
  - Reply functionality for startup owners
  - Sentiment analysis on reviews
  - Review helpfulness voting
  - Review moderation tools
  - Automated content filtering

- **Job Board**

  - Comprehensive job listings
  - Advanced job search and filtering
  - Job alert notifications
  - Startup-specific job pages

## 🛠️ Tech Stack

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Framer Motion for animations
- React Hook Form for form management
- Recharts for data visualization

### Backend

- Next.js API Routes
- NextAuth.js v5 for authentication
- Drizzle ORM
- NeonDB (Serverless Postgres)

### Analytics & AI

- Custom analytics tracking system
- Sentiment analysis using Natural Language Processing
- View tracking with real-time updates
- Automated content moderation

### Utilities

- ImageKit for image management
- Zod for validation
- date-fns for date manipulation
- Sentiment analysis for review processing

## 📦 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- NeonDB account
- ImageKit account

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/startup-pub-dir.git
   cd startup-pub-dir
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="your-neon-db-connection-string"

   # Auth
   AUTH_SECRET="your-auth-secret"

   # ImageKit
   IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
   IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
   IMAGEKIT_URL_ENDPOINT="your-imagekit-url"
   ```

4. **Run database migrations**

   ```bash
   pnpm drizzle-kit push:pg
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📊 Analytics Features

### Sentiment Analysis

- Real-time review sentiment scoring
- Trend analysis and reporting
- Keyword extraction
- Automated flagging of concerning content
- Sentiment breakdown by categories
- Historical sentiment tracking

### Performance Metrics

- Startup profile engagement rates
- Job listing conversion rates
- Review engagement metrics
- Response time analytics
- User satisfaction scores
- Platform usage patterns