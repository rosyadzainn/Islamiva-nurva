# Islamiva Islamic Platform - Setup Guide

## Quick Start

```bash
cd islamiva-islamic
npm install
npm run dev
```

## Environment Variables

Copy `.env` and fill in your credentials:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/islamiva_islamic?schema=public"

# Clerk Authentication (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI (https://platform.openai.com)
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE islamiva_islamic;
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma db push
```

## Authentication Setup (Clerk)

1. Go to https://clerk.com and create an account
2. Create a new application
3. Copy the API keys to your `.env` file
4. Configure allowed domains in Clerk dashboard

## Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial Islamiva Islamic Platform"
git push
```

2. Connect to Vercel:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables from `.env`
   - Deploy

3. Add environment variables in Vercel:
   - DATABASE_URL
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - OPENAI_API_KEY
   - NEXT_PUBLIC_APP_URL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | PostgreSQL + Prisma 7 |
| Auth | Clerk |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

## Project Structure

```
islamiva-islamic/
├── app/
│   ├── (main)/          # Main public pages
│   │   ├── page.tsx     # Home
│   │   ├── quran/       # Al-Quran module
│   │   ├── doa/         # Doa module
│   │   ├── hadith/      # Hadith module
│   │   ├── kisah-nabi/  # Prophet stories
│   │   ├── sejarah/     # Islamic history
│   │   └── ai-chat/     # AI Chat
│   ├── (auth)/          # Auth pages (Clerk)
│   ├── admin/           # Admin panel
│   ├── api/             # API routes
│   ├── sitemap.ts       # SEO sitemap
│   └── robots.ts        # SEO robots
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Navbar, Footer
│   ├── home/            # Home page sections
│   ├── quran/           # Quran components
│   ├── doa/             # Doa components
│   ├── hadith/          # Hadith components
│   ├── kisah-nabi/      # Prophet story components
│   ├── ai-chat/         # AI Chat components
│   └── providers/       # React context providers
├── data/                # Static data (surah list, doa, etc.)
├── lib/                 # Utilities (prisma, utils)
├── types/               # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema
└── proxy.ts            # Auth middleware (Clerk)
```

## Features

- ✅ Al-Quran (114 surah, API from alquran.cloud)
- ✅ Doa Harian (8+ kategori)
- ✅ Hadits (6 kitab: Bukhari, Muslim, dll)
- ✅ Kisah Para Nabi (25 nabi)
- ✅ Sejarah Islam (timeline)
- ✅ AI Chat Islami (streaming, GPT-4o-mini)
- ✅ Global Search
- ✅ Dark/Light Mode
- ✅ Authentication (Clerk)
- ✅ Admin Panel
- ✅ SEO Optimized (sitemap, robots, metadata)
- ✅ Mobile Responsive
- ✅ Production Build Ready
