# First Message Template for New Conversations

Copy and paste this as your FIRST message when starting a new conversation with Sonnet (or any Claude model):

---

## Template (Copy This)

```
Hi! I'm continuing work on The Card Seeker - a Pokemon TCG deck building platform.

**Before we start, please:**
1. Read HANDOFF.md in the project knowledge - it has critical context
2. Note the Project Instructions for code conventions and design system
3. Check DATA_FLOW_DIAGRAM.md to understand how pieces connect

**Quick context:**
- This was planned with Opus, now implementing with you (Sonnet)
- Foundation is built: Next.js project, Esubi mascot, types, design system
- Database schema is ready in schema.sql (not deployed yet)

**Today I want to work on:** [INSERT TASK]

Let me know once you've reviewed the docs and we can start!
```

---

## Example First Messages

### If starting with Limitless API:
```
Hi! I'm continuing work on The Card Seeker - a Pokemon TCG deck building platform.

Please read HANDOFF.md first for context. Then check LIMITLESS_API_REFERENCE.md.

Today I want to build the Limitless TCG API adapter. This is the foundation for fetching card data. The file should go in src/lib/ingestion/adapters/limitless.ts.

Let me know once you've reviewed the docs!
```

### If starting with Card Browse Page:
```
Hi! I'm continuing work on The Card Seeker.

Please read HANDOFF.md and DESIGN_SYSTEM.md first.

Today I want to build the card browse page at src/app/cards/page.tsx. It should:
- Use the Ken Sugimori aesthetic (warm colors, glass panels)
- Have search and filters
- Display cards in a responsive grid
- Make Esubi react when searching (useEsubi hook)

Let me know once you've reviewed!
```

### If continuing mid-project:
```
Continuing The Card Seeker development.

**What's done:**
- [List recent completions]

**What I want to work on today:**
- [Specific task]

Please confirm you have access to the project docs and we can start.
```

---

## Pro Tips for Multi-Session Projects

1. **Start each session with context** - Don't assume the model remembers
2. **Reference specific files** - "See DESIGN_SYSTEM.md for colors"
3. **Be explicit about patterns** - "Follow the component pattern in HANDOFF.md"
4. **Update HANDOFF.md** - After major progress, update what's done
5. **Keep Project Instructions current** - Update "Current State" section

---

## If Sonnet Seems Confused

Say:
```
Please re-read the Project Instructions and HANDOFF.md. 

Key points:
- Tech stack: Next.js 14, Supabase, Tailwind
- Design: Ken Sugimori aesthetic, never pure white
- Mascot: Esubi, use useEsubi() hook
- Code: TypeScript strict, named exports, path aliases

Now let's continue with [task].
```
