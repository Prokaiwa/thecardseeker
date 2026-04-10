# 🏗️ The Card Seeker - System Architecture

> Technical architecture for the Pokemon TCG deck building platform.

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENTS                                      │
│                                                                              │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│    │   Web App    │    │  Mobile Web  │    │   PWA        │                │
│    │  (Next.js)   │    │  (Responsive)│    │  (Offline)   │                │
│    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│           │                   │                   │                         │
└───────────┼───────────────────┼───────────────────┼─────────────────────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE                                     │
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                     Next.js 14 Application                          │  │
│    │                                                                     │  │
│    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │  │
│    │  │   Pages     │  │    API      │  │   Server    │  │   Cron    │ │  │
│    │  │  (SSR/SSG)  │  │   Routes    │  │  Components │  │   Jobs    │ │  │
│    │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │  │
│    │                                                                     │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│          SUPABASE               │  │       EXTERNAL APIS             │
│                                 │  │                                 │
│  ┌───────────────────────────┐  │  │  ┌─────────────┐               │
│  │       PostgreSQL          │  │  │  │  Limitless  │               │
│  │                           │  │  │  │    TCG      │               │
│  │  • cards                  │  │  │  └─────────────┘               │
│  │  • decks                  │  │  │                                 │
│  │  • profiles               │  │  │  ┌─────────────┐               │
│  │  • tournaments            │  │  │  │   Price     │               │
│  │  • prices                 │  │  │  │  Tracker    │               │
│  └───────────────────────────┘  │  │  └─────────────┘               │
│                                 │  │                                 │
│  ┌───────────────────────────┐  │  │  ┌─────────────┐               │
│  │         Auth              │  │  │  │  Pokemon    │               │
│  │  • Sessions               │  │  │  │  TCG API    │               │
│  │  • Social Login           │  │  │  └─────────────┘               │
│  │  • JWT Tokens             │  │  │                                 │
│  └───────────────────────────┘  │  │  ┌─────────────┐               │
│                                 │  │  │   Stripe    │               │
└─────────────────────────────────┘  │  └─────────────┘               │
                                     │                                 │
                                     └─────────────────────────────────┘
```

---

## Application Layers

### 1. Presentation Layer (Frontend)

```
src/
├── app/                    # Next.js App Router (Pages)
│   ├── (marketing)/       # Public marketing pages
│   ├── (app)/             # Authenticated app pages
│   └── api/               # API routes
│
├── components/
│   ├── ui/                # Base shadcn/ui components
│   ├── cards/             # Card-specific components
│   ├── decks/             # Deck-specific components
│   ├── esubi/             # Mascot components
│   └── layout/            # Layout components
```

**Key Patterns:**
- Server Components by default (better performance)
- Client Components only when needed (interactivity)
- Colocation of components with their pages
- Shared UI components in `/components/ui`

### 2. Business Logic Layer

```
src/lib/
├── db/                    # Database access
│   ├── client.ts         # Supabase client
│   └── queries/          # Typed query functions
│
├── ingestion/             # Data pipeline
│   ├── adapters/         # API adapters (Limitless, etc.)
│   ├── transforms/       # Data normalization
│   └── sync/             # Sync jobs
│
├── deck-builder/          # Deck logic
│   ├── validation.ts     # Deck validation rules
│   └── generator.ts      # Deck generation
│
└── simulation/            # Probability engine
    ├── engine.ts         # Core simulation
    └── worker.ts         # Web Worker for performance
```

### 3. Data Layer

```
supabase/
├── schema.sql            # Complete schema
├── migrations/           # Schema migrations (future)
└── seed/                 # Seed data (development)

src/types/
├── card.ts               # Card entities
├── deck.ts               # Deck entities
├── api.ts                # API contracts
└── index.ts              # Exports
```

---

## Data Flow

### Card Data Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Limitless  │────▶│  Adapter    │────▶│  Transform  │────▶│  Supabase   │
│     API     │     │  (fetch)    │     │ (normalize) │     │   (store)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ If Limitless fails
                           ▼
                    ┌─────────────┐
                    │ Pokemon TCG │
                    │     API     │
                    └─────────────┘
```

### User Request Flow

```
User Request
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Next.js Server                                   │
│                                                                          │
│   1. Middleware (auth check, rate limit)                                │
│   2. Page/API Route handler                                             │
│   3. Database query (Supabase)                                          │
│   4. Business logic (validation, computation)                           │
│   5. Response (JSON or rendered HTML)                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
     │
     ▼
User Response (HTML/JSON)
```

---

## Key Design Decisions

### Why Next.js 14 App Router?

| Feature | Benefit |
|---------|---------|
| Server Components | Reduced client bundle, faster loads |
| Streaming | Progressive page rendering |
| Built-in API routes | No separate backend needed |
| Edge runtime | Low latency globally |
| Static generation | SEO-friendly, cacheable |

### Why Supabase?

| Feature | Benefit |
|---------|---------|
| PostgreSQL | Full SQL power, JSONB, full-text search |
| Built-in Auth | Social logins, JWT, no extra setup |
| Real-time | Live updates for leaderboards |
| Row Level Security | Security at database level |
| Free tier | 500MB database, 2GB file storage |

### Why Client-Side Simulations?

```
❌ Server-Side Simulation          ✅ Client-Side Simulation
───────────────────────            ───────────────────────────
• Server CPU cost                  • No server cost
• API latency                      • Instant feedback
• Scalability concerns             • Scales infinitely
• Rate limiting needed             • Runs in Web Worker
                                   • Offline capable
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   1. User clicks "Sign in with Google"                                  │
│                         │                                                │
│                         ▼                                                │
│   2. Supabase Auth redirects to Google                                  │
│                         │                                                │
│                         ▼                                                │
│   3. User authenticates with Google                                     │
│                         │                                                │
│                         ▼                                                │
│   4. Google redirects back with token                                   │
│                         │                                                │
│                         ▼                                                │
│   5. Supabase validates token, creates session                          │
│                         │                                                │
│                         ▼                                                │
│   6. Session stored in HTTP-only cookie                                 │
│                         │                                                │
│                         ▼                                                │
│   7. User redirected to app with session                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS)

```sql
-- Example: Users can only update their own decks
CREATE POLICY "Users can update own decks" ON decks
    FOR UPDATE USING (auth.uid() = user_id);
```

All user data is protected by RLS policies at the database level.

---

## Caching Strategy

| Data Type | Cache Location | TTL | Invalidation |
|-----------|---------------|-----|--------------|
| Card data | Supabase + CDN | 7 days | Manual on sync |
| Card images | Vercel Edge | 30 days | Never (immutable) |
| Tournament data | Supabase | 24 hours | Cron job |
| Meta stats | Computed | 6 hours | Recompute |
| User decks | Supabase | None | Real-time |

---

## Scalability Considerations

### Current Stage (MVP)

- Single Vercel deployment
- Supabase free tier (500MB)
- No caching layer (PostgreSQL is fast enough)
- Client-side simulations

### Growth Stage (10K+ Users)

- Consider Vercel Edge caching
- Supabase Pro tier
- CDN for static assets
- Rate limiting on API routes

### Scale Stage (100K+ Users)

- Database connection pooling
- Read replicas if needed
- Consider edge functions
- Dedicated Supabase instance

---

## Monitoring & Observability

### Current (MVP)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Vercel Analytics ─────▶ Page performance, traffic                     │
│                                                                          │
│   Console logs ─────────▶ Debug information (dev only)                  │
│                                                                          │
│   Supabase Dashboard ───▶ Database metrics, auth stats                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Future

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Sentry ───────────────▶ Error tracking, stack traces                  │
│                                                                          │
│   Google Analytics ─────▶ User behavior, conversions                    │
│                                                                          │
│   Stripe Dashboard ─────▶ Revenue, subscriptions                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Code     │────▶│    Push     │────▶│   Vercel    │────▶│   Deploy    │
│   Change    │     │  to GitHub  │     │   Build     │     │  to Edge    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               │ Preview URL for PRs
                                               ▼
                                        ┌─────────────┐
                                        │   Review    │
                                        │   Deploy    │
                                        └─────────────┘
```

### Environments

| Environment | URL | Database |
|-------------|-----|----------|
| Development | localhost:3000 | Local or Supabase dev |
| Preview | *.vercel.app | Supabase staging |
| Production | thecardseeker.com | Supabase production |

---

## Future Considerations

### Potential Additions

| Feature | Technology | When |
|---------|------------|------|
| Full-text search | Supabase pg_trgm | Phase 2 |
| Real-time leaderboards | Supabase Realtime | Phase 2 |
| AI chat assistant | Anthropic API | Phase 3 |
| Mobile app | React Native / Capacitor | Phase 4 |
| Localization | next-intl | Phase 3 |

### Not Planned (Over-Engineering)

- ❌ Kubernetes
- ❌ Microservices
- ❌ GraphQL (REST is fine)
- ❌ Redis (PostgreSQL is enough)
- ❌ Self-hosted anything

---

*This architecture supports the goal of $5K/month revenue with minimal operational complexity.*
