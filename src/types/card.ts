/**
 * Pokemon energy types
 */
export type EnergyType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'fighting'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'dragon'
  | 'colorless'
  | 'normal';

/**
 * Card supertype (main category)
 */
export type CardSupertype = 'Pokemon' | 'Trainer' | 'Energy';

/**
 * Card subtypes
 */
export type CardSubtype =
  // Pokemon subtypes
  | 'Basic'
  | 'Stage 1'
  | 'Stage 2'
  | 'VSTAR'
  | 'VMAX'
  | 'V'
  | 'ex'
  | 'GX'
  | 'EX'
  | 'BREAK'
  | 'Mega'
  | 'Restored'
  | 'Baby'
  // Trainer subtypes
  | 'Supporter'
  | 'Item'
  | 'Stadium'
  | 'Tool'
  | 'Ace Spec'
  // Energy subtypes
  | 'Basic Energy'
  | 'Special Energy';

/**
 * Card rarity levels
 */
export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Rare Holo'
  | 'Rare Holo EX'
  | 'Rare Holo GX'
  | 'Rare Holo V'
  | 'Rare Holo VMAX'
  | 'Rare Holo VSTAR'
  | 'Rare Ultra'
  | 'Rare Secret'
  | 'Rare Rainbow'
  | 'Amazing Rare'
  | 'Illustration Rare'
  | 'Special Art Rare'
  | 'Double Rare'
  | 'Hyper Rare'
  | 'Shiny Rare'
  | 'ACE SPEC Rare'
  | 'Promo';

/**
 * Card legality status
 */
export type LegalityStatus = 'Legal' | 'Banned' | 'Not Legal';

/**
 * Game formats
 */
export type GameFormat = 'standard' | 'expanded' | 'unlimited' | 'retro';

/**
 * Attack definition
 */
export interface CardAttack {
  name: string;
  cost: EnergyType[];
  damage: string;
  text: string;
}

/**
 * Ability definition
 */
export interface CardAbility {
  name: string;
  text: string;
  type: 'Ability' | 'Poke-Power' | 'Poke-Body' | 'Ancient Trait';
}

/**
 * Weakness/Resistance definition
 */
export interface CardWeakness {
  type: EnergyType;
  value: string; // e.g., "×2", "+20"
}

/**
 * Main Card interface
 */
export interface Card {
  // Identifiers
  id: string;
  limitlessId?: string;
  pkmncardsId?: string;
  pokemontcgId?: string;
  pricetrackerId?: string;

  // Core attributes
  name: string;
  supertype: CardSupertype;
  subtypes: CardSubtype[];
  
  // Set information
  setId: string;
  setName: string;
  number: string;
  
  // Pokemon-specific
  hp?: number;
  types?: EnergyType[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  
  // Game mechanics
  attacks?: CardAttack[];
  abilities?: CardAbility[];
  rules?: string[];
  
  // Combat attributes
  weaknesses?: CardWeakness[];
  resistances?: CardWeakness[];
  retreatCost?: number;
  
  // Legality
  legalityStandard: boolean;
  legalityExpanded: boolean;
  regulationMark?: string;
  
  // Metadata
  rarity?: CardRarity;
  artist?: string;
  flavorText?: string;
  language: 'en' | 'ja';
  
  // Images
  imageSmall: string;
  imageLarge: string;
  imageSource: string;
  
  // Pricing (denormalized)
  priceMarket?: number;
  priceLow?: number;
  priceHigh?: number;
  priceUpdatedAt?: string;
  
  // Meta statistics
  metaUsagePercent?: number;
  avgCopiesInDeck?: number;
  tournamentAppearances?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Card search/filter parameters
 */
export interface CardSearchParams {
  query?: string;
  types?: EnergyType[];
  supertypes?: CardSupertype[];
  subtypes?: CardSubtype[];
  setId?: string;
  rarity?: CardRarity[];
  format?: GameFormat;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'name' | 'price' | 'meta' | 'release';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Card search result
 */
export interface CardSearchResult {
  cards: Card[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
