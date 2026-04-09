// ============================================================================
// TEST API ROUTE
// Quick test endpoint to verify adapters are working
// Access at: http://localhost:3000/api/test
// ============================================================================

import { NextResponse } from 'next/server';
import {
  // TCGdex (Card data - FREE)
  fetchAllSets,
  fetchCard,
  searchCards,
  fetchTypes,
  transformTcgdexCard,
  // Limitless (Tournament data - FREE)
  fetchGames,
  fetchTournaments,
  fetchTournamentStandings,
} from '@/lib/ingestion';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get('test') || 'all';
  
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    test,
    dataSources: {
      tcgdex: 'FREE - Card data, images, prices',
      limitless: 'FREE - Tournaments, meta, decklists',
    },
  };

  try {
    // Test TCGdex API (Card data)
    if (test === 'all' || test === 'tcgdex') {
      console.log('Testing TCGdex API...');
      
      results.tcgdex = {};

      // Test fetching sets
      const setsResponse = await fetchAllSets();
      if (setsResponse.error) {
        results.tcgdex = {
          ...results.tcgdex as object,
          sets: { error: setsResponse.error },
        };
      } else {
        results.tcgdex = {
          ...results.tcgdex as object,
          sets: {
            count: setsResponse.data?.length || 0,
            sample: setsResponse.data?.slice(0, 3).map(s => ({ 
              id: s.id, 
              name: s.name 
            })),
          },
        };
      }

      // Test fetching types
      const typesResponse = await fetchTypes();
      if (typesResponse.data) {
        results.tcgdex = {
          ...results.tcgdex as object,
          types: typesResponse.data,
        };
      }

      // Test searching cards by name
      const cardsResponse = await searchCards({ name: 'Charizard' });
      if (cardsResponse.error) {
        results.tcgdex = {
          ...results.tcgdex as object,
          cardSearch: { error: cardsResponse.error },
        };
      } else {
        results.tcgdex = {
          ...results.tcgdex as object,
          cardSearch: {
            count: cardsResponse.data?.length || 0,
            sample: cardsResponse.data?.slice(0, 5).map(c => ({
              id: c.id,
              name: c.name,
              image: c.image,
            })),
          },
        };
      }

      // Test fetching a specific card with full details
      if (cardsResponse.data && cardsResponse.data.length > 0) {
        const cardId = cardsResponse.data[0].id;
        const cardResponse = await fetchCard(cardId);
        
        if (cardResponse.data) {
          // Transform to our internal type
          const transformed = transformTcgdexCard(cardResponse.data);
          
          results.tcgdex = {
            ...results.tcgdex as object,
            sampleCard: {
              raw: {
                id: cardResponse.data.id,
                name: cardResponse.data.name,
                hp: cardResponse.data.hp,
                types: cardResponse.data.types,
                attacks: cardResponse.data.attacks?.length || 0,
                image: cardResponse.data.image,
                pricing: cardResponse.data.pricing ? 'Available' : 'None',
              },
              transformed: {
                id: transformed.id,
                name: transformed.name,
                hp: transformed.hp,
                types: transformed.types,
                attacks: transformed.attacks?.length || 0,
                imageSmall: transformed.imageSmall,
                priceMarket: transformed.priceMarket,
              },
            },
          };
        }
      }
    }

    // Test Limitless API (Tournament data)
    if (test === 'all' || test === 'limitless') {
      console.log('Testing Limitless TCG API...');
      
      results.limitless = {};

      // Test fetching games
      const gamesResponse = await fetchGames();
      if (gamesResponse.error) {
        results.limitless = { games: { error: gamesResponse.error } };
      } else {
        const ptcg = gamesResponse.data?.find(g => g.id === 'PTCG');
        results.limitless = {
          games: {
            count: gamesResponse.data?.length || 0,
            ptcgFormats: ptcg?.formats,
          },
        };
      }

      // Test fetching tournaments
      const tournamentsResponse = await fetchTournaments({ 
        game: 'PTCG', 
        format: 'STANDARD',
        limit: 3 
      });
      if (tournamentsResponse.error) {
        results.limitless = {
          ...results.limitless as object,
          tournaments: { error: tournamentsResponse.error },
        };
      } else {
        const tournaments = tournamentsResponse.data?.items || [];
        results.limitless = {
          ...results.limitless as object,
          tournaments: {
            count: tournaments.length,
            sample: tournaments.map(t => ({
              id: t.id,
              name: t.name,
              players: t.players,
              date: t.date,
            })),
          },
        };

        // Test fetching standings for first tournament
        if (tournaments[0]) {
          const standingsResponse = await fetchTournamentStandings(tournaments[0].id);
          if (standingsResponse.error) {
            results.limitless = {
              ...results.limitless as object,
              standings: { error: standingsResponse.error },
            };
          } else {
            const standings = standingsResponse.data || [];
            const topStandings = standings.slice(0, 3);
            results.limitless = {
              ...results.limitless as object,
              standings: {
                tournamentId: tournaments[0].id,
                totalPlayers: standings.length,
                top3: topStandings.map(s => ({
                  placing: s.placing,
                  player: s.name,
                  deck: s.deck?.name || 'Unknown',
                  record: `${s.record.wins}-${s.record.losses}-${s.record.ties}`,
                  hasDecklist: !!s.decklist,
                })),
              },
            };
          }
        }
      }
    }

    results.success = true;
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      ...results,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
