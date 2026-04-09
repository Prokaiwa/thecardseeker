import { Sparkles, Wand2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function AIGeneratorPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
            Coming Soon
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
            AI Deck Generator
          </h1>
          <p className="mt-1 text-[15px] text-[rgb(var(--text-muted))]">
            Build competitive decks around any Pokémon automatically
          </p>
        </div>

        {/* Coming soon panel */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-card-white/90 to-card-cream/60 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-seeker/20 to-gold/20">
            <Wand2 className="h-10 w-10 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[rgb(var(--text-primary))]">
            AI-Powered Deck Building
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
            Tell us your favorite Pokémon and our AI will craft a competitive deck
            strategy tailored around it — considering the current meta, synergies,
            and your budget.
          </p>

          {/* Features list */}
          <div className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
            {[
              'Favorite Pokémon as core',
              'Meta-aware suggestions',
              'Budget optimization',
              'Synergy analysis',
              'Tournament legality check',
              'Export to PTCGO',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-xl border border-gold/15 bg-card-white/70 px-4 py-2.5"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
                <span className="text-sm font-medium text-[rgb(var(--text-primary))]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-[rgb(var(--text-muted))]">
            In the meantime, try building a deck manually
          </p>
          <Link
            href="/deck-builder"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-seeker to-seeker-dark px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Open Deck Builder
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
