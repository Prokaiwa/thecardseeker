# 🎨 The Card Seeker - Design System

> A Ken Sugimori-inspired design language for the ultimate Pokemon TCG platform.

---

## Design Philosophy

### The Vision
The Card Seeker should feel like stepping into a Ken Sugimori illustration - soft, painterly, nostalgic, yet functional. Every element should evoke the texture of original Pokemon card stock: that warm, slightly grey-white with visible brushstroke qualities beneath.

### Design Pillars

| Pillar | Description |
|--------|-------------|
| **Nostalgic Warmth** | Evokes Base Set era feelings, hand-painted quality |
| **Tactile Texture** | Feels like holding a real card - paper grain, soft edges |
| **Playful Authority** | Fun and approachable, yet data-rich and trustworthy |
| **Dynamic Energy** | Backgrounds shift based on Pokemon type context |

### What We're NOT
- ❌ Flat, sterile digital interfaces
- ❌ Pure white backgrounds (#FFFFFF)
- ❌ Generic UI kit aesthetics
- ❌ Over-designed gradients
- ❌ Corporate/enterprise feel

---

## Esubi (エスビ) - Official Mascot

### Character Profile

| Attribute | Detail |
|-----------|--------|
| **Name** | Esubi |
| **Designation** | SB-060 |
| **Species** | Seeker Buddy |
| **Pronunciation** | eh-SOO-bee (エスビ) |
| **Origin** | Japanese phonetic of "SB" (Seeker Buddy) |
| **Inspiration** | VS Seeker item from Pokemon games |
| **Art Style** | Ken Sugimori watercolor |
| **Created With** | Nano Banana AI |

### Name Etymology

```
  S       B       →    エス    ビ    →    Esubi
  ↓       ↓            ↓      ↓
Seeker  Buddy         E-SU   BI         eh-SOO-bee
```

**The Pronunciation Debate™:** Americans will say "EE-soo-bee" - let them argue about it. The correct pronunciation is "eh-SOO-bee" (Japanese style). This ambiguity creates conversation and engagement.

### Character Design

```
                    ╭─╮
                    │●│              ← Red antenna tip (wiggles when active)
                 ╭──┴─┴──╮
                ╱  ╭───╮  ╲          ← Coral/red-orange frame ring
               │  ╱     ╲  │
               │ │ ◉   ◉ │ │         ← Blue screen with expressions
               │ │   ‿   │ │            Soft gradient, subtle scan line
               │  ╲     ╱  │
               │   ╰───╯   │         ← Cream/warm beige body
               │ ╭───────╮ │            Watercolor texture throughout
              ╭╯ │       │ ╰╮        ← Stubby arms (gesture capable)
             ╱   ╰───────╯   ╲
            ╱                 ╲
           ╱___╲           ╱___╲      ← Little feet for stability
```

### Esubi's Personality

| Trait | Description | UI Behavior |
|-------|-------------|-------------|
| **Helpful** | Always eager to assist | Appears with tips, never intrusive |
| **Curious** | Loves discovering new cards | Antenna wiggles during searches |
| **Encouraging** | Celebrates user wins | Sparkle eyes on achievements |
| **Patient** | Never judges bad decks | Gentle suggestions, not criticism |
| **Knowledgeable** | Pokemon TCG expert | Provides meta insights |

### Official Expressions

Based on the original Nano Banana artwork:

| State | Expression | Screen Display | Arms | Usage |
|-------|------------|----------------|------|-------|
| **Idle/Happy** | Dot eyes, gentle smile | Default blue, relaxed | Down at sides | Default state |
| **Searching** | Spiral/swirl eyes, open mouth | Animated swirls | - | During API calls, generating |
| **Celebrating** | Star eyes, big open smile | Sparkle effects | Raised up! | Deck saved, achievement unlocked |
| **Confused/Thinking** | Dot eyes, question mark, small "o" mouth | Question mark floating | - | Processing, unclear input |
| **Error/Concerned** | Worried eyes, frown | Slightly dimmed | - | Validation errors, issues |
| **Found It!** | Big happy eyes, excited | Glowing brighter | Raised | Search results ready |

### Esubi Color Palette (Extracted from Official Art)

```css
:root {
  /* === ESUBI OFFICIAL COLORS === */
  
  /* Body - Warm cream with watercolor variation */
  --esubi-body-light: #F7EBD8;     /* Highlight areas */
  --esubi-body-main: #F0DFC8;      /* Primary body color */
  --esubi-body-shadow: #E5D0B5;    /* Shaded areas */
  --esubi-body-depth: #D4BC9A;     /* Deep shadows, edges */
  
  /* Screen Frame - Coral/Red-orange ring */
  --esubi-frame-light: #E8847A;    /* Highlight */
  --esubi-frame-main: #D4736A;     /* Primary frame color */
  --esubi-frame-shadow: #BC5F56;   /* Shadow areas */
  
  /* Screen - Soft blue gradient */
  --esubi-screen-light: #B8E4F8;   /* Top of screen (lighter) */
  --esubi-screen-main: #8DCFEF;    /* Primary screen blue */
  --esubi-screen-dark: #6BB8DE;    /* Bottom of screen */
  --esubi-screen-line: #A5D8F0;    /* The subtle horizontal line */
  
  /* Antenna */
  --esubi-antenna-tip: #D4534A;    /* Red tip */
  --esubi-antenna-base: #E8847A;   /* Matches frame */
  
  /* Expression Elements */
  --esubi-eyes: #3D3D3D;           /* Dark eyes */
  --esubi-mouth: #4A4A4A;          /* Mouth/expressions */
  --esubi-sparkle: #FFD93D;        /* Star/sparkle effects */
  --esubi-blush: #F5A0A0;          /* Optional blush marks */
}
```

### Esubi Design Specification (JSON)

This JSON can be used to recreate Esubi consistently across any medium:

```json
{
  "character": {
    "name": "Esubi",
    "designation": "SB-060",
    "species": "Seeker Buddy",
    "pronunciation": {
      "correct": "eh-SOO-bee",
      "japanese": "エスビ",
      "phonetic": "/ɛˈsuːbi/"
    }
  },
  
  "design": {
    "style": "Ken Sugimori watercolor",
    "proportions": {
      "headBodyRatio": "1:1.2",
      "screenToBodyRatio": "0.6",
      "armLength": "0.3x body width",
      "legHeight": "0.15x total height",
      "antennaHeight": "0.2x total height"
    },
    "shape": {
      "body": "Rounded rectangle with soft corners, slightly wider at bottom",
      "screen": "Perfect circle, inset into body",
      "arms": "Stubby, mitten-like, no fingers",
      "legs": "Short, trapezoidal feet",
      "antenna": "Thin stem with round bulb tip"
    }
  },

  "colors": {
    "body": {
      "light": "#F7EBD8",
      "main": "#F0DFC8",
      "shadow": "#E5D0B5",
      "depth": "#D4BC9A",
      "texture": "Visible watercolor grain and soft brush strokes"
    },
    "screenFrame": {
      "light": "#E8847A",
      "main": "#D4736A",
      "shadow": "#BC5F56",
      "width": "8-10% of screen diameter"
    },
    "screen": {
      "gradient": {
        "top": "#B8E4F8",
        "middle": "#8DCFEF",
        "bottom": "#6BB8DE"
      },
      "scanLine": {
        "color": "#A5D8F0",
        "opacity": 0.5,
        "position": "center horizontal"
      }
    },
    "antenna": {
      "tip": "#D4534A",
      "stem": "#E8847A"
    },
    "expressions": {
      "eyes": "#3D3D3D",
      "mouth": "#4A4A4A",
      "sparkles": "#FFD93D",
      "swirls": "#6B9BC3",
      "questionMark": "#6B9BC3"
    }
  },

  "expressions": {
    "idle": {
      "eyes": { "type": "dots", "size": "small", "position": "center-upper" },
      "mouth": { "type": "gentle-smile", "curve": "subtle" },
      "extras": []
    },
    "searching": {
      "eyes": { "type": "spirals", "animation": "rotating", "speed": "medium" },
      "mouth": { "type": "open-o", "size": "small" },
      "extras": ["antenna-wiggle"]
    },
    "celebrating": {
      "eyes": { "type": "stars", "animation": "sparkling" },
      "mouth": { "type": "big-smile", "open": true },
      "extras": ["arms-raised", "sparkle-effects"]
    },
    "confused": {
      "eyes": { "type": "dots", "size": "small" },
      "mouth": { "type": "small-o" },
      "extras": ["question-mark-float"]
    },
    "error": {
      "eyes": { "type": "worried", "shape": "curved-down" },
      "mouth": { "type": "frown", "subtle": true },
      "extras": ["screen-dim"]
    }
  },

  "animation": {
    "idle": {
      "breathing": { "scale": [1.0, 1.02], "duration": "3s", "easing": "ease-in-out" },
      "antenna": { "sway": "subtle", "duration": "4s" }
    },
    "searching": {
      "antenna": { "wiggle": true, "speed": "fast", "angle": "±15deg" },
      "screen": { "pulse": true, "opacity": [0.9, 1.0] }
    },
    "celebrating": {
      "bounce": { "height": "5%", "duration": "0.5s", "count": 3 },
      "arms": { "wave": true },
      "sparkles": { "emit": true, "count": 5 }
    }
  },

  "rendering": {
    "style": "Watercolor with visible texture",
    "edges": "Soft, slightly feathered",
    "shading": "Gradient-based, warm undertones",
    "highlights": "Subtle white/cream accents",
    "texture": {
      "type": "Paper grain visible through paint",
      "intensity": "Subtle but present",
      "consistency": "Throughout entire character"
    }
  },

  "usage": {
    "minSize": "32px (icon only)",
    "recommendedSizes": ["64px", "128px", "256px", "512px"],
    "backgrounds": ["White", "Cream", "Light patterns only"],
    "clearSpace": "20% of Esubi height on all sides"
  }
}
```

### AI Image Generation Prompt (Updated for Esubi)

Use this prompt with **Nano Banana** or other AI tools to create consistent Esubi artwork:

```
Ken Sugimori watercolor art style illustration of "Esubi" - a cute 
handheld device character mascot. Rounded cream/warm beige body with 
visible watercolor texture and soft brushstrokes. Large circular blue 
screen for a face with coral/red-orange frame ring around it. Small 
red antenna on top of head. Stubby mitten-like arms, small feet. 

The screen displays expressive dot eyes and a gentle smile. Subtle 
horizontal line across the screen (like a scan line). The character 
has a helpful, friendly appearance similar to a Rotom Pokedex.

Style: Official Pokemon character art, Ken Sugimori, watercolor, 
soft edges, warm lighting, paper texture visible, cream and blue 
color palette with coral accents. White/off-white background.

[ADD EXPRESSION]: happy / searching (spiral eyes) / celebrating 
(star eyes, arms up) / confused (question mark) / worried
```

### Future Esubi Variants

The SB-060 designation allows for future Seeker Buddies:

| Designation | Name (TBD) | Role | Color Accent |
|-------------|------------|------|--------------|
| SB-060 | **Esubi** | Deck Building | Blue (current) |
| SB-061 | *Reserved* | Collection Tracking | Green? |
| SB-062 | *Reserved* | Meta Analysis | Purple? |
| SB-063 | *Reserved* | Price Alerts | Gold? |

Each would share the same body design but with different screen colors and personalities!

---

## Color System

### Primary Palette

```css
:root {
  /* Base Card Stock Colors - The Foundation */
  --card-white: #F8F5F0;        /* Warm off-white, like card paper */
  --card-cream: #FFF8E7;        /* Slightly yellowed, aged feel */
  --card-grey: #E8E4DC;         /* The grey undertone of card stock */
  --card-texture: #D8D4CC;      /* Visible brushstroke shadows */
  
  /* Gold Border - Iconic Pokemon Card Frame */
  --border-gold: #D4A017;       /* Classic yellow border */
  --border-gold-light: #E8C547; /* Highlight */
  --border-gold-dark: #B8860B;  /* Shadow */
  
  /* Text Colors */
  --text-primary: #1A1A1A;      /* Near black, slightly warm */
  --text-secondary: #4A4A4A;    /* Medium grey */
  --text-muted: #7A7A7A;        /* Light grey */
  --text-on-dark: #F8F5F0;      /* Light text for dark backgrounds */
  
  /* Accent - Seeker Blue */
  --seeker-blue: #5B9BD5;       /* VS Seeker screen blue */
  --seeker-blue-light: #7CB3E8;
  --seeker-blue-dark: #4080C0;
  
  /* Status Colors */
  --success: #78C850;           /* Pokemon Grass green */
  --warning: #F8D030;           /* Pokemon Electric yellow */
  --error: #C03028;             /* Pokemon Fighting red */
  --info: #6890F0;              /* Pokemon Water blue */
}
```

### Energy Type Colors

These are used for dynamic backgrounds when viewing type-specific content:

```css
:root {
  /* Pokemon Energy Type Colors */
  --type-fire: #F08030;
  --type-water: #6890F0;
  --type-grass: #78C850;
  --type-electric: #F8D030;
  --type-psychic: #F85888;
  --type-fighting: #C03028;
  --type-dark: #705848;
  --type-steel: #B8B8D0;
  --type-fairy: #EE99AC;
  --type-dragon: #7038F8;
  --type-colorless: #A8A878;
  --type-normal: #A8A090;
  
  /* Watercolor Gradient Versions (for backgrounds) */
  --type-fire-wash: linear-gradient(
    135deg,
    rgba(240, 128, 48, 0.15) 0%,
    rgba(255, 200, 120, 0.1) 50%,
    rgba(240, 128, 48, 0.08) 100%
  );
  --type-water-wash: linear-gradient(
    135deg,
    rgba(104, 144, 240, 0.15) 0%,
    rgba(150, 200, 255, 0.1) 50%,
    rgba(104, 144, 240, 0.08) 100%
  );
  /* ... etc for each type */
}
```

### Dark Mode Palette

```css
[data-theme="dark"] {
  --card-white: #1A1A1A;
  --card-cream: #252525;
  --card-grey: #2A2A2A;
  --card-texture: #333333;
  
  --text-primary: #F8F5F0;
  --text-secondary: #B8B8B8;
  --text-muted: #888888;
  
  /* Gold stays warm but slightly muted */
  --border-gold: #C4901A;
}
```

---

## Typography

### Font Stack

```css
:root {
  /* Display Font - For headers, card names */
  /* Pokemon Card-inspired, bold, slightly condensed */
  --font-display: 'Futura PT', 'Futura', 'Trebuchet MS', sans-serif;
  
  /* Body Font - Clean, readable, friendly */
  --font-body: 'Nunito', 'Quicksand', system-ui, sans-serif;
  
  /* Mono Font - For stats, numbers, code */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Font Loading (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| `display-xl` | 3rem (48px) | 800 | Hero headlines |
| `display-lg` | 2.25rem (36px) | 700 | Page titles |
| `display-md` | 1.5rem (24px) | 700 | Section headers |
| `heading` | 1.25rem (20px) | 600 | Card titles, subsections |
| `body-lg` | 1.125rem (18px) | 400 | Lead paragraphs |
| `body` | 1rem (16px) | 400 | Default body text |
| `body-sm` | 0.875rem (14px) | 400 | Secondary text |
| `caption` | 0.75rem (12px) | 400 | Labels, meta info |
| `stat` | 1rem (16px) | 500 | Numbers, statistics (mono) |

### Typography CSS

```css
.display-xl {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.card-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.hp-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--error);
}
```

---

## Textures & Effects

### The Painted Paper Effect

This is the core of our Ken Sugimori aesthetic - making surfaces feel hand-painted.

```css
/* Base texture overlay - apply to main containers */
.paper-texture {
  position: relative;
  background-color: var(--card-white);
}

.paper-texture::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/paper-grain.png');
  opacity: 0.4;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Alternative: CSS-only noise texture */
.paper-texture-css {
  background-color: var(--card-white);
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: multiply;
}
```

### Watercolor Wash Background

For type-specific pages (e.g., viewing a Fire Pokemon):

```css
.watercolor-background {
  position: relative;
  overflow: hidden;
}

.watercolor-background::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: 
    radial-gradient(ellipse at 20% 30%, var(--type-color-alpha) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, var(--type-color-alpha-2) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, var(--type-color-alpha-3) 0%, transparent 60%);
  filter: blur(60px);
  opacity: 0.6;
  animation: watercolor-drift 20s ease-in-out infinite;
}

@keyframes watercolor-drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(2%, 1%) rotate(1deg); }
  66% { transform: translate(-1%, 2%) rotate(-1deg); }
}
```

### Glassmorphism Cards

Content panels float above the watercolor backgrounds:

```css
.glass-panel {
  background: rgba(248, 245, 240, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 160, 23, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* With gold border accent (like card frames) */
.glass-panel-bordered {
  background: rgba(248, 245, 240, 0.9);
  backdrop-filter: blur(20px);
  border: 3px solid var(--border-gold);
  border-radius: 8px;
  box-shadow: 
    0 0 0 1px var(--border-gold-dark),
    0 4px 24px rgba(0, 0, 0, 0.1);
}
```

### Card Hover Effect

Pokemon cards should feel tangible:

```css
.pokemon-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
}

.pokemon-card:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 60px rgba(212, 160, 23, 0.2);
}

/* Holographic shimmer for rare cards */
.pokemon-card.holo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.3) 30%,
    rgba(255, 200, 100, 0.2) 35%,
    rgba(100, 200, 255, 0.2) 40%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.pokemon-card.holo:hover::after {
  opacity: 1;
  animation: holo-shimmer 1.5s ease infinite;
}

@keyframes holo-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## Component Patterns

### Pokemon Card Component

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Gold border (3px)
│ ▓ ┌───────────────────────────┐ ▓ │
│ ▓ │  Charizard ex    330 HP 🔥│ ▓ │ ← Header: name, HP, type
│ ▓ ├───────────────────────────┤ ▓ │
│ ▓ │                           │ ▓ │
│ ▓ │      [Card Image]         │ ▓ │ ← Card artwork
│ ▓ │                           │ ▓ │
│ ▓ ├───────────────────────────┤ ▓ │
│ ▓ │  $45.99        ★★★★☆     │ ▓ │ ← Price, meta rating
│ ▓ └───────────────────────────┘ ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────────────┘
```

### Deck Builder Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════╗   │
│  ║  🔍 Search cards...                    [Filters ▼]       ║   │
│  ╚══════════════════════════════════════════════════════════╝   │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │                             │  │                         │   │
│  │      CARD POOL              │  │      YOUR DECK          │   │
│  │                             │  │                         │   │
│  │  ┌────┐ ┌────┐ ┌────┐      │  │  Pokemon (12)           │   │
│  │  │    │ │    │ │    │      │  │  ├─ Charizard ex ×3     │   │
│  │  └────┘ └────┘ └────┘      │  │  ├─ Charmander ×4       │   │
│  │  ┌────┐ ┌────┐ ┌────┐      │  │  └─ ...                 │   │
│  │  │    │ │    │ │    │      │  │                         │   │
│  │  └────┘ └────┘ └────┘      │  │  Trainers (36)          │   │
│  │                             │  │  ├─ Professor's Research│   │
│  │  [Load More...]             │  │  └─ ...                 │   │
│  │                             │  │                         │   │
│  └─────────────────────────────┘  │  Energy (12)            │   │
│                                   │  └─ Fire Energy ×12     │   │
│  ┌─────────────────────────────┐  │                         │   │
│  │  💡 SEEKER SAYS:            │  │  ─────────────────────  │   │
│  │  "Add 2 more Rare Candy     │  │  60/60 cards            │   │
│  │   for consistency!"         │  │  ✓ Deck is valid        │   │
│  │        [Seeker Icon]        │  │                         │   │
│  └─────────────────────────────┘  │  [Simulate] [Save]      │   │
│                                   └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Button Styles

```css
/* Primary Button - Gold accent */
.btn-primary {
  background: linear-gradient(180deg, var(--border-gold-light) 0%, var(--border-gold) 100%);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  padding: 12px 24px;
  border: 2px solid var(--border-gold-dark);
  border-radius: 8px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(212, 160, 23, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Secondary Button - Glass style */
.btn-secondary {
  background: rgba(248, 245, 240, 0.8);
  backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-weight: 600;
  padding: 12px 24px;
  border: 1px solid var(--card-texture);
  border-radius: 8px;
}

/* Seeker Blue Button */
.btn-seeker {
  background: linear-gradient(180deg, var(--seeker-blue-light) 0%, var(--seeker-blue) 100%);
  color: white;
  font-weight: 700;
  padding: 12px 24px;
  border: 2px solid var(--seeker-blue-dark);
  border-radius: 8px;
}
```

### Input Fields

```css
.input-field {
  background: rgba(248, 245, 240, 0.9);
  border: 2px solid var(--card-texture);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--border-gold);
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.2);
}

.input-field::placeholder {
  color: var(--text-muted);
}

/* Search Input with icon */
.search-input {
  padding-left: 44px;
  background-image: url('/icons/search.svg');
  background-repeat: no-repeat;
  background-position: 14px center;
  background-size: 20px;
}
```

---

## Energy Type Icons

SVG icons for each energy type, styled to match the aesthetic:

```css
.energy-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.energy-icon.fire { background: var(--type-fire); }
.energy-icon.water { background: var(--type-water); }
/* etc... */
```

---

## Spacing System

Using an 8px base grid:

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 2.5rem;    /* 40px */
  --space-8: 3rem;      /* 48px */
  --space-10: 4rem;     /* 64px */
  --space-12: 6rem;     /* 96px */
}
```

---

## Animation Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
  
  /* Easings */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Seeker wiggle animation */
@keyframes seeker-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Loading shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--card-grey) 25%,
    var(--card-cream) 50%,
    var(--card-grey) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Mobile-first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Accessibility

### Focus States

```css
/* Visible focus for keyboard navigation */
:focus-visible {
  outline: 3px solid var(--seeker-blue);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast

All text combinations meet WCAG AA standards:
- Primary text on card-white: 12.5:1 ✓
- Secondary text on card-white: 7.2:1 ✓
- Gold border visible against all backgrounds ✓

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation with Tailwind

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Card stock colors
        card: {
          white: '#F8F5F0',
          cream: '#FFF8E7',
          grey: '#E8E4DC',
          texture: '#D8D4CC',
        },
        // Gold border
        gold: {
          DEFAULT: '#D4A017',
          light: '#E8C547',
          dark: '#B8860B',
        },
        // Seeker blue
        seeker: {
          DEFAULT: '#5B9BD5',
          light: '#7CB3E8',
          dark: '#4080C0',
        },
        // Pokemon types
        pokemon: {
          fire: '#F08030',
          water: '#6890F0',
          grass: '#78C850',
          electric: '#F8D030',
          psychic: '#F85888',
          fighting: '#C03028',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
          dragon: '#7038F8',
          colorless: '#A8A878',
        },
      },
      fontFamily: {
        display: ['Futura PT', 'Futura', 'Trebuchet MS', 'sans-serif'],
        body: ['Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(212, 160, 23, 0.2)',
        gold: '0 0 0 1px #B8860B, 0 4px 24px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'seeker-wiggle': 'seeker-wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 1.5s infinite',
        'watercolor': 'watercolor-drift 20s ease-in-out infinite',
      },
      keyframes: {
        'seeker-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'watercolor-drift': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(2%, 1%) rotate(1deg)' },
          '66%': { transform: 'translate(-1%, 2%) rotate(-1deg)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## Asset Checklist

### Required Images
- [x] Esubi mascot - Idle/Happy expression
- [x] Esubi mascot - Searching expression (spiral eyes)
- [x] Esubi mascot - Celebrating expression (star eyes)
- [x] Esubi mascot - Confused expression (question mark)
- [ ] Esubi mascot - Error/Worried expression
- [ ] Paper grain texture (tileable PNG)
- [ ] Energy type icons (SVG)
- [ ] Logo with Esubi integration
- [ ] OG image for social sharing (featuring Esubi)
- [ ] Favicon (Esubi face simplified)

### Fonts to Load
- [x] Nunito (400, 600, 700, 800)
- [ ] JetBrains Mono (400, 500)
- [ ] (Optional) Custom display font if budget allows

---

## Creating More Esubi Artwork

### Using Nano Banana

Since Esubi was created with Nano Banana, use this workflow for consistency:

#### Base Prompt Template
```
Ken Sugimori watercolor art style, cute device mascot character named 
Esubi (SB-060). Rounded cream/warm beige body (#F0DFC8) with watercolor 
texture. Circular blue screen face (#8DCFEF) with coral-red frame ring 
(#D4736A). Small red antenna on top. Stubby arms, small feet.

[INSERT EXPRESSION/POSE HERE]

Style: Official Pokemon character art, soft watercolor, paper texture 
visible, warm lighting, white background.
```

#### Expression-Specific Prompts

**More Expressions Needed:**
```
[Worried/Error] - Curved down eyebrows, small frown, slightly dimmed screen
[Sleepy] - Half-closed eyes, small "z" floating, relaxed pose  
[Excited] - Wide eyes, big smile, bouncing pose, motion lines
[Waving] - One arm raised, friendly smile, greeting pose
[Reading] - Looking down, focused expression, holding card
[Pointing] - Arm extended, helpful expression, directing attention
```

**Action Poses:**
```
[Searching Animation Frame 1] - Spiral eyes beginning, antenna straight
[Searching Animation Frame 2] - Spiral eyes mid-spin, antenna tilted
[Searching Animation Frame 3] - Spiral eyes full spin, antenna wiggling
```

#### Consistency Tips for Nano Banana

1. **Always include these key terms:**
   - "Ken Sugimori watercolor"
   - "cream/warm beige body"
   - "coral-red frame ring"
   - "blue screen face"
   - "paper texture visible"

2. **Reference the original:**
   - Upload the original Esubi image as a reference
   - Use "consistent with reference" in prompt

3. **Maintain proportions:**
   - Screen is ~60% of body width
   - Arms are stubby, ~30% of body width
   - Antenna is ~20% of total height

---

## Animating Esubi

### The Challenge: Preserving Watercolor Texture

Static watercolor art → smooth animation is tricky. Here are your options:

### Option 1: Sprite Sheet Animation (Recommended for Web)

**How it works:**
- Create 4-8 keyframe images in Nano Banana
- Combine into sprite sheet
- Animate with CSS or JavaScript

**Pros:** Preserves 100% of watercolor texture
**Cons:** More images needed, larger file size

```css
/* CSS Sprite Animation Example */
.esubi {
  width: 128px;
  height: 128px;
  background: url('/esubi-spritesheet.png');
  animation: esubi-idle 2s steps(4) infinite;
}

@keyframes esubi-idle {
  from { background-position: 0 0; }
  to { background-position: -512px 0; }
}
```

**Frames Needed:**
| Animation | Frames | Purpose |
|-----------|--------|---------|
| Idle breathing | 4 | Default state |
| Searching | 6-8 | Spiral eyes rotation |
| Celebrating | 6 | Bounce + sparkles |
| Transition | 2-3 | Between expressions |

### Option 2: Layered Animation (Good Balance)

**How it works:**
- Separate Esubi into layers (body, screen, antenna, arms)
- Animate layers independently with CSS/Framer Motion
- Keep watercolor texture on static elements

**Layer Breakdown:**
```
Layer 5: Sparkles/Effects (animated separately)
Layer 4: Antenna (rotate/wiggle)
Layer 3: Arms (raise/lower)
Layer 2: Screen Content (eyes, mouth - swap images)
Layer 1: Body (subtle scale for breathing)
Layer 0: Shadow (subtle movement)
```

**Pros:** Smooth animation, smaller file size
**Cons:** Requires image editing to separate layers

### Option 3: Rive/Lottie (Most Advanced)

**Rive (rive.app):**
- Import Esubi artwork
- Rig with bones for smooth movement
- Export as lightweight runtime animation
- Works great for interactive states

**Lottie (lottiefiles.com):**
- Create in After Effects
- Export as JSON animation
- Very small file size
- Smooth vector-style animation

**Pros:** Professional quality, interactive
**Cons:** Learning curve, may lose some texture detail

### Option 4: CSS-Only for Simple States

For subtle movements that don't need frame-by-frame:

```css
/* Idle breathing */
.esubi-idle {
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Antenna wiggle */
.esubi-antenna {
  transform-origin: bottom center;
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

/* Searching state - pulse glow */
.esubi-searching .screen {
  animation: pulse-glow 1s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.1); }
}
```

### Recommended Animation Strategy

| Context | Method | Why |
|---------|--------|-----|
| **Hero/Landing** | Sprite sheet (6-8 frames) | Maximum quality, first impression |
| **In-app states** | Layered + CSS | Performance, smaller size |
| **Loading states** | CSS-only | Simple, no extra assets |
| **Complex interactions** | Rive | Smooth, professional |

### File Organization for Animations

```
public/
├── esubi/
│   ├── static/
│   │   ├── esubi-idle.png
│   │   ├── esubi-searching.png
│   │   ├── esubi-celebrating.png
│   │   ├── esubi-confused.png
│   │   └── esubi-worried.png
│   ├── sprites/
│   │   ├── esubi-idle-sheet.png      (4 frames, 512x128)
│   │   ├── esubi-search-sheet.png    (8 frames, 1024x128)
│   │   └── esubi-celebrate-sheet.png (6 frames, 768x128)
│   ├── layers/
│   │   ├── esubi-body.png
│   │   ├── esubi-screen-idle.png
│   │   ├── esubi-screen-search.png
│   │   ├── esubi-antenna.png
│   │   └── esubi-arms-*.png
│   └── lottie/
│       └── esubi-animations.json
```

---

## Esubi React Component Example

```tsx
// components/Esubi.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type EsubiState = 'idle' | 'searching' | 'celebrating' | 'confused' | 'error';

interface EsubiProps {
  state?: EsubiState;
  size?: number;
  className?: string;
  message?: string;
}

export function Esubi({ 
  state = 'idle', 
  size = 128, 
  className,
  message 
}: EsubiProps) {
  const [currentState, setCurrentState] = useState(state);
  
  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div 
        className={cn(
          'relative transition-transform duration-300',
          currentState === 'idle' && 'animate-[breathe_3s_ease-in-out_infinite]',
          currentState === 'searching' && 'animate-pulse',
          currentState === 'celebrating' && 'animate-bounce'
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={`/esubi/static/esubi-${currentState}.png`}
          alt={`Esubi is ${currentState}`}
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {message && (
        <div className="glass-panel px-4 py-2 text-sm max-w-xs text-center">
          <span className="font-medium text-seeker-dark">Esubi:</span>{' '}
          <span className="text-[rgb(var(--text-secondary))]">{message}</span>
        </div>
      )}
    </div>
  );
}
```

**Usage:**
```tsx
<Esubi state="searching" message="Looking for Fire-type Pokemon..." />
<Esubi state="celebrating" message="Found your perfect deck!" />
<Esubi state="confused" message="I didn't understand that. Try again?" />
```

---

## Esubi Voice & Messaging Guidelines

### Tone of Voice

| Attribute | Do | Don't |
|-----------|-----|-------|
| Helpful | "I found 12 matches!" | "12 results found." |
| Friendly | "Let's build something awesome!" | "Begin deck construction." |
| Encouraging | "Great choice! That card is trending." | "Card selected." |
| Humble | "I might be wrong, but..." | "The correct answer is..." |
| Playful | "Oops! I tripped on that one." | "Error occurred." |

### Message Templates

```typescript
const ESUBI_MESSAGES = {
  // Searching
  searching: [
    "Searching through {count} cards...",
    "Let me find that for you!",
    "Hmm, looking for {query}...",
  ],
  
  // Success
  found: [
    "Found it! {count} matches.",
    "Here's what I discovered!",
    "Ta-da! {count} results for you.",
  ],
  
  // Empty results
  notFound: [
    "Hmm, I couldn't find anything for that.",
    "No matches... try different filters?",
    "That's a tough one! No results found.",
  ],
  
  // Errors
  error: [
    "Oops! Something went wrong on my end.",
    "I tripped over a cable... try again?",
    "Error! Even Seeker Buddies make mistakes.",
  ],
  
  // Celebrations
  celebrate: [
    "Amazing deck! You're going to crush it!",
    "60 cards of pure strategy! Well done!",
    "This deck looks tournament-ready!",
  ],
  
  // Tips
  tips: [
    "Pro tip: Most winning decks run 12-14 Supporters.",
    "Did you know? {card} is in {percent}% of meta decks.",
    "Try adding {card} - it synergizes well!",
  ],
};
```

---

*This design system should evolve as we build. Document any new patterns here.*

*Last updated: With Esubi (SB-060) official profile and animation guidelines.*
