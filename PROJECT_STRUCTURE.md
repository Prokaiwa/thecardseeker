# 📁 The Card Seeker - Project Structure

> Complete file organization reference.

---

## Root Directory

```
the-card-seeker/
│
├── 📄 Configuration Files
│   ├── .env.example           # Environment variables template
│   ├── .env.local             # Your local env vars (gitignored)
│   ├── .eslintrc.json         # ESLint configuration
│   ├── .gitignore             # Git ignore rules
│   ├── .prettierrc            # Prettier configuration
│   ├── next.config.js         # Next.js configuration
│   ├── package.json           # Dependencies and scripts
│   ├── postcss.config.js      # PostCSS for Tailwind
│   ├── tailwind.config.ts     # Tailwind theme customization
│   └── tsconfig.json          # TypeScript configuration
│
├── 📚 Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── HANDOFF.md             # Development context
│   ├── MASTER.md              # Single source of truth
│   ├── PROJECT_INSTRUCTIONS.md # Claude Project instructions
│   ├── README.md              # Project overview
│   └── ROADMAP.md             # Development timeline
│
├── 📂 docs/                   # Additional documentation
├── 📂 public/                 # Static assets
├── 📂 src/                    # Source code
└── 📂 supabase/               # Database files
```

---

## Source Code (`src/`)

```
src/
│
├── app/                       # Next.js App Router
│   │
│   ├── (marketing)/           # Public pages (landing, about)
│   │   ├── page.tsx          # Landing page (/)
│   │   ├── about/            # About page
│   │   └── pricing/          # Pricing page
│   │
│   ├── (app)/                 # Authenticated app pages
│   │   ├── cards/            # Card browsing
│   │   │   ├── page.tsx      # Card list (/cards)
│   │   │   └── [id]/         # Card detail (/cards/[id])
│   │   │       └── page.tsx
│   │   │
│   │   ├── decks/            # Deck management
│   │   │   ├── page.tsx      # Deck list (/decks)
│   │   │   └── [id]/         # Deck detail (/decks/[id])
│   │   │       └── page.tsx
│   │   │
│   │   ├── deck-builder/     # Deck builder
│   │   │   └── page.tsx      # Builder UI (/deck-builder)
│   │   │
│   │   ├── simulator/        # Simulation tool
│   │   │   └── page.tsx      # Simulator (/simulator)
│   │   │
│   │   └── meta/             # Meta analytics
│   │       └── page.tsx      # Meta dashboard (/meta)
│   │
│   ├── api/                   # API Routes
│   │   ├── cards/
│   │   │   ├── route.ts      # GET /api/cards
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET /api/cards/[id]
│   │   │
│   │   ├── decks/
│   │   │   ├── route.ts      # GET, POST /api/decks
│   │   │   ├── [id]/
│   │   │   │   └── route.ts  # GET, PUT, DELETE /api/decks/[id]
│   │   │   └── generate/
│   │   │       └── route.ts  # POST /api/decks/generate
│   │   │
│   │   ├── simulate/
│   │   │   └── route.ts      # POST /api/simulate
│   │   │
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts  # Stripe webhooks
│   │   │
│   │   └── cron/
│   │       ├── sync-cards/
│   │       │   └── route.ts  # Daily card sync
│   │       └── sync-prices/
│   │           └── route.ts  # Daily price sync
│   │
│   ├── esubi-demo/            # Esubi demo page
│   │   └── page.tsx
│   │
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
│
├── components/                # React Components
│   │
│   ├── ui/                    # Base UI (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── cards/                 # Card-specific components
│   │   ├── CardGrid.tsx       # Grid of cards
│   │   ├── CardItem.tsx       # Single card in grid
│   │   ├── CardDetail.tsx     # Full card view
│   │   ├── CardSearch.tsx     # Search input
│   │   ├── CardFilters.tsx    # Filter controls
│   │   └── CardStats.tsx      # Card statistics
│   │
│   ├── decks/                 # Deck-specific components
│   │   ├── DeckList.tsx       # List of decks
│   │   ├── DeckCard.tsx       # Deck preview card
│   │   ├── DeckBuilder.tsx    # Builder interface
│   │   ├── DeckStats.tsx      # Deck statistics
│   │   ├── DeckValidation.tsx # Validation display
│   │   └── DeckExport.tsx     # Export options
│   │
│   ├── esubi/                 # Mascot components
│   │   ├── Esubi.tsx          # Main component
│   │   ├── esubi.css          # Animations
│   │   └── index.ts           # Exports
│   │
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   │
│   └── common/                # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       └── Pagination.tsx
│
├── lib/                       # Core Libraries
│   │
│   ├── db/                    # Database access
│   │   ├── client.ts          # Supabase client
│   │   └── queries/
│   │       ├── cards.ts       # Card queries
│   │       ├── decks.ts       # Deck queries
│   │       └── users.ts       # User queries
│   │
│   ├── ingestion/             # Data pipeline
│   │   ├── adapters/
│   │   │   ├── limitless.ts   # Limitless TCG adapter
│   │   │   ├── pokemontcg.ts  # Pokemon TCG API adapter
│   │   │   └── pricetracker.ts # Price tracker adapter
│   │   │
│   │   ├── transforms/
│   │   │   └── normalize.ts   # Data normalization
│   │   │
│   │   └── sync/
│   │       ├── cards.ts       # Card sync job
│   │       └── prices.ts      # Price sync job
│   │
│   ├── simulation/            # Probability engine
│   │   ├── engine.ts          # Core simulation logic
│   │   ├── worker.ts          # Web Worker wrapper
│   │   └── calculations.ts    # Math utilities
│   │
│   ├── deck-builder/          # Deck logic
│   │   ├── validation.ts      # Validation rules
│   │   ├── generator.ts       # Deck generation
│   │   └── synergies.ts       # Synergy calculation
│   │
│   └── utils/                 # Utilities
│       └── index.ts           # Common utilities
│
├── hooks/                     # Custom React Hooks
│   ├── useCards.ts            # Card data fetching
│   ├── useDecks.ts            # Deck operations
│   ├── useSimulation.ts       # Simulation runner
│   └── useAuth.ts             # Authentication
│
├── stores/                    # Zustand Stores
│   ├── deckBuilderStore.ts    # Deck builder state
│   └── uiStore.ts             # UI state
│
└── types/                     # TypeScript Types
    ├── api.ts                 # API contracts
    ├── card.ts                # Card types
    ├── deck.ts                # Deck types
    └── index.ts               # Exports
```

---

## Documentation (`docs/`)

```
docs/
├── CLAUDE_INSTRUCTIONS_GUIDE.md   # How to write good instructions
├── DATA_FLOW_DIAGRAM.md           # System data flow
├── DESIGN_SYSTEM.md               # Visual design guide
├── ESUBI_ASSET_CHECKLIST.md       # 3D mascot development
├── FIRST_MESSAGE_TEMPLATE.md      # Template for new chats
└── LIMITLESS_API_REFERENCE.md     # Primary API reference
```

---

## Public Assets (`public/`)

```
public/
│
├── esubi/                     # Mascot assets
│   ├── esubi-design-spec.json # Esubi specifications
│   ├── static/                # Static expression PNGs
│   │   ├── esubi-idle.png
│   │   ├── esubi-searching.png
│   │   ├── esubi-celebrating.png
│   │   ├── esubi-confused.png
│   │   └── esubi-error.png
│   └── sprites/               # Animation sprite sheets (future)
│
├── textures/                  # Background textures
│   └── paper-grain.png        # Paper texture overlay
│
├── icons/                     # Energy type icons, etc.
│
├── images/                    # Static images
│
├── favicon.ico                # Browser favicon
├── apple-touch-icon.png       # iOS icon
├── og-image.png               # Social sharing image
└── site.webmanifest           # PWA manifest
```

---

## Database (`supabase/`)

```
supabase/
├── schema.sql                 # Complete database schema
├── migrations/                # Future migrations (folder)
└── seed/                      # Seed data (folder)
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CardGrid.tsx` |
| Utilities | camelCase | `formatPrice.ts` |
| Types | camelCase | `card.ts` |
| API routes | lowercase | `route.ts` |
| CSS modules | kebab-case | `card-grid.module.css` |
| Constants | SCREAMING_SNAKE | `API_ENDPOINTS.ts` |

---

## Import Aliases

Configured in `tsconfig.json`:

```typescript
// Instead of: import { Card } from '../../../types/card'
// Use: import { Card } from '@/types'

@/components  →  src/components
@/lib         →  src/lib
@/types       →  src/types
@/hooks       →  src/hooks
@/stores      →  src/stores
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, Esubi provider |
| `src/app/globals.css` | All global styles |
| `src/types/api.ts` | All API contracts |
| `supabase/schema.sql` | Database structure |
| `tailwind.config.ts` | Theme customization |
| `.env.example` | Required environment variables |

---

*Use this as reference when adding new files to maintain consistency.*
