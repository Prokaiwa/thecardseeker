# 🔍 The Card Seeker

> Build competitive Pokemon TCG decks around your favorite Pokemon.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Features

- **🎯 Build Around**: Pick your favorite Pokemon and get a competitive deck built around it
- **🎲 Simulate**: Test opening hands with probability analysis
- **🏆 Compete**: Climb leaderboards with your custom builds
- **📊 Meta Analytics**: Real tournament data and trends
- **💰 Price Tracking**: One-click buy links to TCGPlayer, eBay, Cardmarket
- **🗾 JP Support**: Japanese cards included

## 🎨 Design

The Card Seeker features a Ken Sugimori-inspired aesthetic with:
- Soft watercolor-style backgrounds
- Painted paper textures
- Classic Pokemon card gold borders
- "Seeker" companion mascot based on VS Seeker

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/the-card-seeker.git
cd the-card-seeker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── cards/             # Card pages
│   ├── decks/             # Deck pages
│   ├── deck-builder/      # Deck builder
│   └── meta/              # Meta analytics
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── cards/            # Card-related
│   ├── decks/            # Deck-related
│   └── layout/           # Layout components
├── lib/                   # Core libraries
│   ├── db/               # Database utilities
│   ├── ingestion/        # Data pipeline
│   └── simulation/       # Simulation engine
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Auth**: Supabase Auth
- **Payments**: Stripe

## 📊 Data Sources

- **Limitless TCG**: Card data, tournament results
- **pkmncards.com**: Card metadata, artist info
- **PokemonPriceTracker**: Pricing data
- **Pokemon TCG API**: Fallback card data

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

The Card Seeker is not affiliated with, endorsed by, or connected to Nintendo, The Pokemon Company, Creatures Inc., or any of their subsidiaries. Pokemon and all related marks are trademarks of their respective owners.

---

Made with ❤️ for Pokemon TCG players everywhere.
