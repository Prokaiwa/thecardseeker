import type { Card, GameFormat } from './card';

/**
 * A card entry in a deck (card reference + quantity)
 */
export interface DeckCard {
  cardId: string;
  quantity: number;
  card?: Card; // Populated when fetching full deck details
}

/**
 * Deck validation status
 */
export interface DeckValidation {
  isValid: boolean;
  errors: DeckValidationError[];
  warnings: DeckValidationWarning[];
}

export interface DeckValidationError {
  type: 'card_limit' | 'deck_size' | 'no_basic' | 'banned_card' | 'illegal_card';
  message: string;
  cardId?: string;
}

export interface DeckValidationWarning {
  type: 'low_pokemon' | 'no_supporter' | 'energy_mismatch' | 'missing_evolution';
  message: string;
  cardId?: string;
}

/**
 * Deck statistics (computed)
 */
export interface DeckStats {
  totalCards: number;
  pokemonCount: number;
  trainerCount: number;
  energyCount: number;
  
  // By subtype
  basicPokemonCount: number;
  evolutionCount: number;
  supporterCount: number;
  itemCount: number;
  stadiumCount: number;
  
  // Energy breakdown
  energyByType: Record<string, number>;
  
  // Price
  totalPrice?: number;
  
  // Meta
  archetype?: string;
  tier?: 'S' | 'A' | 'B' | 'C' | 'Rogue';
}

/**
 * Simulation results (cached on deck)
 */
export interface DeckSimulationResults {
  basicPokemonOdds: number; // % chance of Basic in opening hand
  supporterT1Odds: number; // % chance of Supporter on T1
  consistencyScore: number; // 0-100 overall score
  mulliganRate: number; // % chance of mulligan
  updatedAt: string;
}

/**
 * Main Deck interface
 */
export interface Deck {
  id: string;
  userId: string;
  
  // Core info
  name: string;
  description?: string;
  format: GameFormat;
  
  // Contents
  cards: DeckCard[];
  
  // Computed stats
  stats?: DeckStats;
  
  // Simulation results
  simulation?: DeckSimulationResults;
  
  // Validation
  validation?: DeckValidation;
  
  // Metadata
  isPublic: boolean;
  isAiGenerated: boolean;
  archetype?: string;
  
  // Social
  likes: number;
  views: number;
  forkOf?: string; // ID of original deck if forked
  
  // Leaderboard
  deckScore?: number; // Combined simulation + votes score
  weeklyRank?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Deck list item (for lists/grids, lighter than full Deck)
 */
export interface DeckListItem {
  id: string;
  name: string;
  format: GameFormat;
  archetype?: string;
  authorName?: string;
  pokemonCount: number;
  likes: number;
  deckScore?: number;
  thumbnailCards: string[]; // IDs of featured card images
  createdAt: string;
}

/**
 * Parameters for deck generation
 */
export interface DeckGenerationParams {
  featuredCard: string; // Card ID to build around
  format: GameFormat;
  strategy?: 'aggro' | 'control' | 'combo' | 'midrange';
  budgetMax?: number;
  ownedCards?: string[]; // Card IDs the user already owns
}

/**
 * Deck generation result
 */
export interface DeckGenerationResult {
  deck: Deck;
  explanation: string; // Why the AI/algorithm made these choices
  alternatives: {
    cardId: string;
    reason: string;
    swap: string; // Card ID to swap with
  }[];
  confidence: number; // 0-100
}

/**
 * Deck import/export format
 */
export type DeckExportFormat = 'ptcgo' | 'limitless' | 'json' | 'text';

export interface DeckExport {
  format: DeckExportFormat;
  content: string;
}
