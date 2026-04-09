// ============================================================================
// LIMITLESS TCG API ADAPTER
// Fetches tournament data, standings, decklists, and meta archetypes
// Docs: https://docs.limitlesstcg.com/developer
// ============================================================================

import { rateLimitedFetch, buildUrl, createRateLimiter } from '../fetch';
import type {
  AdapterResponse,
  PaginatedResult,
  LimitlessTournament,
  LimitlessTournamentDetails,
  LimitlessStanding,
  LimitlessPairing,
  LimitlessGame,
  LimitlessDeckArchetype,
} from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const BASE_URL = 'https://play.limitlesstcg.com/api';
const SOURCE = 'limitless';

// Limitless has rate limits - check response headers
// Being conservative: 2 requests per second
const rateLimiter = createRateLimiter({
  requestsPerSecond: 2,
  maxRetries: 3,
  retryDelayMs: 1000,
});

// Game ID for Pokemon TCG
export const POKEMON_TCG_GAME_ID = 'PTCG';

// Format IDs
export const FORMATS = {
  STANDARD: 'STANDARD',
  EXPANDED: 'EXPANDED',
  GLC: 'GLC', // Gym Leader Challenge
} as const;

export type FormatId = keyof typeof FORMATS;

// ============================================================================
// GAMES
// ============================================================================

/**
 * Fetch all supported games
 */
export async function fetchGames(): Promise<AdapterResponse<LimitlessGame[]>> {
  const url = `${BASE_URL}/games`;

  return rateLimitedFetch<LimitlessGame[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch deck archetypes for a game
 * NOTE: This endpoint may require an API key
 */
export async function fetchDeckArchetypes(
  gameId: string = POKEMON_TCG_GAME_ID
): Promise<AdapterResponse<LimitlessDeckArchetype[]>> {
  const url = `${BASE_URL}/games/${gameId}/decks`;

  return rateLimitedFetch<LimitlessDeckArchetype[]>(url, { rateLimiter, source: SOURCE });
}

// ============================================================================
// TOURNAMENTS
// ============================================================================

export interface TournamentSearchParams {
  game?: string;        // e.g., 'PTCG'
  format?: string;      // e.g., 'STANDARD'
  organizerId?: number;
  limit?: number;       // Default: 50
  page?: number;
}

/**
 * Fetch list of tournaments
 */
export async function fetchTournaments(
  params: TournamentSearchParams = {}
): Promise<AdapterResponse<PaginatedResult<LimitlessTournament>>> {
  const { 
    game = POKEMON_TCG_GAME_ID, 
    format, 
    organizerId, 
    limit = 50, 
    page = 1 
  } = params;

  const url = buildUrl(`${BASE_URL}/tournaments`, {
    game,
    format,
    organizerId,
    limit,
    page,
  });

  const response = await rateLimitedFetch<LimitlessTournament[]>(
    url, 
    { rateLimiter, source: SOURCE }
  );

  if (response.error || !response.data) {
    return { data: null, error: response.error, source: SOURCE };
  }

  // Limitless doesn't return total count, so we estimate
  const hasMore = response.data.length === limit;

  return {
    data: {
      items: response.data,
      page,
      pageSize: limit,
      totalCount: -1, // Unknown
      hasMore,
    },
    error: null,
    source: SOURCE,
    cachedAt: response.cachedAt,
  };
}

/**
 * Fetch recent Pokemon TCG Standard tournaments
 */
export async function fetchRecentStandardTournaments(
  limit: number = 20
): Promise<AdapterResponse<LimitlessTournament[]>> {
  const response = await fetchTournaments({
    game: POKEMON_TCG_GAME_ID,
    format: FORMATS.STANDARD,
    limit,
  });

  if (response.error || !response.data) {
    return { data: null, error: response.error, source: SOURCE };
  }

  return {
    data: response.data.items,
    error: null,
    source: SOURCE,
    cachedAt: response.cachedAt,
  };
}

/**
 * Fetch tournament details
 */
export async function fetchTournamentDetails(
  tournamentId: string
): Promise<AdapterResponse<LimitlessTournamentDetails>> {
  const url = `${BASE_URL}/tournaments/${tournamentId}/details`;

  return rateLimitedFetch<LimitlessTournamentDetails>(
    url, 
    { rateLimiter, source: SOURCE }
  );
}

/**
 * Fetch tournament standings (includes decklists if available)
 */
export async function fetchTournamentStandings(
  tournamentId: string
): Promise<AdapterResponse<LimitlessStanding[]>> {
  const url = `${BASE_URL}/tournaments/${tournamentId}/standings`;

  return rateLimitedFetch<LimitlessStanding[]>(
    url, 
    { rateLimiter, source: SOURCE }
  );
}

/**
 * Fetch tournament pairings/matches
 */
export async function fetchTournamentPairings(
  tournamentId: string
): Promise<AdapterResponse<LimitlessPairing[]>> {
  const url = `${BASE_URL}/tournaments/${tournamentId}/pairings`;

  return rateLimitedFetch<LimitlessPairing[]>(
    url, 
    { rateLimiter, source: SOURCE }
  );
}

// ============================================================================
// AGGREGATION HELPERS
// ============================================================================

/**
 * Full tournament data - details + standings
 */
export interface FullTournamentData {
  details: LimitlessTournamentDetails;
  standings: LimitlessStanding[];
  pairings?: LimitlessPairing[];
}

/**
 * Fetch complete tournament data
 */
export async function fetchFullTournament(
  tournamentId: string,
  options: { includePairings?: boolean } = {}
): Promise<AdapterResponse<FullTournamentData>> {
  // Fetch details and standings in parallel
  const [detailsResponse, standingsResponse] = await Promise.all([
    fetchTournamentDetails(tournamentId),
    fetchTournamentStandings(tournamentId),
  ]);

  // Check for errors
  if (detailsResponse.error) {
    return { data: null, error: detailsResponse.error, source: SOURCE };
  }
  if (standingsResponse.error) {
    return { data: null, error: standingsResponse.error, source: SOURCE };
  }
  if (!detailsResponse.data || !standingsResponse.data) {
    return {
      data: null,
      error: { code: 'UNKNOWN', message: 'Missing data in response' },
      source: SOURCE,
    };
  }

  const result: FullTournamentData = {
    details: detailsResponse.data,
    standings: standingsResponse.data,
  };

  // Optionally fetch pairings
  if (options.includePairings) {
    const pairingsResponse = await fetchTournamentPairings(tournamentId);
    if (pairingsResponse.data) {
      result.pairings = pairingsResponse.data;
    }
  }

  return {
    data: result,
    error: null,
    source: SOURCE,
  };
}

// ============================================================================
// META ANALYSIS HELPERS
// ============================================================================

/**
 * Deck usage statistics from tournament standings
 */
export interface DeckUsageStats {
  deckId: string;
  deckName: string;
  icons: string[];
  count: number;
  topCutCount: number; // Top 8/16 depending on tournament size
  winRate: number;
  avgPlacing: number;
}

/**
 * Analyze deck usage from tournament standings
 */
export function analyzeDeckUsage(
  standings: LimitlessStanding[],
  topCutSize: number = 8
): DeckUsageStats[] {
  const deckStats = new Map<string, {
    name: string;
    icons: string[];
    count: number;
    topCutCount: number;
    totalPlacing: number;
    wins: number;
    totalGames: number;
  }>();

  for (const standing of standings) {
    if (!standing.deck) continue;

    const { id, name, icons } = standing.deck;
    const existing = deckStats.get(id) || {
      name,
      icons,
      count: 0,
      topCutCount: 0,
      totalPlacing: 0,
      wins: 0,
      totalGames: 0,
    };

    existing.count++;
    existing.totalPlacing += standing.placing;
    existing.wins += standing.record.wins;
    existing.totalGames += standing.record.wins + standing.record.losses + standing.record.ties;

    if (standing.placing <= topCutSize) {
      existing.topCutCount++;
    }

    deckStats.set(id, existing);
  }

  // Convert to array and calculate averages
  const results: DeckUsageStats[] = [];

  for (const [deckId, stats] of deckStats) {
    results.push({
      deckId,
      deckName: stats.name,
      icons: stats.icons,
      count: stats.count,
      topCutCount: stats.topCutCount,
      winRate: stats.totalGames > 0 ? stats.wins / stats.totalGames : 0,
      avgPlacing: stats.count > 0 ? stats.totalPlacing / stats.count : 0,
    });
  }

  // Sort by count (most popular first)
  return results.sort((a, b) => b.count - a.count);
}

/**
 * Get top performing decks from recent tournaments
 */
export async function getTopDecks(
  options: {
    format?: string;
    tournamentCount?: number;
    minPlayers?: number;
  } = {}
): Promise<AdapterResponse<DeckUsageStats[]>> {
  const { 
    format = FORMATS.STANDARD, 
    tournamentCount = 10,
    minPlayers = 32 
  } = options;

  // Fetch recent tournaments
  const tournamentsResponse = await fetchTournaments({
    game: POKEMON_TCG_GAME_ID,
    format,
    limit: tournamentCount * 2, // Fetch extra in case some are too small
  });

  if (tournamentsResponse.error || !tournamentsResponse.data) {
    return { data: null, error: tournamentsResponse.error, source: SOURCE };
  }

  // Filter to tournaments with enough players
  const validTournaments = tournamentsResponse.data.items
    .filter(t => t.players >= minPlayers)
    .slice(0, tournamentCount);

  // Fetch standings for each tournament
  const allStandings: LimitlessStanding[] = [];

  for (const tournament of validTournaments) {
    const standingsResponse = await fetchTournamentStandings(tournament.id);
    if (standingsResponse.data) {
      allStandings.push(...standingsResponse.data);
    }
  }

  // Analyze deck usage
  const deckStats = analyzeDeckUsage(allStandings);

  return {
    data: deckStats,
    error: null,
    source: SOURCE,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build URL to view tournament on Limitless website
 */
export function getTournamentUrl(tournamentId: string): string {
  return `https://play.limitlesstcg.com/tournament/${tournamentId}`;
}

/**
 * Build URL to view player on Limitless website
 */
export function getPlayerUrl(playerId: string): string {
  return `https://play.limitlesstcg.com/player/${playerId}`;
}

/**
 * Get icon URL for a deck archetype icon
 */
export function getDeckIconUrl(iconName: string): string {
  // Limitless uses Pokemon sprites for deck icons
  // The exact URL pattern may need verification
  return `https://limitlesstcg.nyc3.digitaloceanspaces.com/pokemon/gen9/${iconName}.png`;
}
