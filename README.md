# Startup Directory Platform

A comprehensive platform for discovering, connecting with, and evaluating startups. This enterprise-grade application provides tools for startups, job seekers, and administrators within a modern, scalable architecture.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)

## Overview

This platform serves as a centralized directory for startups, providing valuable insights, job opportunities, and analytical data. It's designed for three primary user roles: administrators, startup owners, and general users, each with tailored experiences and capabilities.

## Key Features

### Core Functionality

- **Authentication & Authorization**

  - Secure JWT-based authentication flow ✅
  - Role-based access control (RBAC) ✅
  - Protected routes and API endpoints ✅
  - Email verification system ✅

- **Startup Directory**

  - Comprehensive startup profiles with detailed information ✅
  - Advanced search and filtering system ✅
  - Categorization by industry and location ✅
  - Rich media support for logos, team photos, and product showcase ✅

- **User Management**
  - Detailed user profiles with customizable avatars
  - Permission-based access control
  - Account management tools
  - User activity tracking

### Advanced Capabilities

- **Analytical Insights**

  - Startup profile view tracking and analytics ✅
  - User engagement metrics ✅
  - Geographical distribution of visitors
  - Performance benchmarking against similar startups ✅

- **Review Ecosystem**

  - User-generated reviews with rating system ✅
  - Sentiment analysis on review content ✅

- **Job Board**

  - Comprehensive job listings with advanced search ✅
  - Industry-specific categorization ✅
  - Keyword-based filtering ✅

- **Administrative Controls**
  - Comprehensive dashboard for platform management ✅
  - Startup verification process ✅
  - Review moderation system ✅
  - Analytics and reporting tools ✅
  - User management interface ✅

## Technology Stack

### Frontend Architecture

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with Server Components
- **Styling**: Tailwind CSS 4 with custom design system
- **Component Library**: Custom UI components built on Radix UI primitives
- **State Management**: React Context API with Server Actions
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Data Visualization**: Recharts

### Backend Infrastructure

- **API Layer**: Next.js API Routes and Server Actions
- **Authentication**: NextAuth.js v5
- **Database ORM**: Drizzle ORM
- **Database**: NeonDB (Serverless PostgreSQL)
- **Image Management**: ImageKit CDN

### Analytics & Intelligence

- **Natural Language Processing**: Sentiment analysis for reviews
- **Analytics Engine**: Custom analytics tracking system
- **Performance Monitoring**: Real-time view tracking
- **Business Intelligence**: Custom reporting tools

## Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended), npm, or Yarn
- NeonDB account (or other PostgreSQL database)
- ImageKit account for image CDN
- Environment supporting JavaScript runtimes

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/https://github.com/EmmanuelKeifala/startup-pub-dir.git
   cd startup-pub-dir
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root:

   ```
   # Database Configuration
   DATABASE_URL="postgresql://user:password@host:port/database"

   # Authentication
   AUTH_SECRET="your-secure-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
   IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
   IMAGEKIT_URL_ENDPOINT="your-imagekit-url-endpoint"
   ```

4. **Initialize the database schema**

   ```bash
   npx drizzle-kit generate
   ```
   ```bash
   npx drizzle-kit migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Project Architecture

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
