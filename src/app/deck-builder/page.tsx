'use client';

import { useState, useMemo, useTransition, useCallback } from 'react';
import {
  Search, Loader2, Minus, Plus, Layers, Zap, Leaf, ShoppingCart, Download
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CardTile from '@/components/cards/CardTile';
import CardDetailModal from '@/components/cards/CardDetailModal';
import { useEsubi } from '@/components/esubi';
import { searchCards, fetchCard } from '@/lib/ingestion';
import type { TcgdexCardBrief, TcgdexCard } from '@/lib/ingestion';

interface DeckEntry {
  card: TcgdexCard;
  count: number;
}

export default function DeckBuilderPage() {
  const { search: esubiSearch, celebrate, reset: esubiReset, confused } = useEsubi();

  const [deckName, setDeckName] = useState('My New Deck');
  const [format, setFormat] = useState<'Standard' | 'Expanded'>('Standard');
  const [deck, setDeck] = useState<DeckEntry[]>([]);

  // Card search state
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TcgdexCardBrief[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Card detail state
  const [selectedCard, setSelectedCard] = useState<TcgdexCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const totalCards = useMemo(() => deck.reduce((s, d) => s + d.count, 0), [deck]);

  const grouped = useMemo(() => ({
    pokemon: deck.filter((d) => d.card.category === 'Pokemon'),
    trainers: deck.filter((d) => d.card.category === 'Trainer'),
    energy: deck.filter((d) => d.card.category === 'Energy'),
  }), [deck]);

  const pokemonCount = grouped.pokemon.reduce((s, d) => s + d.count, 0);
  const trainerCount = grouped.trainers.reduce((s, d) => s + d.count, 0);
  const energyCount = grouped.energy.reduce((s, d) => s + d.count, 0);

  const doSearch = useCallback(() => {
    if (!query.trim()) return;
    esubiSearch();
    startTransition(async () => {
      const result = await searchCards({ name: query.trim() });
      if (result.data) {
        setSearchResults(result.data);
        esubiReset();
      } else {
        confused();
        setSearchResults([]);
      }
      setHasSearched(true);
    });
  }, [query, esubiSearch, esubiReset, confused]);

  const addCardToDeck = async (brief: TcgdexCardBrief) => {
    // Check if already in deck
    const existing = deck.find((d) => d.card.id === brief.id);
    if (existing) {
      if (existing.count >= 4 && existing.card.category !== 'Energy') return;
      if (totalCards >= 60) return;
      setDeck((prev) =>
        prev.map((d) => d.card.id === brief.id ? { ...d, count: d.count + 1 } : d)
      );
      if (totalCards + 1 === 60) celebrate();
      return;
    }

    // Need to fetch full card first
    const result = await fetchCard(brief.id);
    if (!result.data) return;
    if (totalCards >= 60) return;

    setDeck((prev) => [...prev, { card: result.data!, count: 1 }]);
    if (totalCards + 1 === 60) celebrate();
  };

  const removeCard = (cardId: string) => {
    setDeck((prev) =>
      prev
        .map((d) => d.card.id === cardId ? { ...d, count: d.count - 1 } : d)
        .filter((d) => d.count > 0)
    );
  };

  const openDetail = async (brief: TcgdexCardBrief) => {
    setLoadingDetail(true);
    const result = await fetchCard(brief.id);
    setLoadingDetail(false);
    if (result.data) setSelectedCard(result.data);
  };

  const exportDeck = () => {
    const lines = deck.flatMap((d) => {
      const setCode = d.card.set?.id ?? 'UNK';
      return [`${d.count} ${d.card.name} ${setCode} ${d.card.localId}`];
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isValidDeck = totalCards === 60;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Deck header bar */}
        <div className="mb-6 flex flex-col items-start gap-4 rounded-2xl border border-gold/20 bg-card-white/85 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
          <input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="min-w-0 flex-1 bg-transparent font-display text-lg font-bold text-[rgb(var(--text-primary))] focus:outline-none"
            aria-label="Deck name"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'Standard' | 'Expanded')}
              className="rounded-lg border border-gold/20 bg-card-white px-3 py-1.5 text-[13px] font-medium text-[rgb(var(--text-primary))] focus:outline-none"
            >
              <option>Standard</option>
              <option>Expanded</option>
            </select>

            {/* Counts */}
            <div className="flex items-center gap-3 text-[12px] font-medium text-[rgb(var(--text-muted))]">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-seeker" />
                <span className={totalCards === 60 ? 'text-green-600 font-bold' : ''}>
                  {totalCards}/60
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-pokemon-grass" />
                {pokemonCount}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingCart className="h-3.5 w-3.5 text-gold" />
                {trainerCount}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-pokemon-electric" />
                {energyCount}
              </span>
            </div>

            {deck.length > 0 && (
              <button
                onClick={exportDeck}
                className="flex items-center gap-1.5 rounded-lg border border-gold/30 px-3 py-1.5 text-[13px] font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: Card search */}
          <div className="space-y-4 lg:col-span-3">
            <div className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="Search cards to add…"
                  className="w-full rounded-xl border border-gold/20 bg-card-white/85 py-2 pl-10 pr-4 text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] focus:border-gold/40 focus:outline-none"
                />
              </div>
              <button
                onClick={doSearch}
                disabled={isPending || !query.trim()}
                className="h-9 rounded-xl bg-gradient-to-b from-seeker to-seeker-dark px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </button>
            </div>

            {/* Search results */}
            {isPending && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </div>
            )}

            {!isPending && hasSearched && searchResults.length === 0 && (
              <p className="py-8 text-center text-sm text-[rgb(var(--text-muted))]">
                No cards found. Try a different search.
              </p>
            )}

            {!isPending && searchResults.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {searchResults.map((card) => (
                  <CardTile
                    key={card.id}
                    card={card}
                    size="sm"
                    onClick={() => openDetail(card)}
                    onAdd={() => addCardToDeck(card)}
                  />
                ))}
              </div>
            )}

            {!hasSearched && !isPending && (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[rgb(var(--text-muted))]">
                <Search className="mb-3 h-10 w-10 opacity-20" />
                <p className="text-sm">Search for cards to add to your deck</p>
              </div>
            )}
          </div>

          {/* Right: Deck list */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-[rgb(var(--text-primary))]">
                  Deck List
                </h2>
                {isValidDeck && (
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    Ready
                  </span>
                )}
              </div>

              {deck.length === 0 ? (
                <p className="py-8 text-center text-xs text-[rgb(var(--text-muted))]">
                  Add cards from the search panel
                </p>
              ) : (
                <div className="space-y-3">
                  {(['Pokemon', 'Trainer', 'Energy'] as const).map((cat) => {
                    const group = cat === 'Pokemon' ? grouped.pokemon : cat === 'Trainer' ? grouped.trainers : grouped.energy;
                    if (group.length === 0) return null;
                    const count = group.reduce((s, d) => s + d.count, 0);
                    return (
                      <div key={cat}>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                          {cat} ({count})
                        </p>
                        <div className="space-y-1">
                          {group.map(({ card, count: c }) => (
                            <div
                              key={card.id}
                              className="group flex items-center gap-2.5 rounded-lg bg-card-cream/50 px-3 py-1.5 hover:bg-card-cream"
                            >
                              <span className="flex-1 truncate text-[13px] font-medium text-[rgb(var(--text-primary))]">
                                {card.name}
                              </span>
                              <span className="font-mono text-[11px] font-semibold text-[rgb(var(--text-muted))]">
                                ×{c}
                              </span>
                              <button
                                onClick={() => removeCard(card.id)}
                                className="opacity-0 transition-opacity group-hover:opacity-100 rounded-md p-0.5 text-[rgb(var(--text-muted))] hover:text-red-500"
                                aria-label={`Remove ${card.name}`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Loading detail */}
      {loadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgb(var(--text-primary))]/20 backdrop-blur-sm">
          <div className="rounded-2xl border border-gold/30 bg-card-white/95 p-8 shadow-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
          </div>
        </div>
      )}

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAdd={() => {
            addCardToDeck({ id: selectedCard.id, localId: selectedCard.localId, name: selectedCard.name, image: selectedCard.image });
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
