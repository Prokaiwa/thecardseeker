# The Card Seeker - Claude Code Instructions

## Project Overview
Pokémon TCG deck-building SaaS. Helps players build competitive decks around their FAVORITE Pokémon, not just meta picks.

## Tech Stack
- Framework: Next.js 14 (App Router) - NOT Vite
- Database: Supabase (PostgreSQL)
- Styling: Tailwind CSS + custom Ken Sugimori theme
- UI Components: shadcn/ui (restyled to match our aesthetic)
- Icons: Lucide React (NEVER emojis)
- APIs: TCGdex (cards, FREE), Limitless TCG (tournaments, FREE)

## Design Rules - ALWAYS FOLLOW
1. NEVER use pure white (#FFFFFF) → Use #F8F5F0 (card-white)
2. NEVER use emojis → Use Lucide React icons
3. Gold borders (#D4A017) on important containers
4. Glass-panel effect: bg-card-white/85 backdrop-blur-xl border border-gold/30 rounded-2xl
5. Watercolor texture background (already set up)
6. Warm shadows, not harsh black

## Key Colors
- card-white: #F8F5F0 (off-white backgrounds)
- gold: #D4A017 (borders, accents)
- seeker: #5B9BD5 (CTAs, links)
- esubi-body: #F0DFC8, esubi-frame: #D4736A, esubi-screen: #8DCFEF

## Esubi Mascot
- Use expressions: idle, searching, celebrating, confused, error, waving
- Floating helper in bottom-right (already implemented)
- Trigger reactions: useEsubi() hook → celebrate(), search(), confused(), error()

## File Locations
- Design system: src/app/globals.css, tailwind.config.ts
- API adapters: src/lib/ingestion/ (TCGdex + Limitless)
- Esubi component: src/components/esubi/
- Types: src/types/

## Commands
- npm run dev → Start dev server
- npx tsc --noEmit → Check TypeScript errors

## Quality Checklist (Before completing any component)
- [ ] No pure white, no emojis
- [ ] Uses our color variables
- [ ] Has loading state with Esubi
- [ ] Has error handling
- [ ] Mobile responsive
- [ ] TypeScript strict compliant
