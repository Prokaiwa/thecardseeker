-- ============================================================================
-- THE CARD SEEKER - DATABASE SCHEMA
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SETS TABLE
-- Pokemon TCG expansion sets
-- ============================================================================
CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,                    -- e.g., "base1", "sv1"
    name TEXT NOT NULL,                     -- "Base Set", "Scarlet & Violet"
    series TEXT,                            -- "Base", "Scarlet & Violet"
    total_cards INTEGER,
    release_date DATE,
    legality_standard BOOLEAN DEFAULT false,
    legality_expanded BOOLEAN DEFAULT true,
    logo_url TEXT,
    symbol_url TEXT,
    ptcgo_code TEXT,                        -- For deck importing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CARDS TABLE
-- Unified card data from all sources
-- ============================================================================
CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,                    -- Canonical ID: "base1-4"
    
    -- External IDs for deduplication
    limitless_id TEXT,
    pokemontcg_id TEXT,
    pricetracker_id TEXT,
    
    -- Core attributes
    name TEXT NOT NULL,
    supertype TEXT NOT NULL,                -- Pokemon, Trainer, Energy
    subtypes TEXT[],                        -- Basic, Stage 1, Supporter, etc.
    
    -- Set info
    set_id TEXT REFERENCES sets(id),
    number TEXT,                            -- Card number in set
    
    -- Pokemon-specific
    hp INTEGER,
    types TEXT[],                           -- Fire, Water, etc.
    evolves_from TEXT,
    evolves_to TEXT[],
    
    -- Game mechanics (JSONB for flexibility)
    attacks JSONB,                          -- [{name, cost[], damage, text}]
    abilities JSONB,                        -- [{name, text, type}]
    rules TEXT[],                           -- Trainer/Energy rules
    
    -- Combat attributes
    weaknesses JSONB,                       -- [{type, value}]
    resistances JSONB,
    retreat_cost INTEGER,
    
    -- Legality
    legality_standard BOOLEAN DEFAULT true,
    legality_expanded BOOLEAN DEFAULT true,
    regulation_mark TEXT,                   -- D, E, F, G, H
    
    -- Metadata
    rarity TEXT,
    artist TEXT,
    flavor_text TEXT,
    
    -- Images
    image_small TEXT,
    image_large TEXT,
    image_source TEXT,                      -- 'limitless', 'pokemontcg', etc.
    
    -- Pricing (denormalized for performance)
    price_market DECIMAL(10,2),
    price_low DECIMAL(10,2),
    price_high DECIMAL(10,2),
    price_updated_at TIMESTAMPTZ,
    
    -- Meta statistics (computed)
    meta_usage_percent DECIMAL(5,2) DEFAULT 0,
    avg_copies_in_deck DECIMAL(3,2) DEFAULT 0,
    tournament_appearances INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_cards_search ON cards 
    USING GIN(to_tsvector('english', 
        COALESCE(name, '') || ' ' || 
        COALESCE(array_to_string(types, ' '), '') || ' ' || 
        COALESCE(array_to_string(subtypes, ' '), '') || ' ' ||
        COALESCE(supertype, '')
    ));

CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name);
CREATE INDEX IF NOT EXISTS idx_cards_set ON cards(set_id);
CREATE INDEX IF NOT EXISTS idx_cards_types ON cards USING GIN(types);
CREATE INDEX IF NOT EXISTS idx_cards_supertype ON cards(supertype);
CREATE INDEX IF NOT EXISTS idx_cards_legality ON cards(legality_standard, legality_expanded);
CREATE INDEX IF NOT EXISTS idx_cards_meta_usage ON cards(meta_usage_percent DESC);

-- ============================================================================
-- USER PROFILES
-- Extends Supabase auth.users
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    display_name TEXT,
    avatar_url TEXT,
    
    -- Subscription
    subscription_status TEXT DEFAULT 'free', -- free, premium, canceled
    subscription_expires_at TIMESTAMPTZ,
    stripe_customer_id TEXT,
    
    -- Referrals
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    
    -- Preferences
    default_format TEXT DEFAULT 'standard',
    email_notifications BOOLEAN DEFAULT true,
    
    -- Usage tracking (for free tier limits)
    ai_generations_this_month INTEGER DEFAULT 0,
    simulations_this_month INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, display_name, referral_code)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        UPPER(SUBSTRING(MD5(NEW.id::text) FOR 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- DECKS TABLE
-- User-created decks
-- ============================================================================
CREATE TABLE IF NOT EXISTS decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    format TEXT DEFAULT 'standard',         -- standard, expanded, unlimited
    
    -- Deck contents
    cards JSONB NOT NULL DEFAULT '[]',      -- [{card_id, quantity}]
    
    -- Metadata
    is_public BOOLEAN DEFAULT false,
    is_ai_generated BOOLEAN DEFAULT false,
    archetype TEXT,                         -- e.g., "Charizard ex"
    featured_pokemon TEXT,                  -- The "build around" Pokemon
    
    -- Validation cache
    is_valid BOOLEAN DEFAULT false,
    validation_errors JSONB,
    
    -- Simulation results (cached)
    sim_basic_pokemon_odds DECIMAL(5,2),
    sim_supporter_t1_odds DECIMAL(5,2),
    sim_consistency_score DECIMAL(5,2),
    sim_updated_at TIMESTAMPTZ,
    
    -- Social
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    fork_of UUID REFERENCES decks(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decks_user ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_public ON decks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_decks_format ON decks(format);
CREATE INDEX IF NOT EXISTS idx_decks_archetype ON decks(archetype);
CREATE INDEX IF NOT EXISTS idx_decks_featured ON decks(featured_pokemon);
CREATE INDEX IF NOT EXISTS idx_decks_likes ON decks(likes DESC) WHERE is_public = true;

-- ============================================================================
-- DECK LIKES (for leaderboards)
-- ============================================================================
CREATE TABLE IF NOT EXISTS deck_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, deck_id)
);

-- ============================================================================
-- TOURNAMENTS TABLE
-- From Limitless TCG
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,                    -- Limitless tournament ID
    name TEXT NOT NULL,
    game TEXT DEFAULT 'PTCG',
    format TEXT,
    date TIMESTAMPTZ,
    total_players INTEGER,
    source_url TEXT,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TOURNAMENT STANDINGS
-- With deck lists
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournament_standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
    
    placement INTEGER NOT NULL,
    player_name TEXT,
    archetype TEXT,
    deck_list JSONB,                        -- [{card_name, quantity, card_id?}]
    championship_points INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_standings_tournament ON tournament_standings(tournament_id);
CREATE INDEX IF NOT EXISTS idx_standings_archetype ON tournament_standings(archetype);

-- ============================================================================
-- META ARCHETYPES
-- Aggregated meta data
-- ============================================================================
CREATE TABLE IF NOT EXISTS meta_archetypes (
    id TEXT PRIMARY KEY,                    -- e.g., "charizard-ex"
    name TEXT NOT NULL,                     -- "Charizard ex"
    icons TEXT[],                           -- Pokemon icons
    
    core_cards JSONB,                       -- [{card_id, avg_count, appearance_rate}]
    
    tournament_wins INTEGER DEFAULT 0,
    top_8_placements INTEGER DEFAULT 0,
    total_appearances INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2),
    
    tier TEXT,                              -- S, A, B, C
    meta_share DECIMAL(5,2),
    
    sample_deck_id UUID REFERENCES decks(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRICE HISTORY
-- Rolling 90-day window
-- ============================================================================
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    card_id TEXT REFERENCES cards(id) ON DELETE CASCADE,
    
    market_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    high_price DECIMAL(10,2),
    
    source TEXT DEFAULT 'pricetracker',
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    UNIQUE(card_id, source, recorded_date)
);

CREATE INDEX IF NOT EXISTS idx_price_history_card ON price_history(card_id, recorded_date DESC);

-- ============================================================================
-- COLLECTIONS (Premium feature)
-- ============================================================================
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'My Collection',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    card_id TEXT REFERENCES cards(id) ON DELETE CASCADE,
    
    quantity INTEGER DEFAULT 1,
    condition TEXT DEFAULT 'nm',            -- nm, lp, mp, hp, dmg
    is_foil BOOLEAN DEFAULT false,
    purchase_price DECIMAL(10,2),
    
    UNIQUE(collection_id, card_id, condition, is_foil)
);

-- ============================================================================
-- PRICE ALERTS (Premium feature)
-- ============================================================================
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    card_id TEXT REFERENCES cards(id) ON DELETE CASCADE,
    
    alert_type TEXT NOT NULL,               -- below, above
    target_price DECIMAL(10,2) NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON price_alerts(card_id, is_active) WHERE is_active = true;

-- ============================================================================
-- CARD SYNERGIES
-- Computed from tournament data
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_synergies (
    card_a_id TEXT REFERENCES cards(id) ON DELETE CASCADE,
    card_b_id TEXT REFERENCES cards(id) ON DELETE CASCADE,
    
    synergy_score DECIMAL(5,2),             -- 0-100
    cooccurrence_count INTEGER,
    synergy_type TEXT,                      -- evolution, ability, type, meta
    
    PRIMARY KEY (card_a_id, card_b_id)
);

CREATE INDEX IF NOT EXISTS idx_synergies_a ON card_synergies(card_a_id, synergy_score DESC);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER decks_updated_at BEFORE UPDATE ON decks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sets_updated_at BEFORE UPDATE ON sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update deck likes count
CREATE OR REPLACE FUNCTION update_deck_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE decks SET likes = likes + 1 WHERE id = NEW.deck_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE decks SET likes = likes - 1 WHERE id = OLD.deck_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deck_likes_count
    AFTER INSERT OR DELETE ON deck_likes
    FOR EACH ROW EXECUTE FUNCTION update_deck_likes_count();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Decks: Public readable, own editable
CREATE POLICY "Public decks are viewable by everyone" ON decks
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own decks" ON decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decks" ON decks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own decks" ON decks
    FOR DELETE USING (auth.uid() = user_id);

-- Deck likes: Own only
CREATE POLICY "Users can manage own likes" ON deck_likes
    FOR ALL USING (auth.uid() = user_id);

-- Collections: Own only
CREATE POLICY "Users can manage own collections" ON collections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collection cards" ON collection_cards
    FOR ALL USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

-- Price alerts: Own only
CREATE POLICY "Users can manage own alerts" ON price_alerts
    FOR ALL USING (auth.uid() = user_id);

-- Cards, Sets, Tournaments: Public read (no auth required)
-- These don't need RLS - they're public data
