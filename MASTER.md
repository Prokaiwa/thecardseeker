# 📋 The Card Seeker - MASTER Project Document

> Single source of truth. Updated after planning session with Opus.

---

## Quick Links

| Document | Purpose | Location |
|----------|---------|----------|
| Project Instructions | Paste into Claude Project | `PROJECT_INSTRUCTIONS.md` (use ENHANCED version) |
| Handoff | Context for new sessions | `HANDOFF.md` |
| Design System | Visual guidelines | `docs/DESIGN_SYSTEM.md` |
| Data Flow | How pieces connect | `docs/DATA_FLOW_DIAGRAM.md` |
| Database Schema | SQL to run in Supabase | `supabase/schema.sql` |
| API Contracts | TypeScript interfaces | `src/types/api.ts` |
| Limitless API | Data source guide | `docs/LIMITLESS_API_REFERENCE.md` |
| Esubi Checklist | 3D development plan | `docs/ESUBI_ASSET_CHECKLIST.md` |
| First Message | Template for new chats | `docs/FIRST_MESSAGE_TEMPLATE.md` |

---

## Project Vision

### The Pitch
**"I love Jigglypuff but it's weak alone. How can I make a competitive deck that still uses my favorite Pokemon?"**

No existing tool solves this well. We do.

### Differentiator
**Build Around Your Favorite Pokemon** - Not just meta picks. Make ANY Pokemon competitive.

### Target Users
1. Competitive tournament players
2. Casual players wanting to use favorites
3. Collectors tracking card values

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | Best React DX, Vercel deployment |
| Database | Supabase (PostgreSQL) | Free tier, real-time, auth built-in |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| Auth | Supabase Auth | Social logins, JWT sessions |
| Payments | Stripe | Industry standard |
| Hosting | Vercel | Free tier, automatic deploys |

---

## Design System Summary

### Ken Sugimori Aesthetic
- **NEVER** pure white (#FFFFFF)
- Use warm off-white (#F8F5F0)
- Painterly, watercolor textures
- Gold borders like Pokemon cards
- Glass-morphism panels

### Key Colors
| Name | Hex | Usage |
|------|-----|-------|
| Card White | #F8F5F0 | Backgrounds |
| Card Cream | #FFF8E7 | Card surfaces |
| Gold | #D4A017 | Borders, primary buttons |
| Seeker Blue | #5B9BD5 | CTAs, accents |

### Esubi (Mascot)
- **Name:** Esubi (SB-060)
- **Pronunciation:** eh-SOO-bee (エスビ)
- **Species:** Seeker Buddy
- **Role:** Site assistant, reacts to user actions
- **Component:** `<ConnectedFloatingEsubi />`
- **Hook:** `useEsubi()` for triggering reactions

---

## Data Sources

| Source | Purpose | Limit | Priority |
|--------|---------|-------|----------|
| Limitless TCG | Cards, tournaments, meta | Free, no key | PRIMARY |
| PokemonPriceTracker | Pricing data | 100/day free | Pricing |
| Pokemon TCG API | Fallback card data | 20K/day | Fallback |
| pkmncards.com | Metadata, artists | 1 req/2 sec | Scraping |

---

## Key Decisions (Locked In)

### DO ✅
- Client-side simulations (no server cost)
- Template deck generation first, AI later
- Monolith architecture
- Free tier everything until revenue
- Mobile-first responsive design

### DON'T ❌
- No Redis (PostgreSQL is enough)
- No self-hosted AI
- No multiple databases
- No microservices
- No over-engineering

---

## Current State

### Completed ✅
- [x] Next.js 14 project initialized
- [x] TypeScript with strict mode
- [x] Tailwind + custom design system
- [x] All CSS variables and utility classes
- [x] Esubi component (with expressions)
- [x] Landing page
- [x] Database schema designed
- [x] API contracts defined
- [x] All documentation

### In Progress 🔄
- [ ] Card database (Limitless adapter)
- [ ] Supabase project setup
- [ ] Card browse/search page

### Upcoming ⏳
- [ ] Deck builder UI
- [ ] User authentication
- [ ] Simulation engine
- [ ] Meta analytics

---

## Monetization

### Free Tier
- Card database access
- 5 saved decks
- 3 AI generations/month
- Basic simulations

### Premium ($5.99/mo or $47.99/yr)
- Unlimited decks
- Unlimited AI generations
- Advanced simulations
- Collection tracking
- Price alerts
- Export to all formats

### Affiliate Revenue
- TCGPlayer: 5%
- eBay: Variable
- Cardmarket: 3%

---

## Success Metrics

### MVP Goals
- 1,000 monthly active users
- 100 decks created per week
- <2 sec page load times

### Revenue Goal
- $5,000/month within 12 months

---

## Files to Upload to Claude Project

### Project Instructions (Paste Content)
```
PROJECT_INSTRUCTIONS_ENHANCED.md
```

### Project Knowledge (Upload Files)
1. `HANDOFF.md`
2. `docs/DESIGN_SYSTEM.md`
3. `docs/DATA_FLOW_DIAGRAM.md`
4. `docs/LIMITLESS_API_REFERENCE.md`
5. `supabase/schema.sql`
6. `ARCHITECTURE.md` (create or add externally)
7. `ROADMAP.md` (create or add externally)

---

## Missing Assets (To Create)

| Asset | Location | Notes |
|-------|----------|-------|
| `favicon.ico` | `/public/` | Site favicon |
| `apple-touch-icon.png` | `/public/` | iOS icon |
| `og-image.png` | `/public/` | Social sharing image |
| `site.webmanifest` | `/public/` | PWA manifest |
| Esubi PNGs | `/public/esubi/static/` | Expression images |

---

## Development Workflow

### Starting a New Session
1. Read HANDOFF.md first
2. Check current state above
3. Pick next task from "Upcoming"
4. Build incrementally
5. Update this document after major progress

### Before Each Commit
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Matches design system
- [ ] Esubi reacts appropriately

---

*Last Updated: Planning session with Opus*
*Next: Create Supabase project → Run schema → Build Limitless adapter*
