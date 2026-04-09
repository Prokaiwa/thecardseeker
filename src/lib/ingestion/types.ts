// ============================================================================
// DATA INGESTION - SHARED TYPES
// Types used across all data source adapters
// ============================================================================

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
  requestsPerSecond: number;
  maxRetries: number;
  retryDelayMs: number;
}

/**
 * Base adapter response wrapper
 */
export interface AdapterResponse<T> {
  data: T | null;
  error: AdapterError | null;
  source: string;
  cachedAt?: string;
}

/**
 * Adapter error structure
 */
export interface AdapterError {
  code: 'RATE_LIMITED' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'UNKNOWN';
  message: string;
  statusCode?: number;
  retryAfter?: number; // seconds
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

// ============================================================================
// LIMITLESS TCG API TYPES (Raw from API)
// These are for tournament, standings, and meta data
// ============================================================================

export interface LimitlessTournament {
  id: string;
  game: string;
  format: string;
  name: string;
  date: string;
  players: number;
}

export interface LimitlessTournamentDetails extends LimitlessTournament {
  organizer: {
    id: number;
    name: string;
    logo?: string;
  };
  platform?: string;
  decklists: boolean;
  isPublic: boolean;
  isOnline: boolean;
  phases: LimitlessPhase[];
  bannedCards?: object[];
  specialRules?: string[];
}

export interface LimitlessPhase {
  phase: number;
  type: string;
  rounds: number;
  mode: string;
}

export interface LimitlessStanding {
  player: string;
  name: string;
  country: string;
  placing: number;
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  decklist?: LimitlessDecklistCard[];
  deck?: {
    id: string;
    name: string;
    icons: string[];
  };
  drop?: number | null;
}

export interface LimitlessDecklistCard {
  count: number;
  name: string;
  set?: string;
  number?: string;
}

export interface LimitlessPairing {
  round: number;
  phase: number;
  table?: number;
  match?: string;
  player1: string;
  player2: string;
  winner: string | number;
}

export interface LimitlessGame {
  id: string;
  name: string;
  formats: Record<string, string>;
  platforms: Record<string, string>;
  metagame: boolean;
}

export interface LimitlessDeckArchetype {
  identifier: string;
  name: string;
  icons?: string[];
  priority?: number;
  cards: {
    name: string;
    count?: string | number;
    set?: string;
    number?: string;
  }[];
  variants?: {
    identifier: string;
    name: string;
    icon?: string;
    cards: {
      name: string;
      count?: string | number;
      set?: string;
      number?: string;
    }[];
  }[];
  generation?: number;
}
