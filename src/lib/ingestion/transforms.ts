// ============================================================================
// DATA TRANSFORMATION
// Converts raw API data to our internal schema types
// ============================================================================

import type { Card, CardAttack, CardAbility, CardWeakness, EnergyType } from '@/types';
import type { TcgdexCard, TcgdexAttack, TcgdexAbility } from './adapters/tcgdex';
import type { LimitlessDecklistCard } from './types';

// ============================================================================
// ENERGY TYPE MAPPING
// ============================================================================

const ENERGY_TYPE_MAP: Record<string, EnergyType> = {
  'Fire': 'fire',
  'Water': 'water',
  'Grass': 'grass',
  'Lightning': 'electric',
  'Electric': 'electric',
  'Psychic': 'psychic',
  'Fighting': 'fighting',
  'Darkness': 'dark',
  'Dark': 'dark',
  'Metal': 'steel',
  'Steel': 'steel',
  'Fairy': 'fairy',
  'Dragon': 'dragon',
  'Colorless': 'colorless',
  'Normal': 'normal',
};

/**
 * Convert API energy type string to our EnergyType
 */
function normalizeEnergyType(type: string): EnergyType {
  return ENERGY_TYPE_MAP[type] || 'colorless';
}

/**
 * Convert array of energy type strings
 */
function normalizeEnergyTypes(types: string[] | undefined): EnergyType[] {
  if (!types) return [];
  return types.map(normalizeEnergyType);
}

// ============================================================================
// TCGDEX → INTERNAL CARD
// ============================================================================

/**
 * Transform a TCGdex card to our internal Card type
 */
export function transformTcgdexCard(apiCard: TcgdexCard): Card {
  // Transform attacks
  const attacks: CardAttack[] = (apiCard.attacks || []).map(attack => ({
    name: attack.name,
    cost: normalizeEnergyTypes(attack.cost),
    damage: String(attack.damage || ''),
    text: attack.effect || '',
  }));

  // Transform abilities
  const abilities: CardAbility[] = (apiCard.abilities || []).map(ability => ({
    name: ability.name,
    text: ability.effect,
    type: ability.type as CardAbility['type'],
  }));

  // Transform weaknesses
  const weaknesses: CardWeakness[] = (apiCard.weaknesses || []).map(w => ({
    type: normalizeEnergyType(w.type),
    value: w.value,
  }));

  // Transform resistances
  const resistances: CardWeakness[] = (apiCard.resistances || []).map(r => ({
    type: normalizeEnergyType(r.type),
    value: r.value,
  }));

  // Get best available price
  const tcgplayerPrices = apiCard.pricing?.tcgplayer;
  const priceData = tcgplayerPrices?.normal || tcgplayerPrices?.holofoil || tcgplayerPrices?.reverse;
  
  const cardmarketPrices = apiCard.pricing?.cardmarket;

  // Determine supertype from category
  const supertype = apiCard.category as Card['supertype'];
  
  // Determine subtypes
  const subtypes: Card['subtypes'] = [];
  if (apiCard.stage) {
    subtypes.push(apiCard.stage as Card['subtypes'][number]);
  }
  if (apiCard.suffix) {
    subtypes.push(apiCard.suffix as Card['subtypes'][number]);
  }
  if (apiCard.trainerType) {
    subtypes.push(apiCard.trainerType as Card['subtypes'][number]);
  }
  if (apiCard.energyType) {
    subtypes.push(apiCard.energyType === 'Basic' ? 'Basic Energy' : 'Special Energy');
  }

  return {
    // Identifiers
    id: apiCard.id,
    
    // Core attributes
    name: apiCard.name,
    supertype,
    subtypes,
    
    // Set information
    setId: apiCard.set.id,
    setName: apiCard.set.name,
    number: String(apiCard.localId),
    
    // Pokemon-specific
    hp: apiCard.hp,
    types: normalizeEnergyTypes(apiCard.types),
    evolvesFrom: apiCard.evolveFrom,
    evolvesTo: undefined, // TCGdex doesn't provide this
    
    // Game mechanics
    attacks: attacks.length > 0 ? attacks : undefined,
    abilities: abilities.length > 0 ? abilities : undefined,
    rules: apiCard.effect ? [apiCard.effect] : undefined,
    
    // Combat attributes
    weaknesses: weaknesses.length > 0 ? weaknesses : undefined,
    resistances: resistances.length > 0 ? resistances : undefined,
    retreatCost: apiCard.retreat,
    
    // Legality
    legalityStandard: apiCard.legal?.standard ?? false,
    legalityExpanded: apiCard.legal?.expanded ?? false,
    regulationMark: apiCard.regulationMark,
    
    // Metadata
    rarity: apiCard.rarity as Card['rarity'],
    artist: apiCard.illustrator,
    flavorText: apiCard.description,
    language: 'en',
    
    // Images
    imageSmall: apiCard.image ? `${apiCard.image}/low` : '',
    imageLarge: apiCard.image ? `${apiCard.image}/high` : '',
    imageSource: 'tcgdex',
    
    // Pricing (TCGPlayer USD)
    priceMarket: priceData?.marketPrice,
    priceLow: priceData?.lowPrice,
    priceHigh: priceData?.highPrice,
    priceUpdatedAt: tcgplayerPrices?.updated || cardmarketPrices?.updated,
    
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: apiCard.updated || new Date().toISOString(),
  };
}

/**
 * Transform multiple cards
 */
export function transformTcgdexCards(apiCards: TcgdexCard[]): Card[] {
  return apiCards.map(transformTcgdexCard);
}

// ============================================================================
// LIMITLESS DECKLIST → INTERNAL FORMAT
// ============================================================================

/**
 * Represents a card reference from a decklist
 */
export interface DecklistCardReference {
  name: string;
  count: number;
  setCode?: string;
  setNumber?: string;
  /** Constructed ID for lookup (e.g., "sv1-123") */
  lookupId?: string;
}

/**
 * Transform Limitless decklist cards to our internal reference format
 */
export function transformLimitlessDecklist(
  decklistCards: LimitlessDecklistCard[]
): DecklistCardReference[] {
  return decklistCards.map(card => ({
    name: card.name,
    count: card.count,
    setCode: card.set,
    setNumber: card.number,
    // Construct a lookup ID if we have set and number
    lookupId: card.set && card.number 
      ? `${card.set.toLowerCase()}-${card.number}` 
      : undefined,
  }));
}

// ============================================================================
// DECKLIST TEXT FORMAT PARSING
// ============================================================================

/**
 * Parse PTCGO/PTCGL deck list text format
 * Example:
 * Pokémon: 15
 * 4 Comfey LOR 79
 * 3 Sableye LOR 70
 * ...
 */
export function parsePtcgoDecklist(text: string): DecklistCardReference[] {
  const cards: DecklistCardReference[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Skip section headers and empty lines
    if (!line.trim() || line.includes(':') || line.startsWith('#')) {
      continue;
    }
    
    // Match pattern: "4 Comfey LOR 79" or "4 Boss's Orders BRS 132"
    const match = line.match(/^(\d+)\s+(.+?)\s+([A-Z]{2,4})\s+(\d+)$/i);
    
    if (match) {
      cards.push({
        count: parseInt(match[1], 10),
        name: match[2].trim(),
        setCode: match[3].toUpperCase(),
        setNumber: match[4],
        lookupId: `${match[3].toLowerCase()}-${match[4]}`,
      });
    } else {
      // Try simpler pattern without set info: "4 Comfey"
      const simpleMatch = line.match(/^(\d+)\s+(.+)$/);
      if (simpleMatch) {
        cards.push({
          count: parseInt(simpleMatch[1], 10),
          name: simpleMatch[2].trim(),
        });
      }
    }
  }
  
  return cards;
}

/**
 * Export deck to PTCGO format
 */
export function exportToPtcgoFormat(
  cards: DecklistCardReference[],
  deckName?: string
): string {
  const pokemon: string[] = [];
  const trainers: string[] = [];
  const energy: string[] = [];
  
  // This is a simplified version - would need card type info for proper categorization
  for (const card of cards) {
    const line = card.setCode && card.setNumber
      ? `${card.count} ${card.name} ${card.setCode} ${card.setNumber}`
      : `${card.count} ${card.name}`;
    
    // Simple heuristic for categorization
    if (card.name.toLowerCase().includes('energy')) {
      energy.push(line);
    } else if (
      card.name.includes('ex') || 
      card.name.includes('V') ||
      !card.name.includes("'s")
    ) {
      // Rough heuristic: cards with ex, V, or without 's are probably Pokemon
      pokemon.push(line);
    } else {
      trainers.push(line);
    }
  }
  
  const sections: string[] = [];
  
  if (deckName) {
    sections.push(`****** ${deckName} ******`);
    sections.push('');
  }
  
  if (pokemon.length > 0) {
    sections.push(`Pokémon: ${pokemon.length}`);
    sections.push(...pokemon);
    sections.push('');
  }
  
  if (trainers.length > 0) {
    sections.push(`Trainer: ${trainers.length}`);
    sections.push(...trainers);
    sections.push('');
  }
  
  if (energy.length > 0) {
    sections.push(`Energy: ${energy.length}`);
    sections.push(...energy);
  }
  
  return sections.join('\n');
}

// ============================================================================
// META STATISTICS HELPERS
// ============================================================================

/**
 * Calculate deck archetype from a list of cards
 * This is a simplified version - Limitless provides this automatically
 */
export function inferDeckArchetype(cards: DecklistCardReference[]): string | null {
  // Look for key Pokemon that typically define archetypes
  const keyPokemon = [
    'Charizard ex',
    'Gardevoir ex', 
    'Lugia VSTAR',
    'Miraidon ex',
    'Roaring Moon ex',
    'Chien-Pao ex',
    'Lost Zone Box',
    'Sableye',
    'Comfey',
  ];
  
  for (const pokemon of keyPokemon) {
    const found = cards.find(c => 
      c.name.toLowerCase().includes(pokemon.toLowerCase())
    );
    if (found && found.count >= 2) {
      return pokemon;
    }
  }
  
  // Check for Lost Zone toolbox
  const hasComfey = cards.some(c => c.name.includes('Comfey'));
  const hasSableye = cards.some(c => c.name.includes('Sableye'));
  if (hasComfey && hasSableye) {
    return 'Lost Zone Box';
  }
  
  return null;
}
