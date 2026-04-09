import { LayoutDashboard, Plus, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
            Your Space
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
            Dashboard
          </h1>
          <p className="mt-1 text-[15px] text-[rgb(var(--text-muted))]">
            Manage your decks and track your collection
          </p>
        </div>

        {/* Auth placeholder */}
        <div className="mb-8 rounded-2xl border border-gold/30 bg-gold/5 px-6 py-8 text-center">
          <LayoutDashboard className="mx-auto mb-4 h-10 w-10 text-gold/50" />
          <h2 className="font-display text-xl font-bold text-[rgb(var(--text-primary))]">
            Sign in to access your dashboard
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
            Save decks, track your collection, and sync across devices.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="rounded-xl bg-gradient-to-b from-gold to-gold-dark px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              Create Account
            </button>
            <button className="rounded-xl border border-gold/30 px-6 py-2.5 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5">
              Log In
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Plus,
              label: 'Build a Deck',
              desc: 'Start a new deck from scratch',
              href: '/deck-builder',
              accent: 'text-seeker',
            },
            {
              icon: BookOpen,
              label: 'Browse Cards',
              desc: 'Search the full card database',
              href: '/cards',
              accent: 'text-gold',
            },
            {
              icon: TrendingUp,
              label: 'View Meta',
              desc: 'See top tournament decks',
              href: '/meta',
              accent: 'text-pokemon-grass',
            },
          ].map(({ icon: Icon, label, desc, href, accent }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-gold/20 bg-card-white/85 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
            >
              <Icon className={`mb-3 h-6 w-6 ${accent}`} />
              <h3 className="font-display font-bold text-[rgb(var(--text-primary))]">{label}</h3>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
