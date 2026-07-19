-- AirStudio Async Multiplayer Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    players UUID[] NOT NULL DEFAULT '{}',
    state JSONB NOT NULL DEFAULT '{}',
    current_turn INTEGER NOT NULL DEFAULT 1,
    current_player UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'finished')),
    winner UUID REFERENCES auth.users(id),
    turn_timeout INTEGER DEFAULT 0, -- seconds, 0 = no timeout
    max_players INTEGER NOT NULL DEFAULT 2 CHECK (max_players BETWEEN 2 AND 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);

-- Indexes for games
CREATE INDEX IF NOT EXISTS idx_games_players ON games USING GIN (players);
CREATE INDEX IF NOT EXISTS idx_games_status ON games (status);
CREATE INDEX IF NOT EXISTS idx_games_current_player ON games (current_player);
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON games (updated_at DESC);

-- Game events table (audit trail)
CREATE TABLE IF NOT EXISTS game_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'turn_started', 'turn_ended', 'chat_message', 'game_started', 'game_finished', 'player_joined', 'player_left', 'forfeit'
    player_id UUID REFERENCES auth.users(id),
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events (game_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_events_player_id ON game_events (player_id);
CREATE INDEX IF NOT EXISTS idx_game_events_type ON game_events (event_type);

-- Game chat messages
CREATE TABLE IF NOT EXISTS game_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_chat_game_id ON game_chat (game_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_chat_player_id ON game_chat (player_id);

-- Game invitations
CREATE TABLE IF NOT EXISTS game_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    from_player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    to_player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invitations_to_player ON game_invitations (to_player_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_game_id ON game_invitations (game_id);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Games: players can read/update games they're part of
CREATE POLICY "Players can read their games" ON games
    FOR SELECT USING (auth.uid() = ANY(players));

CREATE POLICY "Players can update their games" ON games
    FOR UPDATE USING (auth.uid() = ANY(players));

CREATE POLICY "Authenticated users can create games" ON games
    FOR INSERT WITH CHECK (auth.uid() = ANY(players));

-- Game events: players can read events for their games
CREATE POLICY "Players can read game events" ON game_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM games 
            WHERE games.id = game_events.game_id 
            AND auth.uid() = ANY(games.players)
        )
    );

CREATE POLICY "Players can insert game events" ON game_events
    FOR INSERT WITH CHECK (
        auth.uid() = player_id AND
        EXISTS (
            SELECT 1 FROM games 
            WHERE games.id = game_events.game_id 
            AND auth.uid() = ANY(games.players)
        )
    );

-- Chat: players can read/send chat in their games
CREATE POLICY "Players can read chat" ON game_chat
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM games 
            WHERE games.id = game_chat.game_id 
            AND auth.uid() = ANY(games.players)
        )
    );

CREATE POLICY "Players can send chat" ON game_chat
    FOR INSERT WITH CHECK (
        auth.uid() = player_id AND
        EXISTS (
            SELECT 1 FROM games 
            WHERE games.id = game_chat.game_id 
            AND auth.uid() = ANY(games.players)
        )
    );

CREATE POLICY "Players can mark read" ON game_chat
    FOR UPDATE USING (
        auth.uid() = player_id AND
        EXISTS (
            SELECT 1 FROM games 
            WHERE games.id = game_chat.game_id 
            AND auth.uid() = ANY(games.players)
        )
    );

-- Invitations: users can see their own invitations
CREATE POLICY "Users can read their invitations" ON game_invitations
    FOR SELECT USING (auth.uid() = to_player_id OR auth.uid() = from_player_id);

CREATE POLICY "Users can create invitations" ON game_invitations
    FOR INSERT WITH CHECK (auth.uid() = from_player_id);

CREATE POLICY "Users can respond to invitations" ON game_invitations
    FOR UPDATE USING (auth.uid() = to_player_id);

-- Helper function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if user is in game
CREATE OR REPLACE FUNCTION is_player_in_game(game_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM games 
        WHERE id = game_uuid 
        AND user_uuid = ANY(players)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if it's user's turn
CREATE OR REPLACE FUNCTION is_my_turn(game_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM games 
        WHERE id = game_uuid 
        AND current_player = user_uuid
        AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to advance turn
CREATE OR REPLACE FUNCTION advance_turn(game_uuid UUID, next_player UUID, turn_data JSONB, next_turn INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE games 
    SET 
        current_player = next_player,
        current_turn = next_turn,
        state = state || turn_data,
        updated_at = NOW()
    WHERE id = game_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finish game
CREATE OR REPLACE FUNCTION finish_game(game_uuid UUID, winner_id UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    UPDATE games 
    SET 
        status = 'finished',
        winner = winner_id,
        finished_at = NOW(),
        updated_at = NOW()
    WHERE id = game_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;