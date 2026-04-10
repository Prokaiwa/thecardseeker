# Limitless TCG API Reference

> Quick reference for the Limitless TCG data adapter.
> Full docs: https://docs.limitlesstcg.com/developer

---

## Overview

| Property | Value |
|----------|-------|
| **Base URL** | `https://play.limitlesstcg.com/api` |
| **Auth** | **NO API KEY REQUIRED** (except `/games/{id}/decks`) |
| **Rate Limits** | Check response headers, be respectful (we use 2 req/sec) |
| **Format** | JSON responses |

### What Limitless Provides
- ✅ Tournament data (results, standings, brackets)
- ✅ Decklists from tournaments
- ✅ Meta archetypes and deck categorization
- ✅ Match/pairing history

### What Limitless Does NOT Provide
- ❌ Card database (use Pokemon TCG API)
- ❌ Card images (use Pokemon TCG API)
- ❌ Card details like attacks/abilities (use Pokemon TCG API)

---

## Endpoints

### GET /games

Returns all supported games.

```bash
curl https://play.limitlesstcg.com/api/games
```

**Response:**
```json
[
  {
    "id": "PTCG",
    "name": "Pokémon TCG",
    "formats": {
      "STANDARD": "Standard",
      "EXPANDED": "Expanded",
      "GLC": "Gym Leader Challenge"
    },
    "platforms": {
      "PTCGL": "Pokémon TCG Live",
      "PTCGO": "Pokémon TCG Online"
    },
    "metagame": true
  }
]
```

---

### GET /games/{id}/decks

Returns deck archetype rules for categorization.

> ⚠️ **May require API key** - apply if needed

```bash
curl https://play.limitlesstcg.com/api/games/PTCG/decks
```

**Response:**
```json
[
  {
    "identifier": "charizard-ex",
    "name": "Charizard ex",
    "icons": ["charizard"],
    "priority": 10,
    "cards": [
      { "name": "Charizard ex", "count": "2" }
    ],
    "variants": [
      {
        "identifier": "charizard-pidgeot",
        "name": "Charizard Pidgeot",
        "icon": "pidgeot",
        "cards": [
          { "name": "Pidgeot ex", "count": "2" }
        ]
      }
    ],
    "generation": 9
  }
]
```

---

### GET /tournaments

Returns list of tournaments with basic info.

```bash
curl "https://play.limitlesstcg.com/api/tournaments?game=PTCG&format=STANDARD&limit=10"
```

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `game` | string | Game ID (use "PTCG") |
| `format` | string | "STANDARD", "EXPANDED", etc. |
| `organizerId` | number | Filter by organizer |
| `limit` | number | Results per page (default: 50) |
| `page` | number | Page number for pagination |

**Response:**
```json
[
  {
    "id": "63fcb6d32fb42a11441fb777",
    "game": "PTCG",
    "format": "STANDARD",
    "name": "Limitless Showdown - March",
    "date": "2024-03-15T15:00:00.000Z",
    "players": 256
  }
]
```

---

### GET /tournaments/{id}/details

Returns full tournament details.

```bash
curl https://play.limitlesstcg.com/api/tournaments/63fcb6d32fb42a11441fb777/details
```

**Response:**
```json
{
  "id": "63fcb6d32fb42a11441fb777",
  "game": "PTCG",
  "format": "STANDARD",
  "name": "Limitless Showdown - March",
  "date": "2024-03-15T15:00:00.000Z",
  "players": 256,
  "organizer": {
    "id": 1,
    "name": "Limitless TCG",
    "logo": "https://..."
  },
  "decklists": true,
  "isPublic": true,
  "isOnline": true,
  "phases": [
    { "phase": 1, "type": "SWISS", "rounds": 9, "mode": "BO1" },
    { "phase": 2, "type": "SINGLE_BRACKET", "rounds": 1, "mode": "BO3" }
  ]
}
```

---

### GET /tournaments/{id}/standings

Returns player standings with decklists (if available).

```bash
curl https://play.limitlesstcg.com/api/tournaments/63fcb6d32fb42a11441fb777/standings
```

**Response:**
```json
[
  {
    "player": "espel",
    "name": "Tsubasa Shimizu",
    "country": "JP",
    "placing": 1,
    "record": {
      "wins": 13,
      "losses": 2,
      "ties": 0
    },
    "decklist": [
      { "count": 3, "name": "Charizard ex", "set": "OBF", "number": "125" },
      { "count": 4, "name": "Charmander", "set": "MEW", "number": "4" }
    ],
    "deck": {
      "id": "charizard-ex",
      "name": "Charizard ex",
      "icons": ["charizard"]
    },
    "drop": null
  }
]
```

---

### GET /tournaments/{id}/pairings

Returns all matches played in the tournament.

```bash
curl https://play.limitlesstcg.com/api/tournaments/63fcb6d32fb42a11441fb777/pairings
```

**Response:**
```json
[
  {
    "round": 1,
    "phase": 1,
    "table": 1,
    "player1": "player123",
    "player2": "player456",
    "winner": "player123"
  },
  {
    "round": 10,
    "phase": 2,
    "match": "T2-1",
    "player1": "semifinal_winner1",
    "player2": "semifinal_winner2",
    "winner": "semifinal_winner1"
  }
]
```

**Winner values:**
- `"playerid"` - That player won
- `0` - Tie
- `-1` - Double loss

---

## Our Implementation

### File Structure

```
src/lib/ingestion/
├── types.ts              # Shared types
├── fetch.ts              # Rate-limited fetch utilities
├── index.ts              # Exports
└── adapters/
    ├── pokemontcg.ts     # Card data (images, attacks, etc.)
    └── limitless.ts      # Tournament & meta data
```

### Key Functions

```typescript
import {
  // Tournaments
  fetchTournaments,
  fetchTournamentDetails,
  fetchTournamentStandings,
  fetchFullTournament,
  
  // Meta analysis
  analyzeDeckUsage,
  getTopDecks,
  
  // Games
  fetchGames,
  fetchDeckArchetypes,
} from '@/lib/ingestion';
```

### Usage Example

```typescript
// Fetch recent Standard tournaments
const tournaments = await fetchTournaments({
  game: 'PTCG',
  format: 'STANDARD',
  limit: 10,
});

// Get standings with decklists
const standings = await fetchTournamentStandings(tournaments.data.items[0].id);

// Analyze deck usage
const deckStats = analyzeDeckUsage(standings.data);
console.log(deckStats);
// [{ deckId: 'charizard-ex', deckName: 'Charizard ex', count: 15, ... }]
```

---

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐
│   Limitless     │     │  Pokemon TCG    │
│      API        │     │      API        │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ Tournaments           │ Cards
         │ Standings             │ Images
         │ Decklists             │ Attacks
         │ Meta archetypes       │ Abilities
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
            ┌────────────────┐
            │    Supabase    │
            │   PostgreSQL   │
            │                │
            │ • cards        │
            │ • tournaments  │
            │ • standings    │
            │ • meta_stats   │
            └────────────────┘
```

---

## Sync Strategy

### Initial Sync
1. Fetch last 6 months of tournaments from Limitless
2. Extract all unique cards from decklists
3. Fetch card details from Pokemon TCG API
4. Compute meta statistics

### Daily Sync (Cron Job)
```typescript
// /api/cron/sync-tournaments
async function syncTournaments() {
  // 1. Get new tournaments from last 24 hours
  const tournaments = await fetchTournaments({ limit: 50 });
  
  // 2. Save new tournaments and standings
  for (const tournament of newTournaments) {
    const data = await fetchFullTournament(tournament.id);
    await saveTournamentData(data);
  }
  
  // 3. Recompute meta statistics
  await recomputeMetaStats();
}
```

---

## Caching Strategy

| Data | Cache Duration | Reason |
|------|----------------|--------|
| Tournament list | 1 hour | New tournaments added frequently |
| Tournament details | 24 hours | Finalized once ended |
| Standings | 24 hours | Finalized data |
| Deck archetypes | 7 days | Rarely changes |
| Meta statistics | 6 hours | Recomputed regularly |

---

## Testing

```bash
# Test games endpoint
curl https://play.limitlesstcg.com/api/games

# Test recent tournaments
curl "https://play.limitlesstcg.com/api/tournaments?game=PTCG&format=STANDARD&limit=5"

# Test specific tournament
curl https://play.limitlesstcg.com/api/tournaments/63fcb6d32fb42a11441fb777/details

# Test standings
curl https://play.limitlesstcg.com/api/tournaments/63fcb6d32fb42a11441fb777/standings
```

---

## Key Constants

```typescript
// Game IDs
const POKEMON_TCG_GAME_ID = 'PTCG';

// Format IDs
const FORMATS = {
  STANDARD: 'STANDARD',
  EXPANDED: 'EXPANDED',
  GLC: 'GLC',
};
```

---

*Last Updated: Corrected to reflect current API (no key required)*
