'use client';

import { useState, useEffect, useTransition } from 'react';
import { TrendingUp, Users, DollarSign, Loader2, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useEsubi } from '@/components/esubi';
import { getTopDecks } from '@/lib/ingestion';
import type { DeckUsageStats } from '@/lib/ingestion';

const FORMATS = ['STANDARD', 'EXPANDED'] as const;
type Format = (typeof FORMATS)[number];

const tierLabel = (winRate: number) => {
  if (winRate >= 60) return 'S';
  if (winRate >= 55) return 'A';
  if (winRate >= 50) return 'B';
  return 'C';
};

const tierColors: Record<string, string> = {
  S: 'bg-gold/20 text-gold border border-gold/40',
  A: 'bg-seeker/10 text-seeker border border-seeker/30',
  B: 'bg-[rgb(var(--text-muted))]/10 text-[rgb(var(--text-secondary))] border border-[rgb(var(--text-muted))]/20',
  C: 'bg-card-grey/50 text-[rgb(var(--text-muted))] border border-card-grey',
};

export default function MetaPage() {
  const { search: esubiSearch, reset: esubiReset, error: esubiError } = useEsubi();
  const [format, setFormat] = useState<Format>('STANDARD');
  const [decks, setDecks] = useState<DeckUsageStats[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  const loadDecks = (f: Format) => {
    esubiSearch();
    startTransition(async () => {
      const result = await getTopDecks({ format: f });
      if (result.error) {
        esubiError('Could not load meta decks.');
        setDecks([]);
      } else {
        setDecks(result.data ?? []);
        esubiReset();
      }
      setLoaded(true);
    });
  };

  useEffect(() => {
    loadDecks(format);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormatChange = (f: Format) => {
    setFormat(f);
    loadDecks(f);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
              Metagame
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
              Meta Decks
            </h1>
            <p className="mt-1 text-[15px] text-[rgb(var(--text-muted))]">
              Top performing decks from recent tournaments
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="flex rounded-xl border border-gold/20 bg-card-white/85 p-1">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFormatChange(f)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    format === f
                      ? 'bg-gold text-white shadow-sm'
                      : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  {f === 'STANDARD' ? 'Standard' : 'Expanded'}
                </button>
              ))}
            </div>
            <button
              onClick={() => loadDecks(format)}
              disabled={isPending}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/20 bg-card-white/85 text-[rgb(var(--text-secondary))] transition-colors hover:border-gold/40 disabled:opacity-40"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-sm text-[rgb(var(--text-muted))]">Loading tournament data…</p>
          </div>
        )}

        {/* Empty after load */}
        {!isPending && loaded && decks.length === 0 && (
          <div className="rounded-2xl border border-gold/20 bg-card-white/85 py-24 text-center">
            <TrendingUp className="mx-auto mb-4 h-12 w-12 text-gold/30" />
            <p className="text-base font-semibold text-[rgb(var(--text-primary))]">
              No meta data available
            </p>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              Tournament data may not be available right now. Try again later.
            </p>
          </div>
        )}

        {/* Deck grid */}
        {!isPending && decks.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck, i) => {
              const tier = tierLabel(deck.winRate ?? 0);
              return (
                <div
                  key={`${deck.deckId}-${i}`}
                  className="cursor-pointer rounded-2xl border border-gold/20 bg-card-white/85 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-[15px] font-bold text-[rgb(var(--text-primary))]">
                        {deck.deckName}
                      </h3>
                      <p className="mt-0.5 text-[12px] text-[rgb(var(--text-muted))]">
                        {deck.count} tournament{deck.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold ${tierColors[tier]}`}
                    >
                      Tier {tier}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-[12px] text-[rgb(var(--text-muted))]">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-gold" />
                      <span className="font-semibold text-[rgb(var(--text-secondary))]">
                        {(deck.winRate * 100).toFixed(1)}%
                      </span>{' '}
                      WR
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {deck.topCutCount} top cuts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
