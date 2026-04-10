# 🗺️ The Card Seeker - Development Roadmap

> 6-month journey from zero to polished product.

---

## Timeline Overview

```
Month 1         Month 2         Month 3         Month 4         Month 5         Month 6
────────────────────────────────────────────────────────────────────────────────────────
│               │               │               │               │               │
▼               ▼               ▼               ▼               ▼               ▼
┌───────────────┬───────────────┬───────────────┬───────────────┬───────────────┬───────────────┐
│  FOUNDATION   │  CORE LOOP    │  SIMULATION   │  SOCIAL       │  POLISH       │  LAUNCH       │
│               │               │               │               │               │               │
│ • Data sync   │ • Deck builder│ • Sim engine  │ • Leaderboards│ • Performance │ • Beta launch │
│ • Card pages  │ • Validation  │ • Deck gen    │ • Auth        │ • Mobile UX   │ • Marketing   │
│ • Search      │ • Save/load   │ • Meta stats  │ • Premium     │ • SEO         │ • Iterate     │
└───────────────┴───────────────┴───────────────┴───────────────┴───────────────┴───────────────┘
```

---

## Phase 1: Foundation (Month 1)

### Goals
- Get cards on screen
- Working search and browse
- Data pipeline running

### Week 1-2: Data Infrastructure
| Task | Priority | Status |
|------|----------|--------|
| Create Supabase project | P0 | ⬜ |
| Run database schema | P0 | ⬜ |
| Build Limitless API adapter | P0 | ⬜ |
| Initial card data sync | P0 | ⬜ |
| Set up Supabase client | P0 | ⬜ |

### Week 3-4: Card Display
| Task | Priority | Status |
|------|----------|--------|
| Card browse page | P0 | ⬜ |
| Card search/filter | P0 | ⬜ |
| Card detail page | P0 | ⬜ |
| Card grid component | P0 | ⬜ |
| Set listing page | P1 | ⬜ |
| Price display | P1 | ⬜ |

### Milestone: "Cards on Screen"
- [ ] Can browse all cards
- [ ] Can search by name
- [ ] Can filter by type/set
- [ ] Card details show full info
- [ ] Prices displayed

---

## Phase 2: Core Loop (Month 2)

### Goals
- Build and save decks
- Validation works
- Import/export

### Week 5-6: Deck Builder UI
| Task | Priority | Status |
|------|----------|--------|
| Deck builder page layout | P0 | ⬜ |
| Card pool (left panel) | P0 | ⬜ |
| Deck area (right panel) | P0 | ⬜ |
| Drag-and-drop or click-to-add | P0 | ⬜ |
| Deck stats display | P0 | ⬜ |
| Format selector | P0 | ⬜ |

### Week 7-8: Deck Logic
| Task | Priority | Status |
|------|----------|--------|
| Deck validation (60 cards, 4-copy) | P0 | ⬜ |
| Basic Pokemon requirement | P0 | ⬜ |
| Save deck to database | P0 | ⬜ |
| Load existing decks | P0 | ⬜ |
| PTCGO import/export | P1 | ⬜ |
| Deck list view | P1 | ⬜ |

### Milestone: "Build a Deck"
- [ ] Can add/remove cards
- [ ] Validation shows errors
- [ ] Can save deck
- [ ] Can reload saved decks
- [ ] Can export to PTCGO format

---

## Phase 3: Simulation & Generation (Month 3)

### Goals
- Probability engine working
- "Build Around" feature functional
- Meta analytics

### Week 9-10: Simulation Engine
| Task | Priority | Status |
|------|----------|--------|
| Core simulation engine | P0 | ⬜ |
| Web Worker setup | P0 | ⬜ |
| Opening hand odds | P0 | ⬜ |
| Supporter T1 odds | P0 | ⬜ |
| Simulation panel UI | P0 | ⬜ |
| Prize card odds | P1 | ⬜ |

### Week 11-12: Deck Generation
| Task | Priority | Status |
|------|----------|--------|
| Template-based generator | P0 | ⬜ |
| "Build Around" input UI | P0 | ⬜ |
| Synergy calculation | P0 | ⬜ |
| Generation results display | P0 | ⬜ |
| Meta statistics page | P1 | ⬜ |
| Tournament data sync | P1 | ⬜ |

### Milestone: "Build Around Works"
- [ ] Can pick favorite Pokemon
- [ ] Generator creates valid deck
- [ ] Simulation shows probabilities
- [ ] Meta stats show archetype performance

---

## Phase 4: Social & Premium (Month 4)

### Goals
- User accounts
- Leaderboards
- Payment system

### Week 13-14: Authentication
| Task | Priority | Status |
|------|----------|--------|
| Supabase Auth setup | P0 | ⬜ |
| Google OAuth | P0 | ⬜ |
| Discord OAuth | P1 | ⬜ |
| User profile page | P0 | ⬜ |
| Protected routes | P0 | ⬜ |
| Session handling | P0 | ⬜ |

### Week 15-16: Social Features
| Task | Priority | Status |
|------|----------|--------|
| Public deck sharing | P0 | ⬜ |
| Deck likes | P0 | ⬜ |
| Weekly leaderboards | P0 | ⬜ |
| Deck forking | P1 | ⬜ |
| Stripe integration | P0 | ⬜ |
| Premium tier gating | P0 | ⬜ |

### Milestone: "Users & Revenue"
- [ ] Can sign up/login
- [ ] Can share decks publicly
- [ ] Leaderboards show top decks
- [ ] Can subscribe to premium
- [ ] Premium features gated correctly

---

## Phase 5: Polish (Month 5)

### Goals
- Performance optimization
- Mobile experience
- SEO ready

### Week 17-18: Performance
| Task | Priority | Status |
|------|----------|--------|
| Core Web Vitals audit | P0 | ⬜ |
| Image optimization | P0 | ⬜ |
| Bundle size reduction | P0 | ⬜ |
| Loading states/skeletons | P1 | ⬜ |
| Error boundaries | P1 | ⬜ |
| Offline support (PWA) | P2 | ⬜ |

### Week 19-20: Mobile & SEO
| Task | Priority | Status |
|------|----------|--------|
| Mobile touch improvements | P0 | ⬜ |
| Responsive tweaks | P0 | ⬜ |
| SEO meta tags | P0 | ⬜ |
| Sitemap generation | P0 | ⬜ |
| Structured data | P1 | ⬜ |
| Analytics setup (GA4) | P1 | ⬜ |

### Milestone: "Production Ready"
- [ ] Lighthouse score >90
- [ ] Mobile experience smooth
- [ ] SEO audit passing
- [ ] Analytics tracking
- [ ] Error monitoring live

---

## Phase 6: Launch (Month 6)

### Goals
- Public beta launch
- Initial user acquisition
- Iterate based on feedback

### Week 21-22: Beta Launch
| Task | Priority | Status |
|------|----------|--------|
| Domain setup | P0 | ⬜ |
| Production environment | P0 | ⬜ |
| Soft launch to friends | P0 | ⬜ |
| Gather initial feedback | P0 | ⬜ |
| Bug fixes | P0 | ⬜ |
| Documentation | P1 | ⬜ |

### Week 23-24: Marketing
| Task | Priority | Status |
|------|----------|--------|
| Reddit posts (r/pkmntcg) | P0 | ⬜ |
| Twitter/X presence | P1 | ⬜ |
| Pokemon TCG Discord servers | P1 | ⬜ |
| Content: "How to build around X" | P1 | ⬜ |
| Affiliate link setup | P1 | ⬜ |
| Iterate based on feedback | P0 | ⬜ |

### Milestone: "LIVE"
- [ ] thecardseeker.com live
- [ ] 100+ registered users
- [ ] First premium subscriber
- [ ] First affiliate revenue
- [ ] Community feedback collected

---

## Feature Priority Matrix

### P0 - Must Have (Launch Blockers)
- Card database and search
- Deck builder with validation
- Simulation engine
- "Build Around" generator
- User authentication
- Basic deck sharing

### P1 - Should Have (First Month Post-Launch)
- Premium subscription
- Leaderboards
- Meta analytics
- PTCGO import/export
- Mobile PWA

### P2 - Nice to Have (3 Months Post-Launch)
- Collection tracking
- Price alerts
- AI chat assistant
- Japanese localization
- Tournament tracking

### P3 - Future (6+ Months)
- Mobile app (native)
- API for third parties
- Community features (forums)
- Live tournament integration

---

## Success Metrics by Phase

| Phase | Metric | Target |
|-------|--------|--------|
| Foundation | Cards indexed | 10,000+ |
| Core Loop | Decks created | 100+ |
| Simulation | Simulations run | 1,000+ |
| Social | Registered users | 500+ |
| Polish | Lighthouse score | 90+ |
| Launch | MAU | 1,000+ |

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Limitless API changes | High | Low | Multiple data sources |
| Supabase free tier limits | Medium | Medium | Monitor usage, plan upgrade |
| Low user adoption | High | Medium | Community engagement, SEO |
| Copyright issues (images) | Medium | Low | Link to official sources |
| Feature creep | Medium | High | Stick to roadmap |

---

## Commitment

- **Hours/week:** 7-12 hours
- **Primary work time:** Evenings/weekends
- **Review cadence:** Weekly progress check
- **Adjust roadmap:** Monthly based on progress

---

## Post-Launch Roadmap (Months 7-12)

### Month 7-8: Iterate
- User feedback implementation
- Performance improvements
- Bug fixes
- Community building

### Month 9-10: Expand
- AI chat assistant (premium)
- Advanced analytics
- Collection manager
- Price alerts

### Month 11-12: Scale
- Japanese card support
- Multiple languages
- Native mobile app research
- Partnership outreach

---

*Revenue Goal: $5,000/month by Month 12*

---

## Current Position

```
[===>                                                          ] 8%

Phase 1: Foundation
├── ✅ Project setup
├── ✅ Design system
├── ✅ Esubi mascot
├── ✅ Database schema
├── ✅ Type definitions
├── ⬜ Supabase project
├── ⬜ Limitless adapter
├── ⬜ Card sync
├── ⬜ Card browse page
└── ⬜ Card detail page

Next: Create Supabase project and build Limitless adapter
```

---

*Last Updated: Planning session with Opus*
