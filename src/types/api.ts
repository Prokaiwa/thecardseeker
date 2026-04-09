// ============================================================================
// THE CARD SEEKER - API CONTRACTS
// TypeScript interfaces for all API routes
// ============================================================================

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface PaginationParams {
  page?: number;
  limit?: number;        // Default: 20, Max: 100
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================================
// CARD API
// ============================================================================

// GET /api/cards
export interface GetCardsParams extends PaginationParams {
  q?: string;            // Search query (name, text)
  types?: string[];      // Filter by type(s)
  supertype?: 'Pokemon' | 'Trainer' | 'Energy';
  subtypes?: string[];   // Basic, Stage 1, Supporter, etc.
  set?: string;          // Set ID
  rarity?: string;
  format?: 'standard' | 'expanded' | 'unlimited';
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'name' | 'price' | 'meta_usage' | 'release_date';
  sortOrder?: 'asc' | 'desc';
}

export interface CardListItem {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  types: string[];
  set_id: string;
  set_name: string;       // Joined from sets table
  number: string;
  rarity: string;
  image_small: string;
  price_market: number | null;
  meta_usage_percent: number;
  legality_standard: boolean;
  legality_expanded: boolean;
}

export type GetCardsResponse = PaginatedResponse<CardListItem>;

// GET /api/cards/[id]
export interface CardDetail {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  types: string[];
  hp: number | null;
  evolves_from: string | null;
  evolves_to: string[];
  
  attacks: Attack[];
  abilities: Ability[];
  rules: string[];
  
  weaknesses: TypeValue[];
  resistances: TypeValue[];
  retreat_cost: number;
  
  set: {
    id: string;
    name: string;
    series: string;
    logo_url: string;
  };
  number: string;
  rarity: string;
  artist: string;
  flavor_text: string | null;
  regulation_mark: string;
  
  legality_standard: boolean;
  legality_expanded: boolean;
  
  image_small: string;
  image_large: string;
  
  price_market: number | null;
  price_low: number | null;
  price_high: number | null;
  price_updated_at: string | null;
  
  meta_usage_percent: number;
  avg_copies_in_deck: number;
  tournament_appearances: number;
  
  // Related data
  synergies: CardSynergy[];
  decks_using: DeckPreview[];
}

export interface Attack {
  name: string;
  cost: string[];        // Energy types required
  damage: string;
  text: string;
}

export interface Ability {
  name: string;
  text: string;
  type: string;          // Ability, Poke-Power, Poke-Body
}

export interface TypeValue {
  type: string;
  value: string;         // "×2", "-30", etc.
}

export interface CardSynergy {
  card_id: string;
  card_name: string;
  card_image: string;
  synergy_score: number;
  synergy_type: string;
}

export interface DeckPreview {
  id: string;
  name: string;
  archetype: string;
  format: string;
  likes: number;
}

// GET /api/cards/[id]/price-history
export interface PriceHistoryPoint {
  date: string;          // ISO date
  market_price: number;
  low_price: number;
  high_price: number;
}

export type GetPriceHistoryResponse = PriceHistoryPoint[];

// ============================================================================
// SETS API
// ============================================================================

// GET /api/sets
export interface SetListItem {
  id: string;
  name: string;
  series: string;
  total_cards: number;
  release_date: string;
  logo_url: string;
  symbol_url: string;
  legality_standard: boolean;
  legality_expanded: boolean;
}

export type GetSetsResponse = SetListItem[];

// GET /api/sets/[id]
export interface SetDetail extends SetListItem {
  cards: CardListItem[];
}

// ============================================================================
// DECK API
// ============================================================================

// GET /api/decks
export interface GetDecksParams extends PaginationParams {
  user_id?: string;      // Filter by user
  format?: 'standard' | 'expanded' | 'unlimited';
  archetype?: string;
  featured_pokemon?: string;
  is_public?: boolean;
  sortBy?: 'created_at' | 'likes' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface DeckListItem {
  id: string;
  name: string;
  description: string | null;
  format: string;
  archetype: string | null;
  featured_pokemon: string | null;
  is_public: boolean;
  is_valid: boolean;
  likes: number;
  views: number;
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  created_at: string;
  updated_at: string;
  // Preview cards (first 3 Pokemon)
  preview_cards: {
    id: string;
    name: string;
    image_small: string;
  }[];
}

export type GetDecksResponse = PaginatedResponse<DeckListItem>;

// GET /api/decks/[id]
export interface DeckDetail {
  id: string;
  name: string;
  description: string | null;
  format: string;
  archetype: string | null;
  featured_pokemon: string | null;
  is_public: boolean;
  is_ai_generated: boolean;
  is_valid: boolean;
  validation_errors: ValidationError[] | null;
  
  cards: DeckCard[];
  
  // Statistics
  stats: {
    total_cards: number;
    pokemon_count: number;
    trainer_count: number;
    energy_count: number;
    total_price: number;
  };
  
  // Simulation results
  simulation: {
    basic_pokemon_odds: number;
    supporter_t1_odds: number;
    consistency_score: number;
    updated_at: string | null;
  } | null;
  
  // Social
  likes: number;
  views: number;
  user_has_liked: boolean;  // If authenticated
  fork_of: string | null;
  
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  
  created_at: string;
  updated_at: string;
}

export interface DeckCard {
  card_id: string;
  quantity: number;
  card: {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    types: string[];
    image_small: string;
    price_market: number | null;
  };
}

export interface ValidationError {
  code: string;
  message: string;
  card_id?: string;
}

// POST /api/decks
export interface CreateDeckRequest {
  name: string;
  description?: string;
  format: 'standard' | 'expanded' | 'unlimited';
  cards: { card_id: string; quantity: number }[];
  is_public?: boolean;
  featured_pokemon?: string;
}

export interface CreateDeckResponse {
  id: string;
  is_valid: boolean;
  validation_errors: ValidationError[] | null;
}

// PUT /api/decks/[id]
export interface UpdateDeckRequest {
  name?: string;
  description?: string;
  cards?: { card_id: string; quantity: number }[];
  is_public?: boolean;
  featured_pokemon?: string;
}

// POST /api/decks/[id]/like
// No request body needed
export interface LikeDeckResponse {
  liked: boolean;
  total_likes: number;
}

// POST /api/decks/[id]/fork
export interface ForkDeckResponse {
  id: string;            // New deck ID
}

// ============================================================================
// DECK GENERATOR API
// ============================================================================

// POST /api/decks/generate
export interface GenerateDeckRequest {
  featured_pokemon: string;   // Card ID of the Pokemon to build around
  format: 'standard' | 'expanded' | 'unlimited';
  strategy?: 'aggro' | 'control' | 'combo' | 'balanced';
  budget_max?: number;        // Max total deck price
  include_cards?: string[];   // Card IDs to definitely include
  exclude_cards?: string[];   // Card IDs to never include
}

export interface GenerateDeckResponse {
  deck: {
    name: string;
    description: string;
    cards: { card_id: string; quantity: number }[];
    archetype: string;
  };
  explanation: string;        // Why these cards were chosen
  alternatives: {             // Other options considered
    card_id: string;
    card_name: string;
    reason: string;
  }[];
}

// ============================================================================
// SIMULATION API
// ============================================================================

// POST /api/simulate
export interface SimulateRequest {
  cards: { card_id: string; quantity: number }[];
  iterations?: number;        // Default: 1000, Premium: 10000
  simulations: SimulationType[];
}

export type SimulationType = 
  | 'opening_hand' 
  | 'supporter_t1' 
  | 'specific_card' 
  | 'prize_cards'
  | 'turn_by_turn';

export interface SimulateResponse {
  results: {
    opening_hand?: OpeningHandResult;
    supporter_t1?: SupporterT1Result;
    specific_card?: SpecificCardResult;
    prize_cards?: PrizeCardsResult;
    turn_by_turn?: TurnByTurnResult;
  };
  iterations: number;
  execution_time_ms: number;
}

export interface OpeningHandResult {
  basic_pokemon_odds: number;           // % chance of having a Basic
  basic_pokemon_distribution: {         // Distribution of Basic count
    count: number;
    probability: number;
  }[];
  mulligan_rate: number;
  avg_hand_value: number;               // Avg market value of opening hand
}

export interface SupporterT1Result {
  odds: number;                         // % chance of Supporter in hand
  by_supporter: {                       // Breakdown by specific Supporter
    card_id: string;
    card_name: string;
    odds: number;
  }[];
}

export interface SpecificCardResult {
  card_id: string;
  card_name: string;
  opening_hand_odds: number;
  by_turn: {
    turn: number;
    cumulative_odds: number;
  }[];
}

export interface PrizeCardsResult {
  // Odds of key cards being prized
  by_card: {
    card_id: string;
    card_name: string;
    at_least_one_prized: number;
    all_prized: number;
  }[];
}

export interface TurnByTurnResult {
  turns: {
    turn: number;
    cards_seen: number;
    key_card_access: {
      card_id: string;
      card_name: string;
      probability: number;
    }[];
  }[];
}

// ============================================================================
// META API
// ============================================================================

// GET /api/meta
export interface GetMetaResponse {
  last_updated: string;
  tournament_count: number;
  
  tiers: {
    s: ArchetypePreview[];
    a: ArchetypePreview[];
    b: ArchetypePreview[];
    c: ArchetypePreview[];
  };
  
  trending: {
    rising: ArchetypePreview[];
    falling: ArchetypePreview[];
  };
}

export interface ArchetypePreview {
  id: string;
  name: string;
  icons: string[];       // Pokemon image URLs
  meta_share: number;
  win_rate: number;
  change_7d: number;     // Change in meta share over 7 days
}

// GET /api/meta/[archetype]
export interface ArchetypeDetail {
  id: string;
  name: string;
  tier: string;
  icons: string[];
  
  stats: {
    meta_share: number;
    win_rate: number;
    tournament_wins: number;
    top_8_placements: number;
    total_appearances: number;
  };
  
  core_cards: {
    card_id: string;
    card_name: string;
    card_image: string;
    avg_count: number;
    appearance_rate: number;
  }[];
  
  flex_slots: {
    card_id: string;
    card_name: string;
    card_image: string;
    appearance_rate: number;
  }[];
  
  matchups: {
    archetype_id: string;
    archetype_name: string;
    win_rate: number;
    sample_size: number;
  }[];
  
  sample_deck: DeckDetail | null;
  
  recent_results: {
    tournament_name: string;
    date: string;
    placement: number;
    player_name: string;
  }[];
}

// ============================================================================
// LEADERBOARD API
// ============================================================================

// GET /api/leaderboards
export interface GetLeaderboardsParams {
  format?: 'standard' | 'expanded' | 'unlimited' | 'retro';
  period?: 'weekly' | 'monthly' | 'all_time';
  featured_pokemon?: string;  // For "Build Around" leaderboards
  limit?: number;             // Default: 20
}

export interface LeaderboardEntry {
  rank: number;
  deck: DeckListItem;
  score: number;
  breakdown: {
    sim_score: number;
    vote_score: number;
    uniqueness_bonus: number;
  };
}

export type GetLeaderboardsResponse = {
  period: string;
  format: string;
  featured_pokemon: string | null;
  entries: LeaderboardEntry[];
  user_entry: LeaderboardEntry | null;  // If authenticated
};

// ============================================================================
// USER API
// ============================================================================

// GET /api/users/me
export interface GetCurrentUserResponse {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  subscription_status: 'free' | 'premium' | 'canceled';
  subscription_expires_at: string | null;
  default_format: string;
  referral_code: string;
  
  usage: {
    ai_generations_this_month: number;
    ai_generations_limit: number;
    simulations_this_month: number;
  };
  
  stats: {
    decks_created: number;
    total_likes_received: number;
    collection_value: number | null;
  };
}

// PUT /api/users/me
export interface UpdateUserRequest {
  display_name?: string;
  avatar_url?: string;
  default_format?: string;
  email_notifications?: boolean;
}

// ============================================================================
// COLLECTION API (Premium)
// ============================================================================

// GET /api/collection
export interface GetCollectionResponse {
  total_cards: number;
  unique_cards: number;
  total_value: number;
  cards: CollectionCard[];
}

export interface CollectionCard {
  card_id: string;
  card: CardListItem;
  quantity: number;
  condition: string;
  is_foil: boolean;
  purchase_price: number | null;
  current_value: number;
}

// POST /api/collection/cards
export interface AddToCollectionRequest {
  card_id: string;
  quantity?: number;
  condition?: 'nm' | 'lp' | 'mp' | 'hp' | 'dmg';
  is_foil?: boolean;
  purchase_price?: number;
}

// ============================================================================
// PRICE ALERTS API (Premium)
// ============================================================================

// GET /api/alerts
export interface GetAlertsResponse {
  alerts: PriceAlert[];
}

export interface PriceAlert {
  id: string;
  card_id: string;
  card: CardListItem;
  alert_type: 'below' | 'above';
  target_price: number;
  current_price: number;
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
}

// POST /api/alerts
export interface CreateAlertRequest {
  card_id: string;
  alert_type: 'below' | 'above';
  target_price: number;
}

// ============================================================================
// IMPORT/EXPORT API
// ============================================================================

// POST /api/decks/import
export interface ImportDeckRequest {
  format: 'ptcgo' | 'limitless' | 'csv';
  content: string;
  name?: string;
}

export interface ImportDeckResponse {
  deck_id: string;
  matched_cards: number;
  unmatched_cards: {
    name: string;
    quantity: number;
    suggestions: CardListItem[];
  }[];
}

// GET /api/decks/[id]/export
export interface ExportDeckParams {
  format: 'ptcgo' | 'limitless' | 'csv' | 'json';
}

// Returns plain text or JSON depending on format
