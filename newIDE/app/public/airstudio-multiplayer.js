/**
 * AirStudio Async Multiplayer - Parent App Integration
 * 
 * This module handles ALL Supabase communication and turn management.
 * The AirStudio iframe ONLY receives state updates and fires events.
 * 
 * Usage:
 * import { AirStudioMultiplayer } from './airstudio-multiplayer.js';
 * 
 * const multiplayer = new AirStudioMultiplayer({
 *   supabaseUrl: 'https://xxx.supabase.co',
 *   supabaseAnonKey: 'xxx',
 *   editorOrigin: 'https://editor.yourapp.com'
 * });
 * 
 * multiplayer.init();
 * multiplayer.setEditorWindow(iframe.contentWindow);
 * 
 * // Listen for events from AirStudio
 * multiplayer.on('TURN_ENDED', async ({ gameId, turnData, nextPlayerId }) => {
 *   await saveTurnToSupabase(gameId, turnData);
 *   await notifyPlayer(nextPlayerId, 'Your turn!');
 * });
 * 
 * multiplayer.on('GAME_STARTED', ({ gameId, players }) => {
 *   // Game created in Supabase
 * });
 */

class AirStudioMultiplayer {
  constructor(config) {
    this.config = {
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      editorOrigin: config.editorOrigin || 'https://editor.yourapp.com',
      turnTimeout: config.turnTimeout || 0,
      ...config
    };
    
    this.supabase = null;
    this.editorWindow = null;
    this.games = new Map(); // gameId -> game state
    this.listeners = new Map(); // event type -> handlers[]
    this.initialized = false;
  }
  
  /**
   * Initialize the multiplayer system
   */
  async init() {
    if (this.initialized) return;
    
    // Load Supabase dynamically
    const { createClient } = await import('@supabase/supabase-js');
    this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
    
    // Listen for messages from AirStudio iframe
    window.addEventListener('message', this._handleMessage.bind(this));
    
    // Set up Supabase Realtime for games table
    this._setupRealtimeSubscriptions();
    
    this.initialized = true;
    console.log('[AirStudioMultiplayer] Initialized');
  }
  
  /**
   * Set the iframe element or window reference
   */
  setEditorWindow(editorWindow) {
    this.editorWindow = editorWindow;
  }
  
  /**
   * Send command to AirStudio iframe
   */
  sendCommand(type, payload = {}) {
    if (this.editorWindow) {
      this.editorWindow.postMessage({ type, payload }, this.config.editorOrigin);
    }
  }
  
  /**
   * Event listener registration
   */
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
  }
  
  off(event, handler) {
    if (this.listeners.has(event)) {
      const handlers = this.listeners.get(event);
      const index = handlers.indexOf(handler);
      if (index !== -1) handlers.splice(index, 1);
    }
  }
  
  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error(`[AirStudioMultiplayer] Error in ${event} handler:`, e);
        }
      });
    }
  }
  
  /**
   * Handle messages from AirStudio iframe
   * AirStudio ONLY fires events - host does ALL the work
   */
  async _handleMessage(event) {
    if (event.origin !== this.config.editorOrigin) return;
    if (!event.data || !event.data.type) return;
    
    const { type, payload } = event.data;
    
    switch (type) {
      case 'READY':
        console.log('[AirStudioMultiplayer] Editor ready', payload);
        this._emit('READY', payload);
        break;
        
      case 'PROJECT_CREATED':
      case 'PROJECT_LOADED':
      case 'PROJECT_SAVED':
      case 'PROJECT_EXPORTED':
        this._emit(type, payload);
        break;
        
      // Events fired by AirStudio (host does the work)
      case 'GAME_STARTED':
        await this._handleGameStarted(payload);
        break;
        
      case 'TURN_ENDED':
        await this._handleTurnEnded(payload);
        break;
        
      case 'PLAYER_JOINED':
        await this._handlePlayerJoined(payload);
        break;
        
      case 'PLAYER_LEFT':
        await this._handlePlayerLeft(payload);
        break;
        
      case 'CHAT_MESSAGE':
        this._emit('CHAT_MESSAGE', payload);
        break;
        
      case 'INVITATION_SENT':
      case 'INVITATION_ACCEPTED':
      case 'INVITATION_DECLINED':
        this._emit(type, payload);
        break;
        
      case 'FORFEIT_TURN':
      this._emit(type, payload);
        break;
        
      case 'GAME_STATE_SYNC':
        await this._handleGameStateSync(payload);
        break;
        
      case 'GAME_FINISHED':
        await this._handleGameFinished(payload);
        break;
        
      case 'ERROR':
        console.error('[AirStudioMultiplayer] Editor error:', payload);
        this._emit('ERROR', payload);
        break;
    }
  }
  
  /**
   * Handle turn ended - save to Supabase, notify next player
   */
  async _handleTurnEnded(payload) {
    const { gameId, nextPlayerId, gameState, turn, timestamp } = payload;
    
    // Save game state to Supabase
    const { error } = await this.supabase
      .from('games')
      .upsert({
        id: gameId,
        state: gameState,
        current_turn: turn,
        current_player: nextPlayerId,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('[AirStudioMultiplayer] Failed to save game state:', error);
      return;
    }
    
    // Update local cache
    const game = this.games.get(gameId);
    if (game) {
      game.state = gameState;
      game.currentTurn = turn;
      game.currentPlayer = nextPlayerId;
      game.updatedAt = new Date();
    }
    
    // Emit event for parent app to handle notifications
    this._emit('GAME_TURN_ENDED', {
      gameId,
      nextPlayerId,
      gameState,
      turn,
      timestamp
    });
  }
  
  async _handleGameStarted(payload) {
    const { gameId, players, initialState } = payload;
    
    const { error } = await this.supabase
      .from('games')
      .insert({
        id: gameId,
        players: players,
        state: initialState || {},
        current_turn: 1,
        current_player: players[0],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    
    if (!error) {
      this.games.set(gameId, {
        id: gameId,
        players,
        state: initialState || {},
        currentTurn: 1,
        currentPlayer: players[0],
        status: 'active',
      });
    }
    
    this._emit('GAME_STARTED', payload);
  }
  
  async _handlePlayerJoined(payload) {
    const { gameId, playerId } = payload;
    const game = this.games.get(gameId);
    if (game && !game.players.includes(playerId)) {
      game.players.push(playerId);
      await this.supabase
        .from('games')
        .update({ players: game.players })
        .eq('id', gameId);
    }
    this._emit('PLAYER_JOINED', payload);
  }
  
  async _handlePlayerLeft(payload) {
    const { gameId, playerId } = payload;
    const game = this.games.get(gameId);
    if (game) {
      game.players = game.players.filter(p => p !== playerId);
      await this.supabase
        .from('games')
        .update({ players: game.players })
        .eq('id', gameId);
    }
    this._emit('PLAYER_LEFT', payload);
  }
  
  async _handleForfeit(payload) {
    const { gameId, playerId, type } = payload; // type: 'turn' | 'game'
    const game = this.games.get(gameId);
    if (!game) return;
    
    if (type === 'game') {
      await this._finishGame(gameId, -1, 'forfeit');
    } else {
      // Skip turn - same as end turn with empty data
      await this._handleTurnEnded({
        gameId,
        nextPlayerId: game.players[(game.players.indexOf(playerId) + 1) % game.players.length],
        gameState: game.state,
        turn: game.currentTurn + 1,
      });
    }
  }
  
  async _handleGameFinished(payload) {
    const { gameId, winnerIndex, gameState } = payload;
    
    const game = this.games.get(gameId);
    if (game) {
      game.status = 'finished';
      game.winner = winnerIndex >= 0 ? game.players[winnerIndex] : null;
    }
    
    await this.supabase
      .from('games')
      .update({
        status: 'finished',
        winner: game.winner,
        finished_at: new Date().toISOString(),
      })
      .eq('id', gameId);
    
    this._emit('GAME_FINISHED', { gameId, winnerIndex, gameState });
  }
  
  async _handleGameStateSync(payload) {
    // Full state sync (reconnection, etc.)
    this._emit('GAME_STATE_SYNC', payload);
  }
  
  /**
   * Supabase Realtime subscriptions
   */
  _setupRealtimeSubscriptions() {
    // Subscribe to games table changes
    this.supabase
      .channel('games-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games'
      }, (payload) => {
        this._emit('GAME_CHANGED', payload);
      })
      .subscribe();
    
    // Subscribe to game events table
    this.supabase
      .channel('game-events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_events'
      }, (payload) => {
        this._emit('GAME_EVENT', payload.new);
      })
      .subscribe();
  }
  
  // --- Public API Methods ---
  
  /**
   * Create a new game
   */
  async createGame(gameId, playerIds, initialState = {}) {
    const { data, error } = await this.supabase
      .from('games')
      .insert({
        id: gameId,
        players: playerIds,
        state: initialState,
        current_turn: 1,
        current_player: playerIds[0],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    this.games.set(gameId, {
      id: gameId,
      players: playerIds,
      state: initialState,
      currentTurn: 1,
      currentPlayer: playerIds[0],
      status: 'active',
    });
    
    this.sendCommand('GAME_STARTED', { gameId, players: playerIds, initialState });
    return data;
  }
  
  /**
   * Load existing game
   */
  async loadGame(gameId) {
    const { data, error } = await this.supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();
    
    if (error) throw error;
    
    this.sendCommand('GAME_LOADED', { gameId, gameState: data.state });
    return data;
  }
  
  /**
   * Send turn data (host saves to Supabase)
   */
  sendTurn(gameId, turnData) {
    this.sendCommand('END_TURN', { gameId, data: turnData });
  }
  
  /**
   * End current turn
   */
  endTurn(gameId, nextPlayerIndex = -1) {
    this.sendCommand('END_TURN', { gameId, nextPlayerIndex });
  }
  
  /**
   * Forfeit current turn
   */
  forfeitTurn(gameId) {
    this.sendCommand('FORFEIT_TURN', { gameId });
  }
  
  /**
   * Forfeit entire game
   */
  forfeitGame(gameId) {
    this.sendCommand('FORFEIT_GAME', { gameId });
  }
  
  /**
   * Send chat message
   */
  sendChatMessage(gameId, message) {
    this.sendCommand('CHAT_MESSAGE', { gameId, message });
  }
  
  /**
   * Invite player
   */
  invitePlayer(gameId, playerId, message = '') {
    this.sendCommand('INVITE_PLAYER', { gameId, playerId, message });
  }
  
  /**
   * Get game state from cache
   */
  getGameState(gameId) {
    return this.games.get(gameId);
  }
  
  /**
   * Subscribe to game changes via Supabase Realtime
   */
  subscribeToGame(gameId, callback) {
    const channel = this.supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        if (callback) callback(payload.new);
      })
      .subscribe();
    
    return channel;
  }
  
  /**
   * Send game event (for audit trail)
   */
  async logGameEvent(gameId, eventType, data, playerId) {
    await this.supabase
      .from('game_events')
      .insert({
        game_id: gameId,
        event_type: eventType,
        data: data,
        player_id: playerId,
        created_at: new Date().toISOString(),
      });
  }
  
  /**
   * Get game event history
   */
  async getGameEvents(gameId, limit = 100) {
    const { data, error } = await this.supabase
      .from('game_events')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.supabase) {
      this.supabase.removeAllChannels();
    }
    window.removeEventListener('message', this._handleMessage.bind(this));
    this.listeners.clear();
    this.games.clear();
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AirStudioMultiplayer;
}

if (typeof window !== 'undefined') {
  window.AirStudioMultiplayer = AirStudioMultiplayer;
}

export default AirStudioMultiplayer;