// ============================================================================
// DATA INGESTION - EXPORTS
// ============================================================================

// Shared types
export type {
  RateLimitConfig,
  AdapterResponse,
  AdapterError,
  PaginationParams,
  PaginatedResult,
  // Limitless TCG types
  LimitlessTournament,
  LimitlessTournamentDetails,
  LimitlessPhase,
  LimitlessStanding,
  LimitlessDecklistCard,
  LimitlessPairing,
  LimitlessGame,
  LimitlessDeckArchetype,
} from './types';

// Fetch utilities
export { rateLimitedFetch, createRateLimiter, buildUrl } from './fetch';

// TCGdex adapter (FREE - card data, images, prices)
export {
  // Cards
  fetchCard,
  searchCards,
  fetchAllCards,
  fetchCardsByName,
  fetchCardFromSet,
  // Sets
  fetchAllSets,
  fetchSet,
  // Series
  fetchAllSeries,
  fetchSerie,
  // Metadata
  fetchCategories,
  fetchTypes,
  fetchRarities,
  fetchRegulationMarks,
  fetchStages,
  fetchIllustrators,
  // Image helpers
  getCardImageUrl,
  getSetLogoUrl,
  getSetSymbolUrl,
  // Types
  type TcgdexCard,
  type TcgdexCardBrief,
  type TcgdexSet,
  type TcgdexSetBrief,
  type TcgdexSerie,
  type TcgdexSerieBrief,
  type TcgdexAttack,
  type TcgdexAbility,
  type TcgdexCardSearchParams,
  type TcgdexLanguage,
  TCGDEX_LANGUAGES,
} from './adapters/tcgdex';

// Transforms
export {
  transformTcgdexCard,
  transformTcgdexCards,
  transformLimitlessDecklist,
  parsePtcgoDecklist,
  exportToPtcgoFormat,
  inferDeckArchetype,
  type DecklistCardReference,
} from './transforms';

// Limitless TCG adapter (FREE - tournaments, meta, decklists)
export {
  // Constants
  POKEMON_TCG_GAME_ID,
  FORMATS,
  type FormatId,
  // Games
  fetchGames,
  fetchDeckArchetypes,
  // Tournaments
  fetchTournaments,
  fetchRecentStandardTournaments,
  fetchTournamentDetails,
  fetchTournamentStandings,
  fetchTournamentPairings,
  fetchFullTournament,
  type TournamentSearchParams,
  type FullTournamentData,
  // Meta analysis
  analyzeDeckUsage,
  getTopDecks,
  type DeckUsageStats,
  // Utilities
  getTournamentUrl,
  getPlayerUrl,
  getDeckIconUrl,
} from './adapters/limitless';
