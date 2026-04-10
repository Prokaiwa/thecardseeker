# 🧠 Claude Project Instructions: Best Practices Guide

> How to write effective project instructions that make Claude more helpful, consistent, and aligned with your vision.

---

## Why Instructions Matter

```
WITHOUT INSTRUCTIONS                 WITH GOOD INSTRUCTIONS
────────────────────                 ──────────────────────

User: "Add a button"                 User: "Add a button"
Claude: *generic React button*       Claude: *Ken Sugimori styled,
        *random styling*                     gold-bordered button
        *might use different                 matching your design
         patterns each time*                 system, using your
                                            existing components*

😕 Inconsistent                      😊 Perfect every time
```

---

## The Anatomy of Great Instructions

### 1. Project Identity & Context

```markdown
## Project Overview
- **Name:** The Card Seeker
- **Type:** Pokemon TCG deck building platform (SaaS)
- **Stage:** Active development, pre-launch
- **Timeline:** 6 months to polished product

## Vision
Build the ultimate Pokemon TCG platform where players can build decks 
around their favorite Pokemon, not just meta picks. Our differentiator 
is the "Build Around" feature.

## Target Users
1. Competitive tournament players
2. Casual players who want to use favorite Pokemon
3. Collectors tracking card values
```

**Why this works:** Claude understands the *why* behind requests, not just the *what*.

---

### 2. Tech Stack & Constraints

```markdown
## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Hosting:** Vercel

## Constraints
- Must work on Vercel free tier initially
- No server-side heavy processing (use client-side where possible)
- Mobile-first responsive design
- Must support both English and Japanese (future)
```

**Why this works:** Prevents Claude from suggesting incompatible solutions.

---

### 3. Code Style & Patterns

```markdown
## Code Style

### TypeScript
- Strict mode enabled
- Prefer interfaces over types for objects
- Use `type` for unions and simple types
- Always define return types for functions

### React
- Functional components only
- Use named exports (not default) for components
- Hooks at the top of components
- Props interfaces named `{ComponentName}Props`

### File Naming
- Components: PascalCase (`CardGrid.tsx`)
- Utilities: camelCase (`formatPrice.ts`)
- Constants: SCREAMING_SNAKE_CASE
- CSS modules: `component.module.css`

### Example Component Structure
```tsx
// 1. Imports (external, then internal)
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 2. Types
interface CardItemProps {
  card: Card;
  onSelect?: (card: Card) => void;
}

// 3. Component
export function CardItem({ card, onSelect }: CardItemProps) {
  // hooks first
  const [isHovered, setIsHovered] = useState(false);
  
  // handlers
  const handleClick = () => onSelect?.(card);
  
  // render
  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```
```

**Why this works:** Every code generation matches your existing codebase.

---

### 4. Design System Reference

```markdown
## Design System

### Philosophy
Ken Sugimori watercolor aesthetic - soft, painterly, nostalgic.
NOT pure white (#FFFFFF) - use warm off-white (#F8F5F0).

### Key Colors
- Card white: #F8F5F0
- Gold border: #D4A017
- Seeker blue: #5B9BD5
- Text primary: #1A1A1A

### Component Patterns
- Use `glass-panel` class for floating cards
- Use `btn-primary` for main CTAs (gold gradient)
- Use `btn-seeker` for secondary actions (blue)

### Typography
- Display font: font-display (Futura-like)
- Body font: font-body (Nunito)
- Always use Tailwind classes, not custom CSS

### Esubi Integration
- Mascot name: Esubi (SB-060)
- Appears in bottom-right corner
- Reacts to user actions via useEsubi() hook
- Expressions: idle, searching, celebrating, confused, error
```

**Why this works:** Design consistency without re-explaining every time.

---

### 5. Decision Log (Critical!)

```markdown
## Key Decisions Made

### Data Sources
- **Primary:** Limitless TCG API (free, no auth needed)
- **Pricing:** PokemonPriceTracker API (100 free/day)
- **Fallback:** Pokemon TCG API
- **Decision date:** [Date]
- **Rationale:** Best free options with good data quality

### Architecture
- Monolith first, no microservices (premature optimization)
- Client-side simulations (no server cost)
- Template-based deck generation first, AI later

### Rejected Approaches
- ❌ Multiple databases (over-engineering)
- ❌ Redis caching (PostgreSQL is fast enough initially)
- ❌ Self-hosted AI (server costs, maintenance)
```

**Why this works:** Prevents Claude from re-suggesting rejected ideas.

---

### 6. Workflow Preferences

```markdown
## How I Like to Work

### Communication Style
- Be concise, not verbose
- Use bullet points for lists
- Show code examples, don't just describe
- Ask clarifying questions if request is ambiguous

### When Building Features
1. Confirm understanding of requirements first
2. Suggest approach before coding
3. Build incrementally (not everything at once)
4. Explain non-obvious decisions

### Code Delivery
- Complete, working code (not pseudocode)
- Include TypeScript types
- Add brief comments for complex logic
- Show file paths for where code goes

### What to Avoid
- Don't over-engineer simple solutions
- Don't add features I didn't ask for
- Don't repeat explanations I've already seen
- Don't suggest paid services when free alternatives exist
```

**Why this works:** Claude adapts to YOUR preferred working style.

---

### 7. Common Tasks & Shortcuts

```markdown
## Quick Reference Commands

When I say...          Do this...
─────────────          ──────────
"Add a component"      Create in src/components/, use design system
"Add an API route"     Create in src/app/api/, include error handling
"Update the schema"    Edit Supabase migration, update types
"Style this"           Use Tailwind + our design system classes
"Make Esubi react"     Use useEsubi() hook with appropriate expression

## Frequently Used Patterns

### API Route Template
- Always include try/catch
- Return proper status codes
- Use Zod for validation
- Log errors to console (Sentry later)

### Database Query Template
- Use Supabase client from @/lib/db/client
- Handle errors gracefully
- Return typed responses
```

**Why this works:** Speeds up common requests dramatically.

---

### 8. Current Focus & Context

```markdown
## Current Sprint

### Active Work
- Building card database and search
- Implementing Limitless API adapter
- Creating card detail pages

### Recently Completed
- Project setup and configuration
- Design system documentation
- Esubi component system

### Blocked/Waiting
- Domain purchase (payment issue)
- Supabase project creation (waiting for domain)

### Next Up
- Deck builder UI
- User authentication
```

**Why this works:** Claude knows what's relevant RIGHT NOW.

---

## Example: Complete Instructions Template

```markdown
# The Card Seeker - Project Instructions

## Identity
Pokemon TCG deck building platform. Differentiator: "Build Around Your 
Favorite Pokemon" feature. Ken Sugimori watercolor aesthetic.

## Tech Stack
Next.js 14 (App Router), Supabase, Tailwind + shadcn/ui, Vercel

## Code Style
- TypeScript strict mode
- Functional components, named exports
- Props interfaces: `{Name}Props`
- Use path aliases: `@/components`, `@/lib`

## Design System
- Never use pure white - use #F8F5F0
- Gold borders: #D4A017
- Seeker blue: #5B9BD5
- Use existing classes: glass-panel, btn-primary, btn-seeker
- Mascot: Esubi (useEsubi hook for reactions)

## Data Sources
1. Limitless TCG API (primary, free)
2. PokemonPriceTracker (pricing, 100/day free)
3. Pokemon TCG API (fallback)

## Key Decisions
- Client-side simulations (no server cost)
- Template deck generation first, AI later
- Monolith architecture (no microservices)
- Free tier everything until revenue

## Workflow
- Be concise, show code not descriptions
- Confirm understanding before large tasks
- Use our existing patterns and components
- Don't over-engineer or add unrequested features

## Current Focus
Building card database, search, and Limitless API integration.

## Files to Reference
- /docs/DESIGN_SYSTEM.md - Full design documentation
- /docs/ARCHITECTURE.md - System architecture
- /public/esubi/esubi-design-spec.json - Esubi specifications
```

---

## Pro Tips

### 1. Keep It Updated
Your instructions should evolve. After each major decision or phase, update them.

### 2. Reference Project Files
```markdown
## Key Documentation
See these files for details:
- ARCHITECTURE.md - System design
- DESIGN_SYSTEM.md - Visual guidelines  
- ROADMAP.md - Timeline and phases
```
This way Claude can `view` these files when needed.

### 3. Include Anti-Patterns
```markdown
## What NOT to Do
- Don't suggest Redux (we use Zustand)
- Don't use CSS-in-JS (we use Tailwind)
- Don't add console.logs in production code
- Don't suggest Firebase (we're committed to Supabase)
```

### 4. Specify Output Format
```markdown
## Response Preferences
- Code blocks with file paths as comments
- Bullet points over paragraphs
- Tables for comparisons
- Mermaid diagrams for architecture
```

### 5. Include Personality/Tone (Optional)
```markdown
## Tone
- Enthusiastic but practical
- Use Pokemon references when appropriate
- Celebrate wins ("That's a winning deck!")
- Be direct about problems
```

---

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Better Approach |
|---------|--------------|-----------------|
| Too vague | Claude guesses your preferences | Be specific about patterns |
| Too long | Information overload | Keep to 1-2 pages, reference docs |
| Out of date | Contradicts current state | Update after major changes |
| No examples | Ambiguous interpretation | Show code/design examples |
| All positive | No guardrails | Include anti-patterns too |

---

## Quick Start Template

Copy this and customize:

```markdown
# [Project Name] Instructions

## What Is This?
[One sentence description]

## Tech Stack
[Framework], [Database], [Styling], [Hosting]

## Code Style
- [Key convention 1]
- [Key convention 2]
- [Key convention 3]

## Design
- [Primary color]
- [Key visual pattern]
- [Component library]

## Current Focus
[What you're building right now]

## Preferences
- [How you like responses]
- [What to avoid]
```

---

*Remember: Good instructions = Faster development + Consistent output + Less repetition*
