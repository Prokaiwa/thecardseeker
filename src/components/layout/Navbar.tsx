'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Search } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cards', label: 'Cards' },
  { href: '/deck-builder', label: 'Deck Builder' },
  { href: '/meta', label: 'Meta' },
  { href: '/ai-generator', label: 'AI Generator' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-gold/20 bg-card-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-seeker to-seeker-dark shadow-md">
            <Search className="h-4 w-4 text-white" />
          </div>
          <span className="text-[rgb(var(--text-primary))]">The Card Seeker</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-gold/10 text-[rgb(var(--text-primary))]'
                    : 'text-[rgb(var(--text-secondary))] hover:bg-gold/5 hover:text-[rgb(var(--text-primary))]'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5 hover:text-[rgb(var(--text-primary))]">
            <User className="h-3.5 w-3.5" />
            Log in
          </button>
          <button className="h-8 rounded-lg bg-gradient-to-b from-seeker to-seeker-dark px-4 text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90">
            Sign Up
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 -mr-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-[rgb(var(--text-primary))]" />
          ) : (
            <Menu className="h-5 w-5 text-[rgb(var(--text-primary))]" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gold/20 bg-card-white/95 p-4 space-y-0.5 md:hidden">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gold/10 text-[rgb(var(--text-primary))]'
                    : 'text-[rgb(var(--text-secondary))]'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="flex gap-2 pt-3">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold/30 py-2 text-[13px] font-medium text-[rgb(var(--text-secondary))]">
              <User className="h-3.5 w-3.5" />
              Log in
            </button>
            <button className="flex-1 rounded-lg bg-gradient-to-b from-seeker to-seeker-dark py-2 text-[13px] font-medium text-white">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
