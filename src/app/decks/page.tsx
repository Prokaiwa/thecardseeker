import Link from 'next/link';
import { Plus, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function DecksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
              Your Decks
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
              Deck Library
            </h1>
            <p className="mt-1 text-[15px] text-[rgb(var(--text-muted))]">
              All your saved decks in one place
            </p>
          </div>
          <Link
            href="/deck-builder"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Deck
          </Link>
        </div>

        {/* Sign-in placeholder */}
        <div className="rounded-2xl border border-gold/20 bg-card-white/85 py-20 text-center backdrop-blur-sm">
          <TrendingUp className="mx-auto mb-4 h-12 w-12 text-gold/30" />
          <h2 className="font-display text-xl font-bold text-[rgb(var(--text-primary))]">
            Sign in to save decks
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
            Create an account to save, share, and track your decks.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="rounded-xl bg-gradient-to-b from-gold to-gold-dark px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              Create Account
            </button>
            <Link
              href="/meta"
              className="flex items-center gap-1.5 rounded-xl border border-gold/30 px-6 py-2.5 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5"
            >
              Browse Meta Decks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
