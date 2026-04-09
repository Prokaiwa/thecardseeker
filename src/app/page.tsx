import Link from 'next/link';
import {
  Target,
  Dices,
  Trophy,
  BarChart3,
  DollarSign,
  Globe,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Subtle gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-seeker-light/5 via-transparent to-gold/5" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center lg:py-32">
        {/* Esubi mascot */}
        <div className="mx-auto mb-8 h-32 w-32">
          <Image
            src="/esubi/static/esubi-idle.png"
            alt="Esubi - The Card Seeker mascot"
            width={128}
            height={128}
            className="h-full w-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="heading-display mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
          Build Your Perfect{' '}
          <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
            Pokémon TCG
          </span>{' '}
          Deck
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[rgb(var(--text-primary))] sm:text-xl">
          Want to build a winning deck around{' '}
          <em className="font-semibold text-[rgb(var(--text-primary))]">your</em>{' '}
          favorite Pokémon? The Card Seeker helps you create competitive decks 
          featuring the Pokémon you love. Simulate hands, track prices, and dominate.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/deck-builder" className="btn-primary text-lg">
            Start Building
          </Link>
          <Link href="/cards" className="btn-secondary text-lg">
            Browse Cards
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[rgb(var(--text-muted))]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[rgb(var(--text-primary))]">28,000+</span>
            <span>Cards</span>
          </div>
          <div className="h-4 w-px bg-card-texture" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-[rgb(var(--text-primary))]">All</span>
            <span>Formats</span>
          </div>
          <div className="h-4 w-px bg-card-texture" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-[rgb(var(--text-primary))]">EN + JP</span>
            <span>Support</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 border-t border-gold/10 bg-card-cream/40 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="heading-display text-center text-3xl sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[rgb(var(--text-primary))]">
            From casual deck building to competitive tournament prep.
          </p>

          {/* Feature Grid */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-fire/10">
                <Target className="h-6 w-6 text-pokemon-fire" />
              </div>
              <h3 className="font-display text-xl font-bold">Build Around</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Pick your favorite Pokémon and we&apos;ll help you build a competitive
                deck around it.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-water/10">
                <Dices className="h-6 w-6 text-pokemon-water" />
              </div>
              <h3 className="font-display text-xl font-bold">Simulate</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Test your deck with thousands of opening hand simulations. Know your
                odds before you play.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-electric/10">
                <Trophy className="h-6 w-6 text-pokemon-electric" />
              </div>
              <h3 className="font-display text-xl font-bold">Compete</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Climb the leaderboards with your custom builds. Weekly challenges and
                community rankings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-grass/10">
                <BarChart3 className="h-6 w-6 text-pokemon-grass" />
              </div>
              <h3 className="font-display text-xl font-bold">Meta Analytics</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Real tournament data. See what&apos;s winning, what&apos;s trending, and what
                counters what.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-psychic/10">
                <DollarSign className="h-6 w-6 text-pokemon-psychic" />
              </div>
              <h3 className="font-display text-xl font-bold">Price Tracking</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Know what your deck costs. One-click links to buy from TCGPlayer, eBay,
                and Cardmarket.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-panel p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pokemon-dragon/10">
                <Globe className="h-6 w-6 text-pokemon-dragon" />
              </div>
              <h3 className="font-display text-xl font-bold">JP Support</h3>
              <p className="mt-2 text-[rgb(var(--text-primary))]">
                Japanese cards included. See what&apos;s coming before it hits the English
                format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="glass-panel-bordered p-12">
            <h2 className="heading-display text-3xl sm:text-4xl">
              Ready to Find Your Deck?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[rgb(var(--text-primary))]">
              Join thousands of trainers building their perfect decks. Free to start,
              premium features for serious competitors.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-primary text-lg">
                Create Free Account
              </Link>
              <Link href="/decks" className="btn-secondary text-lg">
                Explore Decks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/10 bg-card-cream/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-seeker-gradient shadow-sm">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold">The Card Seeker</span>
            </div>

            <div className="flex gap-6 text-sm text-[rgb(var(--text-muted))]">
              <Link href="/about" className="hover:text-[rgb(var(--text-primary))]">
                About
              </Link>
              <Link href="/privacy" className="hover:text-[rgb(var(--text-primary))]">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[rgb(var(--text-primary))]">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[rgb(var(--text-primary))]">
                Contact
              </Link>
            </div>

            <p className="text-sm text-[rgb(var(--text-muted))]">
              © {new Date().getFullYear()} The Card Seeker. Not affiliated with Nintendo,
              The Pokémon Company, or Creatures Inc.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
