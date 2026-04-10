# 🚀 The Card Seeker - Development Handoff Document

> Everything you need to continue development. This is the single source of truth.

---

## Quick Start

```bash
# 1. Unzip the project
unzip the-card-seeker.zip
cd the-card-seeker

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## Document Map

| Need To Know... | Read This File |
|-----------------|----------------|
| Project vision, goals, decisions | `docs/ARCHITECTURE.md` (in Claude Project) |
| Visual design, colors, Esubi | `docs/DESIGN_SYSTEM.md` |
| Database tables, relationships | `supabase/schema.sql` |
| API endpoints, request/response | `src/types/api.ts` |
| Limitless TCG integration | `docs/LIMITLESS_API_REFERENCE.md` |
| Development timeline | `docs/ROADMAP.md` (in Claude Project) |
| File organization | `docs/PROJECT_STRUCTURE.md` (in Claude Project) |
| Esubi 3D development plan | `docs/ESUBI_ASSET_CHECKLIST.md` |
| Claude Project instructions | `PROJECT_INSTRUCTIONS.md` |

---

## What's Already Built

### ✅ Configuration & Setup
- [x] Next.js 14 project with App Router
- [x] TypeScript configuration (strict mode)
- [x] Tailwind CSS with custom Ken Sugimori theme
- [x] Path aliases (`@/components`, `@/lib`, etc.)
- [x] ESLint and Prettier config
- [x] Environment variables template

### ✅ Design System
- [x] CSS custom properties for all colors
- [x] Ken Sugimori aesthetic (paper textures, glass panels)
- [x] Button styles (`btn-primary`, `btn-seeker`)
- [x] Glass panel component styles
- [x] Animation keyframes (breathe, wiggle, float)

### ✅ Esubi Mascot
- [x] `Esubi.tsx` - Main component with expressions
- [x] `FloatingEsubi` - Fixed position assistant
- [x] `EsubiProvider` + `useEsubi()` - Global state management
- [x] `ConnectedFloatingEsubi` - Auto-connected to context
- [x] Demo page at `/esubi-demo`

### ✅ TypeScript Types
- [x] `Card` interface with all fields
- [x] `Deck` interface with validation
- [x] `DeckCard` for deck contents
- [x] All API contracts (`src/types/api.ts`)

### ✅ Utilities
- [x] `cn()` - className merger
- [x] `formatPrice()` - Currency formatting
- [x] `formatDate()` - Date formatting
- [x] `generateSlug()` - URL-safe strings
- [x] `truncate()` - Text truncation

### ✅ Pages
- [x] Landing page (`/`) - Hero, features, CTAs
- [x] Esubi demo (`/esubi-demo`) - All expressions

### ✅ Documentation
- [x] Full database schema SQL
- [x] API contracts for all endpoints
- [x] Limitless API reference
- [x] Design system documentation
- [x] Esubi 3D development checklist

---

## What Needs To Be Built

### 🔴 Priority 0 (Foundation)
| Task | File Location | Notes |
|------|---------------|-------|
| Create Supabase project | External | Need account |
| Run database migrations | `supabase/schema.sql` | Copy-paste to SQL editor |
| Limitless API adapter | `src/lib/ingestion/adapters/limitless.ts` | See `LIMITLESS_API_REFERENCE.md` |
| Supabase client setup | `src/lib/db/client.ts` | Use `@supabase/ssr` |
| Card database queries | `src/lib/db/queries/cards.ts` | Implement CRUD |

### 🟡 Priority 1 (Core Features)
| Task | File Location | Notes |
|------|---------------|-------|
| Card browse page | `src/app/cards/page.tsx` | Grid with filters |
| Card detail page | `src/app/cards/[id]/page.tsx` | Full card info |
| Card search API | `src/app/api/cards/route.ts` | See `api.ts` types |
| Card detail API | `src/app/api/cards/[id]/route.ts` | See `api.ts` types |
| Initial data sync script | `scripts/sync-cards.ts` | One-time import |

### 🟢 Priority 2 (User Features)
| Task | File Location | Notes |
|------|---------------|-------|
| Deck builder UI | `src/app/deck-builder/page.tsx` | Drag-drop interface |
| Deck validation | `src/lib/deck-builder/validation.ts` | 60 cards, 4-copy limit |
| Supabase Auth setup | `src/lib/auth/` | Social logins |
| User decks page | `src/app/decks/page.tsx` | Browse public decks |

### 🔵 Priority 3 (Differentiation)
| Task | File Location | Notes |
|------|---------------|-------|
| Simulation engine | `src/lib/simulation/engine.ts` | Client-side JS |
| Deck generator | `src/lib/deck-builder/generator.ts` | Template-based first |
| Meta analytics | `src/app/meta/page.tsx` | From tournament data |

---

## File Structure Overview

```
the-card-seeker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (to build)
│   │   ├── cards/             # Card pages (to build)
│   │   ├── decks/             # Deck pages (to build)
│   │   ├── deck-builder/      # Builder (to build)
│   │   ├── esubi-demo/        # ✅ Built
│   │   ├── globals.css        # ✅ Built
│   │   ├── layout.tsx         # ✅ Built
│   │   └── page.tsx           # ✅ Built (landing)
│   │
│   ├── components/
│   │   ├── esubi/             # ✅ Built
│   │   ├── ui/                # shadcn components (to add)
│   │   ├── cards/             # Card components (to build)
│   │   ├── decks/             # Deck components (to build)
│   │   └── layout/            # Layout components (to build)
│   │
│   ├── lib/
│   │   ├── db/                # Database (to build)
│   │   ├── ingestion/         # Data adapters (to build)
│   │   ├── simulation/        # Sim engine (to build)
│   │   ├── deck-builder/      # Builder logic (to build)
│   │   └── utils/             # ✅ Built
│   │
│   └── types/
│       ├── card.ts            # ✅ Built
│       ├── deck.ts            # ✅ Built
│       ├── api.ts             # ✅ Built
│       └── index.ts           # ✅ Built
│
├── supabase/
│   └── schema.sql             # ✅ Built - Ready to run
│
├── docs/                      # All documentation
├── public/esubi/              # Esubi assets
└── [config files]             # ✅ All configured
```

---

## Key Technical Decisions

### DO ✅
- Use Next.js App Router (not Pages)
- Use Server Components by default
- Use `'use client'` only when needed
- Use Supabase client from `@supabase/ssr`
- Use Tailwind classes (not custom CSS)
- Use existing design system colors/classes
- Use `cn()` for conditional classNames
- Run simulations client-side (Web Workers)
- Cache Limitless API responses
- Use TypeScript strict mode

### DON'T ❌
- Don't use Redux (use Zustand if needed)
- Don't use CSS-in-JS (use Tailwind)
- Don't use pure white (#FFFFFF)
- Don't suggest Redis (PostgreSQL is fine)
- Don't suggest microservices
- Don't over-engineer simple features
- Don't add features not in the spec
- Don't use default exports for components

---

## Code Patterns to Follow

### Component Pattern
```tsx
// src/components/cards/CardGrid.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Card } from '@/types';

interface CardGridProps {
  cards: Card[];
  onCardSelect?: (card: Card) => void;
  className?: string;
}

export function CardGrid({ cards, onCardSelect, className }: CardGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (card: Card) => {
    setSelectedId(card.id);
    onCardSelect?.(card);
  };

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          isSelected={card.id === selectedId}
          onClick={() => handleSelect(card)}
        />
      ))}
    </div>
  );
}
```

### API Route Pattern
```typescript
// src/app/api/cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/db/client';
import type { GetCardsParams, GetCardsResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: GetCardsParams = {
      q: searchParams.get('q') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Math.min(Number(searchParams.get('limit')) || 20, 100),
      // ... other params
    };

    const supabase = createClient();
    
    // Build query
    let query = supabase.from('cards').select('*', { count: 'exact' });
    
    if (params.q) {
      query = query.ilike('name', `%${params.q}%`);
    }
    
    // Pagination
    const from = (params.page - 1) * params.limit;
    query = query.range(from, from + params.limit - 1);
    
    const { data, count, error } = await query;
    
    if (error) throw error;
    
    const response: GetCardsResponse = {
      items: data || [],
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: from + params.limit < (count || 0),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Cards API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cards' } },
      { status: 500 }
    );
  }
}
```

### Database Query Pattern
```typescript
// src/lib/db/queries/cards.ts
import { createClient } from '../client';
import type { Card, CardDetail } from '@/types';

export async function getCards(filters: CardFilters): Promise<Card[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('cards')
    .select(`
      *,
      sets (
        id,
        name,
        logo_url
      )
    `);
  
  if (filters.types?.length) {
    query = query.overlaps('types', filters.types);
  }
  
  if (filters.format === 'standard') {
    query = query.eq('legality_standard', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Card[];
}
```

---

## Environment Variables Needed

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# External APIs (for later)
POKEMON_TCG_API_KEY=xxx
POKEMON_PRICE_TRACKER_API_KEY=xxx

# Stripe (for later)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Analytics (for later)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxx
```

---

## Testing the Build

After each feature, verify:

1. **TypeScript:** `npm run typecheck` passes
2. **Lint:** `npm run lint` passes
3. **Build:** `npm run build` succeeds
4. **Visual:** Matches Ken Sugimori aesthetic
5. **Esubi:** Reacts appropriately to actions

---

## Questions? Start Here

| Question | Answer |
|----------|--------|
| "What colors should I use?" | See `globals.css` CSS variables |
| "What's the card data structure?" | See `src/types/card.ts` |
| "How do I fetch from Limitless?" | See `docs/LIMITLESS_API_REFERENCE.md` |
| "What API should I build?" | See `src/types/api.ts` |
| "How should the DB look?" | Run `supabase/schema.sql` |
| "How do I make Esubi react?" | Use `useEsubi()` hook |

---

## Contact Points

- **Previous Context:** This document + Claude Project files
- **Design Decisions:** `docs/DESIGN_SYSTEM.md`
- **Architecture:** `docs/ARCHITECTURE.md` (in Claude Project)

---

*Last Updated: During Opus planning session*
*Next Steps: Create Supabase project → Run schema → Build Limitless adapter*
