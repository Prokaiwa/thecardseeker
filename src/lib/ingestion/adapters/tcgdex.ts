// ============================================================================
// TCGDEX API ADAPTER
// Fetches card data, sets, images, and prices
// Docs: https://tcgdex.dev/
// FREE, OPEN SOURCE, NO API KEY REQUIRED
// ============================================================================

import { rateLimitedFetch, buildUrl, createRateLimiter } from '../fetch';
import type {
  AdapterResponse,
  PaginatedResult,
} from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const BASE_URL = 'https://api.tcgdex.net/v2/en'; // English by default
const SOURCE = 'tcgdex';

// TCGdex is generous but let's be respectful: 3 requests per second
const rateLimiter = createRateLimiter({
  requestsPerSecond: 3,
  maxRetries: 3,
  retryDelayMs: 1000,
});

// Supported languages
export const TCGDEX_LANGUAGES = [
  'en', 'fr', 'es', 'it', 'pt', 'de',  // Western
  'ja', 'zh-tw', 'id', 'th',           // Asian
] as const;

export type TcgdexLanguage = typeof TCGDEX_LANGUAGES[number];

// ============================================================================
// TCGDEX TYPES (Raw from API)
// ============================================================================

export interface TcgdexCard {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
  category: 'Pokemon' | 'Trainer' | 'Energy';
  illustrator?: string;
  rarity?: string;
  set: TcgdexSetBrief;
  variants: {
    normal: boolean;
    reverse: boolean;
    holo: boolean;
    firstEdition: boolean;
  };
  updated: string;
  
  // Pokemon-specific
  dexId?: number[];
  hp?: number;
  types?: string[];
  evolveFrom?: string;
  description?: string;
  level?: string;
  stage?: string;
  suffix?: string;
  attacks?: TcgdexAttack[];
  abilities?: TcgdexAbility[];
  weaknesses?: TcgdexTypeValue[];
  resistances?: TcgdexTypeValue[];
  retreat?: number;
  regulationMark?: string;
  legal?: {
    standard: boolean;
    expanded: boolean;
  };
  
  // Trainer/Energy specific
  effect?: string;
  trainerType?: string;
  energyType?: string;
  
  // Pricing
  pricing?: TcgdexPricing;
}

export interface TcgdexCardBrief {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
}

export interface TcgdexAttack {
  name: string;
  cost?: string[];
  damage?: string | number;
  effect?: string;
}

export interface TcgdexAbility {
  name: string;
  type: string;
  effect: string;
}

export interface TcgdexTypeValue {
  type: string;
  value: string;
}

export interface TcgdexPricing {
  tcgplayer?: {
    updated: string;
    unit: string;
    normal?: TcgdexPriceVariant;
    holofoil?: TcgdexPriceVariant;
    'reverse-holofoil'?: TcgdexPriceVariant;
    reverse?: TcgdexPriceVariant;
  };
  cardmarket?: {
    updated: string;
    unit: string;
    avg?: number;
    low?: number;
    trend?: number;
    avg1?: number;
    avg7?: number;
    avg30?: number;
  };
}

export interface TcgdexPriceVariant {
  lowPrice?: number;
  midPrice?: number;
  highPrice?: number;
  marketPrice?: number;
  directLowPrice?: number;
}

export interface TcgdexSet {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  serie: TcgdexSerieBrief;
  cardCount: {
    official: number;
    total: number;
  };
  releaseDate?: string;
  legal?: {
    standard: boolean;
    expanded: boolean;
  };
  cards?: TcgdexCardBrief[];
}

export interface TcgdexSetBrief {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  releaseDate?: string;
  cardCount?: {
    official: number;
    total: number;
  };
}

export interface TcgdexSerie {
  id: string;
  name: string;
  logo?: string;
  sets?: TcgdexSetBrief[];
}

export interface TcgdexSerieBrief {
  id: string;
  name: string;
  logo?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get base URL for a specific language
 */
function getBaseUrl(language: TcgdexLanguage = 'en'): string {
  return `https://api.tcgdex.net/v2/${language}`;
}

// ============================================================================
// CARDS
// ============================================================================

/**
 * Fetch a single card by ID
 * @param cardId - Card ID (e.g., "swsh3-136")
 * @param language - Language code (default: 'en')
 */
export async function fetchCard(
  cardId: string,
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexCard>> {
  const url = `${getBaseUrl(language)}/cards/${cardId}`;
  
  return rateLimitedFetch<TcgdexCard>(url, { rateLimiter, source: SOURCE });
}

/**
 * Search for cards with filters
 */
export interface TcgdexCardSearchParams {
  name?: string;
  category?: 'Pokemon' | 'Trainer' | 'Energy';
  hp?: number | string;        // Can be "gt100", "lt50", etc.
  types?: string;              // e.g., "Fire", "Water"
  stage?: string;              // "Basic", "Stage1", "Stage2"
  rarity?: string;
  illustrator?: string;
  regulationMark?: string;
  set?: string;                // set.id — e.g., "sv08.5"
  weakness?: string;           // weaknesses.type — e.g., "Fire"
  resistance?: string;         // resistances.type — e.g., "Water"
}

export async function searchCards(
  params: TcgdexCardSearchParams = {},
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexCardBrief[]>> {
  const searchParams = new URLSearchParams();

  if (params.name) searchParams.set('name', params.name);
  if (params.category) searchParams.set('category', params.category);
  if (params.hp) searchParams.set('hp', String(params.hp));
  if (params.types) searchParams.set('types', params.types);
  if (params.stage) searchParams.set('stage', params.stage);
  if (params.rarity) searchParams.set('rarity', params.rarity);
  if (params.illustrator) searchParams.set('illustrator', params.illustrator);
  if (params.regulationMark) searchParams.set('regulationMark', params.regulationMark);
  if (params.set) searchParams.set('set.id', params.set);
  if (params.weakness) searchParams.set('weaknesses.type', params.weakness);
  if (params.resistance) searchParams.set('resistances.type', params.resistance);

  const queryString = searchParams.toString();
  const url = queryString
    ? `${getBaseUrl(language)}/cards?${queryString}`
    : `${getBaseUrl(language)}/cards`;

  return rateLimitedFetch<TcgdexCardBrief[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all cards (brief info)
 * Warning: This returns a lot of data!
 */
export async function fetchAllCards(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexCardBrief[]>> {
  const url = `${getBaseUrl(language)}/cards`;
  
  return rateLimitedFetch<TcgdexCardBrief[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch cards by name (partial match)
 */
export async function fetchCardsByName(
  name: string,
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexCardBrief[]>> {
  return searchCards({ name }, language);
}

// ============================================================================
// SETS
// ============================================================================

/**
 * Fetch all sets
 */
export async function fetchAllSets(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexSetBrief[]>> {
  const url = `${getBaseUrl(language)}/sets`;
  
  return rateLimitedFetch<TcgdexSetBrief[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch a single set with all its cards
 */
export async function fetchSet(
  setId: string,
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexSet>> {
  const url = `${getBaseUrl(language)}/sets/${setId}`;
  
  return rateLimitedFetch<TcgdexSet>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch a specific card from a set using set ID and local card number
 */
export async function fetchCardFromSet(
  setId: string,
  localId: string,
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexCard>> {
  const url = `${getBaseUrl(language)}/sets/${setId}/${localId}`;
  
  return rateLimitedFetch<TcgdexCard>(url, { rateLimiter, source: SOURCE });
}

// ============================================================================
// SERIES
// ============================================================================

/**
 * Fetch all series
 */
export async function fetchAllSeries(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexSerieBrief[]>> {
  const url = `${getBaseUrl(language)}/series`;
  
  return rateLimitedFetch<TcgdexSerieBrief[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch a single series with all its sets
 */
export async function fetchSerie(
  serieId: string,
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<TcgdexSerie>> {
  const url = `${getBaseUrl(language)}/series/${serieId}`;
  
  return rateLimitedFetch<TcgdexSerie>(url, { rateLimiter, source: SOURCE });
}

// ============================================================================
// METADATA ENDPOINTS
// ============================================================================

/**
 * Fetch all card categories
 */
export async function fetchCategories(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/categories`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all Pokemon types
 */
export async function fetchTypes(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/types`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all rarities
 */
export async function fetchRarities(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/rarities`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all regulation marks
 */
export async function fetchRegulationMarks(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/regulation-marks`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all stages (Basic, Stage1, Stage2, etc.)
 */
export async function fetchStages(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/stages`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

/**
 * Fetch all illustrators
 */
export async function fetchIllustrators(
  language: TcgdexLanguage = 'en'
): Promise<AdapterResponse<string[]>> {
  const url = `${getBaseUrl(language)}/illustrators`;
  
  return rateLimitedFetch<string[]>(url, { rateLimiter, source: SOURCE });
}

// ============================================================================
// IMAGE HELPERS
// ============================================================================

/**
 * Get card image URL
 * TCGdex provides images at: https://assets.tcgdex.net/{lang}/{serie}/{set}/{localId}
 * 
 * Quality options:
 * - default: standard quality
 * - /high: high resolution
 * - /low: low resolution (faster loading)
 */
export function getCardImageUrl(
  cardId: string,
  options: {
    language?: TcgdexLanguage;
    quality?: 'low' | 'default' | 'high';
  } = {}
): string {
  const { language = 'en', quality = 'default' } = options;
  const suffix = quality === 'default' ? '' : `/${quality}`;
  
  // Card ID format is typically: setId-localId (e.g., "swsh3-136")
  // Image URL needs: serie/set/localId
  // We can construct a basic URL, but full URL needs set info
  return `https://assets.tcgdex.net/${language}/cards/${cardId}${suffix}`;
}

/**
 * Get set logo URL
 */
export function getSetLogoUrl(setId: string, language: TcgdexLanguage = 'en'): string {
  return `https://assets.tcgdex.net/${language}/sets/${setId}/logo`;
}

/**
 * Get set symbol URL
 */
export function getSetSymbolUrl(setId: string): string {
  return `https://assets.tcgdex.net/univ/sets/${setId}/symbol`;
}
