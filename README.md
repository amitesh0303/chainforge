# ChainForge Academy

> **TL;DR**: A production-ready, multi-chain Web3 developer training platform. Spin up the full stack in <10 minutes.

## Vision

ChainForge Academy is an all-in-one gamified platform for mastering blockchain development across EVM, Solana, and Move ecosystems. It bridges the gap between Web2 developers and Web3 proficiency through interactive coding challenges, live contests, and instant feedback.

**Target Users**: Junior-to-mid Web2 developers transitioning to Web3; Web3 devs upskilling on new chains.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 (App Router) | SSR, API routes, file-based routing |
| Language | TypeScript v5 | Type safety across stack |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, dark mode, accessibility |
| Auth | Auth.js v5 + RainbowKit v2 | Google OAuth + SIWE wallet auth |
| State | TanStack Query v5 + Zustand | Server/client state management |
| Database | Supabase (Postgres) | Users, problems, submissions |
| Realtime | Supabase Realtime | Live leaderboards, contest updates |
| Execution | Judge0 API | Solidity (Foundry) + Rust (cargo) sandboxing |
| Deployment | Cloudflare Pages + Workers | Edge deployment |

## Getting Started

### Prerequisites

- Node.js v20+
- npm or pnpm

### One-Command Setup

```bash
# 1. Clone and install
git clone https://github.com/amitesh0303/chainforge.git
cd chainforge
npm install

# 2. Environment setup
cp .env.example .env.local
# Fill in: NEXTAUTH_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, JUDGE0_API_KEY, etc.

# 3. Database seed (requires Supabase CLI)
supabase login
supabase db push
# Run seed/supabase/seed.sql in your Supabase project

# 4. Run dev server
npm run dev
# Open http://localhost:3000
```

Or use the setup script:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Environment Variables

See `.env.example` for all required variables:

| Variable | Required For |
|----------|--------------|
| `NEXTAUTH_SECRET` | JWT signing |
| `NEXTAUTH_URL` | Auth callbacks |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB access |
| `JUDGE0_API_KEY` | Code execution |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Wallet connections |
| `THIRDWEB_SECRET_KEY` | NFT badge minting |

## Directory Structure

```
chainforge/
├── app/
│   ├── (auth)/login/          # Hybrid auth (Google + Wallet)
│   ├── (protected)/
│   │   ├── dashboard/         # Progress overview
│   │   ├── problems/[slug]/   # Problem editor (Monaco)
│   │   ├── contests/active/   # Live contest arena
│   │   ├── contests/leaderboard/
│   │   ├── quizzes/[id]/      # MCQ interface
│   │   └── profile/           # Stats & badges
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── judge0/proxy/      # Secure code execution
│   │   └── contests/active/
│   ├── layout.tsx
│   └── globals.css
├── components/                # React components
├── lib/                       # Supabase, Auth, Judge0 clients
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript definitions
├── seed/supabase/seed.sql     # DB schema + 10 sample problems
├── scripts/setup.sh           # Dev setup script
├── .env.example
└── wrangler.toml              # Cloudflare config
```

## Core Features

- **Hybrid Auth**: Google OAuth + Sign-In with Ethereum (SIWE)
- **Practice Arena**: 10+ blockchain problems across EVM, Solana, Move
- **Live Code Execution**: Judge0-powered Solidity & Rust sandboxing
- **Contest System**: Real-time leaderboard via Supabase Realtime
- **Quiz Engine**: MCQ interface with explanations
- **Gamification**: XP, streaks, NFT badges via thirdweb

## Database Schema

Run `seed/supabase/seed.sql` in your Supabase project to create:
- `users` — unified across auth methods
- `problems` — 10 seed problems (EVM/Solana/Move)
- `submissions` — with RLS policies
- `contests` + `contest_participants`
- `user_badges`

## Deployment

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static
```

## Contributing

See [Contributing Guidelines](#) for:
- Adding new problems (`seed/supabase/seed.sql`)
- Adding new chains
- PR checklist (TypeScript strict, shadcn/ui patterns, RLS updates)
