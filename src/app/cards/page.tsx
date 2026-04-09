'use client';

import { useState, useCallback, useTransition, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import CardTile from '@/components/cards/CardTile';
import CardDetailModal from '@/components/cards/CardDetailModal';
import Navbar from '@/components/layout/Navbar';
import { useEsubi } from '@/components/esubi';
import { searchCards, fetchCard, fetchSet } from '@/lib/ingestion';
import type { TcgdexCardBrief, TcgdexCard } from '@/lib/ingestion';

const CATEGORIES = ['Pokemon', 'Trainer', 'Energy'] as const;
const TYPES = [
  'Fire', 'Water', 'Grass', 'Lightning', 'Psychic',
  'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless',
] as const;

// Featured set shown on initial load (Prismatic Evolutions)
const FEATURED_SET = 'sv08.5';

type Category = (typeof CATEGORIES)[number];
type EnergyType = (typeof TYPES)[number];

export default function CardBrowserPage() {
  const { search: esubiSearch, reset: esubiIdle, confused: esubiConfused } = useEsubi();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EnergyType | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<TcgdexCardBrief[]>([]);
  const [featuredLabel, setFeaturedLabel] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<TcgdexCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Typeahead state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load featured set on mount
  useEffect(() => {
    esubiSearch();
    fetchSet(FEATURED_SET).then((result) => {
      if (result.data?.cards && result.data.cards.length > 0) {
        setCards(result.data.cards);
        setFeaturedLabel(result.data.name ?? 'Featured Cards');
      }
      esubiIdle();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typeahead: debounced suggestions when typing ≥2 chars
  useEffect(() => {
    if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestDebounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      const result = await searchCards({ name: query.trim() });
      setLoadingSuggestions(false);

      if (result.data && result.data.length > 0) {
        // Deduplicate by name, take first 8 unique names
        const seen = new Set<string>();
        const unique: string[] = [];
        for (const card of result.data) {
          if (!seen.has(card.name) && unique.length < 8) {
            seen.add(card.name);
            unique.push(card.name);
          }
        }
        setSuggestions(unique);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 280);

    return () => {
      if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearFilters = () => {
    setTypeFilter('');
    setCategoryFilter('');
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const hasFilters = typeFilter || categoryFilter || query;

  const doSearch = useCallback(
    (overrideQuery?: string, overrideType?: EnergyType | '', overrideCategory?: Category | '') => {
      const q = overrideQuery ?? query;
      const t = overrideType ?? typeFilter;
      const cat = overrideCategory ?? categoryFilter;

      setShowSuggestions(false);
      setSuggestions([]);
      esubiSearch();

      startTransition(async () => {
        setError(null);
        setFeaturedLabel('');
        const params: Record<string, string> = {};
        if (q.trim()) params.name = q.trim();
        if (t) params.types = t;
        if (cat) params.category = cat;

        const result = await searchCards(params);

        if (result.error) {
          setError('Could not load cards. Please try again.');
          esubiConfused();
          setCards([]);
        } else {
          setCards(result.data ?? []);
          esubiIdle();
        }
        setHasSearched(true);
      });
    },
    [query, typeFilter, categoryFilter, esubiSearch, esubiIdle, esubiConfused]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    setSuggestions([]);
    doSearch(name);
  };

  const openCardDetail = async (card: TcgdexCardBrief) => {
    setLoadingDetail(true);
    const result = await fetchCard(card.id);
    setLoadingDetail(false);
    if (result.data) {
      setSelectedCard(result.data);
    }
  };

  const isInitialLoad = !hasSearched && !isPending && !error;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
              Explore
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
              Card Browser
            </h1>
            {(hasSearched || isInitialLoad) && cards.length > 0 && (
              <p className="mt-1 text-[15px] text-[rgb(var(--text-muted))]">
                {featuredLabel
                  ? `${featuredLabel} — ${cards.length} cards`
                  : `${cards.length} card${cards.length !== 1 ? 's' : ''} found`}
              </p>
            )}
          </div>

          {/* Search bar */}
          <div className="flex w-full items-center gap-2.5 md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search Pokémon, Trainer, Energy…"
                className="w-full rounded-xl border border-gold/20 bg-card-white/85 py-2 pl-10 pr-4 text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/10"
                autoComplete="off"
              />
              {/* Typeahead dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gold/20 bg-card-white shadow-lg backdrop-blur-xl"
                >
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(name);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[rgb(var(--text-primary))] transition-colors hover:bg-gold/10"
                    >
                      <Search className="h-3.5 w-3.5 shrink-0 text-[rgb(var(--text-muted))]" />
                      <span>
                        <span className="font-medium text-gold">
                          {name.slice(0, query.length)}
                        </span>
                        {name.slice(query.length)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {/* Suggestions loading indicator */}
              {loadingSuggestions && query.trim().length >= 2 && (
                <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[rgb(var(--text-muted))]" />
              )}
            </div>
            <button
              onClick={() => doSearch()}
              disabled={isPending}
              className="h-9 rounded-xl bg-gradient-to-b from-seeker to-seeker-dark px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 w-9 shrink-0 rounded-xl border transition-colors ${
                showFilters
                  ? 'border-gold/50 bg-gold/10 text-gold'
                  : 'border-gold/20 bg-card-white/85 text-[rgb(var(--text-secondary))] hover:border-gold/40'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="mx-auto h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-gold/20 bg-card-white/85 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                Filters
              </h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-seeker hover:underline"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value as EnergyType | '');
                  }}
                  className="w-full rounded-xl border border-gold/20 bg-card-white px-3 py-2 text-sm text-[rgb(var(--text-primary))] focus:border-gold/40 focus:outline-none"
                >
                  <option value="">All Types</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value as Category | '');
                  }}
                  className="w-full rounded-xl border border-gold/20 bg-card-white px-3 py-2 text-sm text-[rgb(var(--text-primary))] focus:border-gold/40 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => doSearch()}
                disabled={isPending}
                className="rounded-xl bg-gradient-to-b from-gold to-gold-dark px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-sm text-[rgb(var(--text-muted))]">Searching cards…</p>
          </div>
        )}

        {/* Error state */}
        {error && !isPending && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-6 py-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => doSearch()}
              className="mt-3 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* No results */}
        {!isPending && !error && hasSearched && cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <X className="h-10 w-10 text-[rgb(var(--text-muted))]/40" />
            <p className="text-base font-semibold text-[rgb(var(--text-primary))]">
              No cards found
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 rounded-xl border border-gold/30 px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Card grid */}
        {!isPending && cards.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {cards.map((card) => (
              <CardTile
                key={card.id}
                card={card}
                onClick={() => openCardDetail(card)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Loading detail overlay */}
      {loadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgb(var(--text-primary))]/20 backdrop-blur-sm">
          <div className="rounded-2xl border border-gold/30 bg-card-white/95 p-8 shadow-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
            <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">Loading card…</p>
          </div>
        </div>
      )}

      {/* Card detail modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
