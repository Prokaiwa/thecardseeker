'use client';

import { useState, useCallback, useTransition, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, Loader2, LayoutGrid, List, Table2 } from 'lucide-react';
import Image from 'next/image';
import CardTile from '@/components/cards/CardTile';
import CardDetailModal from '@/components/cards/CardDetailModal';
import Navbar from '@/components/layout/Navbar';
import { useEsubi } from '@/components/esubi';
import { searchCards, fetchCard, fetchSet, fetchAllSets, getSetLogoUrl } from '@/lib/ingestion';
import type { TcgdexCardBrief, TcgdexCard, TcgdexSetBrief } from '@/lib/ingestion';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPES = [
  'Fire','Water','Grass','Lightning','Psychic',
  'Fighting','Darkness','Metal','Fairy','Dragon','Colorless',
] as const;

const STAGES = [
  'Basic','Stage1','Stage2','V','VMAX','VSTAR','ex',
  'GX','EX','Mega','BREAK','Ancient','Future','Radiant',
] as const;

const RARITIES = [
  'Common','Uncommon','Rare','Double Rare','Ace Spec Rare',
  'Illustration Rare','Special Illustration Rare','Ultra Rare',
  'Hyper Rare','Art Rare','Shiny Rare','Shiny Ultra Rare',
  'Crown Rare','Amazing Rare','Promo',
] as const;

const REG_MARKS = ['A','B','C','D','E','F','G','H'] as const;

type ViewMode = 'grid' | 'list' | 'table';
type PageSize = 20 | 50 | 100 | 'all';

interface Filters {
  name: string;
  setId: string;
  category: '' | 'Pokemon' | 'Trainer' | 'Energy';
  types: string;
  stage: string;
  rarity: string;
  illustrator: string;
  weakness: string;
  resistance: string;
  regulationMark: string;
}

const EMPTY_FILTERS: Filters = {
  name: '', setId: '', category: '', types: '', stage: '',
  rarity: '', illustrator: '', weakness: '', resistance: '', regulationMark: '',
};

// ─── Set ordering helpers ─────────────────────────────────────────────────────

// Era priority: index 0 = most recent era. Higher score = newer set.
const ERA_ORDER = ['sv','swsh','sm','xy','bw','hgss','dp','ex','rs','base'] as const;

function setRecencyScore(setId: string): number {
  const id = setId.toLowerCase();
  const eraIdx = ERA_ORDER.findIndex((e) => id.startsWith(e));
  const eraPriority = eraIdx === -1 ? -1 : ERA_ORDER.length - eraIdx; // higher = newer
  const numMatch = id.match(/(\d+(?:\.\d+)?)/);
  const num = numMatch ? parseFloat(numMatch[1]) : 0;
  return eraPriority * 1000 + num;
}

function sortSetsByRecency(sets: TcgdexSetBrief[]): TcgdexSetBrief[] {
  return [...sets].sort((a, b) => {
    // Use direct string comparison (works for both YYYY-MM-DD and YYYY/MM/DD)
    if (a.releaseDate && b.releaseDate) {
      if (b.releaseDate > a.releaseDate) return 1;
      if (b.releaseDate < a.releaseDate) return -1;
      return 0;
    }
    if (a.releaseDate) return -1;
    if (b.releaseDate) return 1;
    return setRecencyScore(b.id) - setRecencyScore(a.id);
  });
}

function getSetIdFromCardId(cardId: string): string {
  const idx = cardId.lastIndexOf('-');
  return idx > 0 ? cardId.slice(0, idx) : cardId;
}

function sortCardsByRelease(
  cards: TcgdexCardBrief[],
  dateMap: Record<string, string>,
): TcgdexCardBrief[] {
  return [...cards].sort((a, b) => {
    const aId = getSetIdFromCardId(a.id);
    const bId = getSetIdFromCardId(b.id);
    const aDate = dateMap[aId];
    const bDate = dateMap[bId];
    if (aDate && bDate) {
      if (bDate > aDate) return 1;
      if (bDate < aDate) return -1;
      return 0;
    }
    if (aDate) return -1;
    if (bDate) return 1;
    return setRecencyScore(bId) - setRecencyScore(aId);
  });
}

// ─── Type badge (small, for list/table rows) ──────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Fire: '#E8503A', Water: '#4A90D9', Grass: '#5BAD5B',
  Lightning: '#F5C518', Psychic: '#B86CE8', Fighting: '#C95F2E',
  Darkness: '#3A3A3A', Metal: '#9099A1', Fairy: '#E87DBE',
  Dragon: '#7038F8', Colorless: '#B8B8A8',
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
      style={{ background: TYPE_COLORS[type] ?? '#9099A1' }}
    >
      {type}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CardBrowserPage() {
  const { search: esubiSearch, reset: esubiIdle, confused: esubiConfused } = useEsubi();

  // Search & filter
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Results
  const [allCards, setAllCards] = useState<TcgdexCardBrief[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Featured set header
  const [featuredLabel, setFeaturedLabel] = useState('');
  const [featuredLogoUrl, setFeaturedLogoUrl] = useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<TcgdexCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Set data for sorting + filter dropdown
  const [allSets, setAllSets] = useState<TcgdexSetBrief[]>([]); // sorted newest first
  const [setDateMap, setSetDateMap] = useState<Record<string, string>>({});
  const [setNameMap, setSetNameMap] = useState<Record<string, string>>({});

  // Typeahead
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(allCards.length / (pageSize as number));
  const startIdx = pageSize === 'all' ? 0 : (currentPage - 1) * (pageSize as number);
  const displayedCards = pageSize === 'all'
    ? allCards
    : allCards.slice(startIdx, startIdx + (pageSize as number));
  const hasActiveFilters = Object.values(filters).some(Boolean);

  // ── On mount: fetch all sets, build maps, load most recent ─────────────────
  useEffect(() => {
    esubiSearch();
    fetchAllSets().then((res) => {
      if (!res.data?.length) { esubiIdle(); return; }

      const sorted = sortSetsByRecency(res.data);
      setAllSets(sorted);

      const dateMap: Record<string, string> = {};
      const nameMap: Record<string, string> = {};
      for (const s of res.data) {
        if (s.releaseDate) dateMap[s.id] = s.releaseDate;
        nameMap[s.id] = s.name;
      }
      setSetDateMap(dateMap);
      setSetNameMap(nameMap);

      const newest = sorted[0];
      const logoUrl = newest.logo
        ? newest.logo + '.webp'
        : getSetLogoUrl(newest.id) + '.webp';
      setFeaturedLogoUrl(logoUrl);

      fetchSet(newest.id).then((setRes) => {
        if (setRes.data?.cards?.length) {
          setAllCards(sortCardsByRelease(setRes.data.cards, dateMap));
          setFeaturedLabel(setRes.data.name ?? newest.name);
        }
        esubiIdle();
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Typeahead ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);
    if (filters.name.trim().length < 2) {
      setSuggestions([]); setShowSuggestions(false); return;
    }
    suggestDebounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      const res = await searchCards({ name: filters.name.trim() });
      setLoadingSuggestions(false);
      if (res.data?.length) {
        const sorted = sortCardsByRelease(res.data, setDateMap);
        const seen = new Set<string>();
        const unique: string[] = [];
        for (const c of sorted) {
          if (!seen.has(c.name) && unique.length < 8) { seen.add(c.name); unique.push(c.name); }
        }
        setSuggestions(unique); setShowSuggestions(true);
      } else {
        setSuggestions([]); setShowSuggestions(false);
      }
    }, 280);
    return () => { if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current); };
  }, [filters.name, setDateMap]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Search ──────────────────────────────────────────────────────────────────
  const doSearch = useCallback((overrideName?: string) => {
    const f = overrideName !== undefined ? { ...filters, name: overrideName } : filters;
    setShowSuggestions(false); setSuggestions([]);
    esubiSearch();
    startTransition(async () => {
      setError(null); setFeaturedLabel(''); setFeaturedLogoUrl(null);
      const params: Record<string, string> = {};
      if (f.name.trim()) params.name = f.name.trim();
      if (f.category) params.category = f.category;
      if (f.types) params.types = f.types;
      if (f.stage) params.stage = f.stage;
      if (f.rarity) params.rarity = f.rarity;
      if (f.illustrator.trim()) params.illustrator = f.illustrator.trim();
      if (f.weakness) params.weakness = f.weakness;
      if (f.resistance) params.resistance = f.resistance;
      if (f.regulationMark) params.regulationMark = f.regulationMark;
      if (f.setId) params.set = f.setId;

      const res = await searchCards(params);
      if (res.error) {
        setError('Could not load cards. Please try again.');
        esubiConfused(); setAllCards([]);
      } else {
        setAllCards(sortCardsByRelease(res.data ?? [], setDateMap));
        setCurrentPage(1);
        esubiIdle();
      }
      setHasSearched(true);
    });
  }, [filters, setDateMap, esubiSearch, esubiIdle, esubiConfused]);

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSuggestions([]); setShowSuggestions(false);
  };

  const openCardDetail = async (card: TcgdexCardBrief) => {
    setLoadingDetail(true);
    const res = await fetchCard(card.id);
    setLoadingDetail(false);
    if (res.data) setSelectedCard(res.data);
  };

  const isInitialLoad = !hasSearched && !isPending && !error;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">Explore</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
              Card Browser
            </h1>
            {(hasSearched || isInitialLoad) && allCards.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {featuredLogoUrl && (
                  <Image
                    src={featuredLogoUrl} alt={featuredLabel}
                    width={160} height={44}
                    className="object-contain object-left" unoptimized
                  />
                )}
                <p className="text-[15px] text-[rgb(var(--text-muted))]">
                  {featuredLabel
                    ? `${featuredLabel} — ${allCards.length} cards`
                    : `${allCards.length} card${allCards.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
            )}
          </div>

          {/* Search bar row */}
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
              <input
                ref={inputRef}
                value={filters.name}
                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSearch();
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search Pokémon, Trainer, Energy…"
                className="w-full rounded-xl border border-gold/20 bg-card-white/85 py-2 pl-10 pr-4 text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/10"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gold/20 bg-card-white shadow-lg backdrop-blur-xl"
                >
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      onMouseDown={(e) => { e.preventDefault(); setFilters((f) => ({ ...f, name })); doSearch(name); setShowSuggestions(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[rgb(var(--text-primary))] transition-colors hover:bg-gold/10"
                    >
                      <Search className="h-3.5 w-3.5 shrink-0 text-[rgb(var(--text-muted))]" />
                      <span>
                        <span className="font-medium text-gold">{name.slice(0, filters.name.length)}</span>
                        {name.slice(filters.name.length)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {loadingSuggestions && filters.name.trim().length >= 2 && (
                <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[rgb(var(--text-muted))]" />
              )}
            </div>

            <button
              onClick={() => doSearch()} disabled={isPending}
              className="h-9 rounded-xl bg-gradient-to-b from-seeker to-seeker-dark px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative h-9 w-9 shrink-0 rounded-xl border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'border-gold/50 bg-gold/10 text-gold'
                  : 'border-gold/20 bg-card-white/85 text-[rgb(var(--text-secondary))] hover:border-gold/40'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="mx-auto h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-seeker" />
              )}
            </button>
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-[rgb(var(--text-primary))]">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-seeker hover:underline">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Set */}
              <div className="xl:col-span-2">
                <label className="filter-label">Set</label>
                <select
                  value={filters.setId}
                  onChange={(e) => setFilters((f) => ({ ...f, setId: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">All Sets</option>
                  {allSets.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Supertype */}
              <div>
                <label className="filter-label">Supertype</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as Filters['category'] }))}
                  className="filter-input"
                >
                  <option value="">All</option>
                  <option value="Pokemon">Pokémon</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="filter-label">Type</label>
                <select
                  value={filters.types}
                  onChange={(e) => setFilters((f) => ({ ...f, types: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">All Types</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Stage / Subtype */}
              <div>
                <label className="filter-label">Stage / Subtype</label>
                <select
                  value={filters.stage}
                  onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">All Stages</option>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Rarity */}
              <div>
                <label className="filter-label">Rarity</label>
                <select
                  value={filters.rarity}
                  onChange={(e) => setFilters((f) => ({ ...f, rarity: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">All Rarities</option>
                  {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Weakness */}
              <div>
                <label className="filter-label">Weakness</label>
                <select
                  value={filters.weakness}
                  onChange={(e) => setFilters((f) => ({ ...f, weakness: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">Any</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Resistance */}
              <div>
                <label className="filter-label">Resistance</label>
                <select
                  value={filters.resistance}
                  onChange={(e) => setFilters((f) => ({ ...f, resistance: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">Any</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Artist */}
              <div>
                <label className="filter-label">Artist</label>
                <input
                  type="text"
                  value={filters.illustrator}
                  onChange={(e) => setFilters((f) => ({ ...f, illustrator: e.target.value }))}
                  placeholder="e.g. 5ban Graphics"
                  className="filter-input"
                />
              </div>

              {/* Regulation Mark */}
              <div>
                <label className="filter-label">Regulation Mark</label>
                <select
                  value={filters.regulationMark}
                  onChange={(e) => setFilters((f) => ({ ...f, regulationMark: e.target.value }))}
                  className="filter-input"
                >
                  <option value="">Any</option>
                  {REG_MARKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => doSearch()} disabled={isPending}
                className="rounded-xl bg-gradient-to-b from-gold to-gold-dark px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => { clearFilters(); }}
                  className="text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-sm text-[rgb(var(--text-muted))]">Searching cards…</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !isPending && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-6 py-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button onClick={() => doSearch()} className="mt-3 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Try again
            </button>
          </div>
        )}

        {/* ── No results ── */}
        {!isPending && !error && hasSearched && allCards.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <X className="h-10 w-10 text-[rgb(var(--text-muted))]/40" />
            <p className="text-base font-semibold text-[rgb(var(--text-primary))]">No cards found</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="mt-2 rounded-xl border border-gold/30 px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] hover:bg-gold/5">
              Clear filters
            </button>
          </div>
        )}

        {/* ── Results ── */}
        {!isPending && allCards.length > 0 && (
          <>
            {/* Controls bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Left: count + view mode */}
              <div className="flex items-center gap-3">
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  Showing{' '}
                  <span className="font-medium text-[rgb(var(--text-primary))]">{displayedCards.length}</span>
                  {' '}of{' '}
                  <span className="font-medium text-[rgb(var(--text-primary))]">{allCards.length}</span>
                </p>
                {/* View mode */}
                <div className="flex items-center gap-1 rounded-xl border border-gold/20 bg-card-white/85 p-1">
                  {([
                    { mode: 'grid' as ViewMode, Icon: LayoutGrid, label: 'Grid view' },
                    { mode: 'list' as ViewMode, Icon: List,       label: 'List view' },
                    { mode: 'table' as ViewMode, Icon: Table2,     label: 'Table view' },
                  ]).map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      title={label}
                      className={`rounded-lg p-1.5 transition-colors ${
                        viewMode === mode
                          ? 'bg-gold text-white shadow-sm'
                          : 'text-[rgb(var(--text-secondary))] hover:text-gold'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: page size */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Show</span>
                {([20, 50, 100, 'all'] as PageSize[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => { setPageSize(n); setCurrentPage(1); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      pageSize === n
                        ? 'bg-gold text-white shadow-sm'
                        : 'border border-gold/20 bg-card-white/85 text-[rgb(var(--text-secondary))] hover:border-gold/40'
                    }`}
                  >
                    {n === 'all' ? 'All' : n}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Grid view ── */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {displayedCards.map((card) => (
                  <CardTile
                    key={card.id} card={card}
                    setName={setNameMap[getSetIdFromCardId(card.id)]}
                    onClick={() => openCardDetail(card)}
                  />
                ))}
              </div>
            )}

            {/* ── List view ── */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-2">
                {displayedCards.map((card) => {
                  const imageUrl = card.image ? `${card.image}/low.webp` : null;
                  const setName = setNameMap[getSetIdFromCardId(card.id)];
                  return (
                    <button
                      key={card.id}
                      onClick={() => openCardDetail(card)}
                      className="flex items-center gap-4 rounded-xl border border-gold/15 bg-card-white/85 px-4 py-3 text-left transition-all hover:border-gold/40 hover:shadow-md hover:shadow-gold/5"
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-card-cream">
                        {imageUrl && (
                          <Image src={imageUrl} alt={card.name} fill className="object-cover" sizes="40px" unoptimized />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold text-sm text-[rgb(var(--text-primary))]">{card.name}</p>
                        <p className="text-[11px] text-[rgb(var(--text-muted))]">
                          {setName ?? '—'} · #{card.localId}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-[rgb(var(--text-muted))] shrink-0">
                        {card.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Table view ── */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto rounded-2xl border border-gold/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/20 bg-card-white/85">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Card</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Name</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Set</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]]">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCards.map((card, i) => {
                      const imageUrl = card.image ? `${card.image}/low.webp` : null;
                      const setName = setNameMap[getSetIdFromCardId(card.id)];
                      return (
                        <tr
                          key={card.id}
                          onClick={() => openCardDetail(card)}
                          className={`cursor-pointer border-b border-gold/10 transition-colors hover:bg-gold/5 ${
                            i % 2 === 0 ? 'bg-card-white/60' : 'bg-card-white/40'
                          }`}
                        >
                          <td className="px-4 py-2">
                            <div className="relative h-10 w-7 overflow-hidden rounded bg-card-cream">
                              {imageUrl && (
                                <Image src={imageUrl} alt={card.name} fill className="object-cover" sizes="28px" unoptimized />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 font-medium text-[rgb(var(--text-primary))]">{card.name}</td>
                          <td className="px-4 py-2 text-[rgb(var(--text-muted))]">{setName ?? '—'}</td>
                          <td className="px-4 py-2 font-mono text-[rgb(var(--text-muted))]">#{card.localId}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom pagination */}
            {pageSize !== 'all' && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-gold/20 bg-card-white/85 px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:border-gold/40 disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    // Show first, last, current ±1, with ellipsis
                    let page: number | null = null;
                    if (totalPages <= 7) page = i + 1;
                    else if (i === 0) page = 1;
                    else if (i === 6) page = totalPages;
                    else if (currentPage <= 4) page = i + 1;
                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                    else page = currentPage - 2 + (i - 1);
                    if (page === null) return null;
                    const isEllipsis =
                      totalPages > 7 &&
                      ((i === 1 && page > 2) || (i === 5 && page < totalPages - 1));
                    if (isEllipsis) return (
                      <span key={i} className="px-1 text-sm text-[rgb(var(--text-muted))]">…</span>
                    );
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page!)}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === currentPage
                            ? 'bg-gold text-white shadow-sm'
                            : 'border border-gold/20 bg-card-white/85 text-[rgb(var(--text-secondary))] hover:border-gold/40'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-gold/20 bg-card-white/85 px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:border-gold/40 disabled:opacity-40"
                >
                  Next {pageSize}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail loading overlay */}
      {loadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgb(var(--text-primary))]/20 backdrop-blur-sm">
          <div className="rounded-2xl border border-gold/30 bg-card-white/95 p-8 shadow-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
            <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">Loading card…</p>
          </div>
        </div>
      )}

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
