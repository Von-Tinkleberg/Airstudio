// @flow
/**
 * AsyncMultiplayer Runtime Behavior
 * Runs in exported AirStudio games - handles async turn-based multiplayer state
 * Receives commands from parent app via postMessage, fires events for host to handle
 * Host app handles ALL Supabase communication and turn management
 */

const gdjs = require('gdjs');

class AsyncMultiplayerRuntimeBehavior extends gdjs.RuntimeBehavior {
    constructor(runtimeScene, behaviorData, owner) {
        super(runtimeScene, behaviorData, owner);
        
        // Configuration from behavior properties
        this._gameId = behaviorData.gameId || '';
        this._playerId = behaviorData.playerId || '';
        this._turnTimeout = behaviorData.turnTimeout || 0;
        this._maxPlayers = behaviorData.maxPlayers || 2;
        
        // State (host app is the source of truth)
        this._gameState = 'waiting'; // 'waiting' | 'active' | 'finished'
        this._currentTurn = 0;
        this._currentPlayerIndex = 0;
        this._players = [];
        this._myPlayerIndex = -1;
        this._gameData = {};
        this._lastTurnData = null;
        this._chatMessages = [];
        this._unreadChatCount = 0;
        this._pendingInvitations = [];
        this._winnerIndex = -2; // -2 = not finished, -1 = draw, >=0 = player index
        this._turnTimer = null;
        this._isConnected = false;
        
        // Event callbacks for host app to register
        this._eventCallbacks = {
            onGameStarted: [],
            onMyTurn: [],
            onTurnStarted: [],
            onTurnEnded: [],
            onTurnDataReceived: [],
            onGameEnded: [],
            onPlayerJoined: [],
            onPlayerLeft: [],
            onChatMessage: [],
            onGameDataUpdated: [],
            onInvitation: [],
            onError: [],
            onTurnTimeout: [],
        };
        
        // Initialize parent communication (receive only)
        this._setupParentCommunication();
    }
    
    _setupParentCommunication() {
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
            window.addEventListener('message', this._handleParentMessage.bind(this));
            
            // Signal ready to parent (host will respond with initial state)
            window.parent.postMessage({
                type: 'ASYNC_MULTI_READY',
                payload: {
                    behaviorId: this.owner.getName(),
                }
            }, '*');
        }
    }
    
    _handleParentMessage(event) {
        if (!event.data || !event.data.type) return;
        if (!event.data.type.startsWith('ASYNC_MULTI_')) return;
        
        const { type, payload } = event.data;
        
        switch (type) {
            case 'ASYNC_MULTI_GAME_STARTED':
                this._onGameStarted(payload);
                break;
            case 'ASYNC_MULTI_TURN_STARTED':
                this._onTurnStarted(payload);
                break;
            case 'ASYNC_MULTI_TURN_DATA':
                this._onTurnData(payload);
                break;
            case 'ASYNC_MULTI_TURN_ENDED':
                this._onTurnEnded(payload);
                break;
            case 'ASYNC_MULTI_GAME_ENDED':
                this._onGameEnded(payload);
                break;
            case 'ASYNC_MULTI_PLAYER_JOINED':
                this._onPlayerJoined(payload);
                break;
            case 'ASYNC_MULTI_PLAYER_LEFT':
                this._onPlayerLeft(payload);
                break;
            case 'ASYNC_MULTI_CHAT_MESSAGE':
                this._onChatMessage(payload);
                break;
            case 'ASYNC_MULTI_GAME_DATA_UPDATED':
                this._onGameDataUpdated(payload);
                break;
            case 'ASYNC_MULTI_INVITATION':
                this._onInvitation(payload);
                break;
            case 'ASYNC_MULTI_INVITATION_ACCEPTED':
                this._onInvitationAccepted(payload);
                break;
            case 'ASYNC_MULTI_GAME_STATE':
                this._onGameState(payload);
                break;
            case 'ASYNC_MULTI_ERROR':
                console.error('AsyncMultiplayer error:', payload);
                this._triggerEvent('onError', [payload.message]);
                break;
        }
    }
    
    // No _sendToParent - host handles ALL sending
    
    // --- Event Handlers ---
    
    _onGameStarted(payload) {
        this._gameState = 'active';
        this._players = payload.players || [];
        this._currentTurn = 1;
        this._currentPlayerIndex = payload.currentPlayerIndex || 0;
        this._myPlayerIndex = this._players.indexOf(this._playerId);
        this._gameData = payload.initialData || {};
        this._isConnected = true;
        this._winnerIndex = -2;
        this._chatMessages = [];
        this._unreadChatCount = 0;
        
        if (this._turnTimeout > 0) {
            this._startTurnTimer();
        }
        
        this._triggerEvent('onGameStarted', []);
        if (this._isMyTurn()) {
            this._triggerEvent('onMyTurn', []);
        }
    }
    
    _onTurnStarted(payload) {
        this._currentTurn = payload.turnNumber;
        this._currentPlayerIndex = payload.currentPlayerIndex;
        this._lastTurnData = payload.previousTurnData || null;
        
        if (this._turnTimeout > 0) {
            this._startTurnTimer();
        }
        
        this._triggerEvent('onTurnStarted', []);
        if (this._isMyTurn()) {
            this._triggerEvent('onMyTurn', []);
        }
    }
    
    _onTurnData(payload) {
        this._lastTurnData = payload.data;
        this._updateGameData(payload.gameData);
        this._triggerEvent('onTurnDataReceived', [payload.data]);
    }
    
    _onTurnEnded(payload) {
        this._clearTurnTimer();
        this._triggerEvent('onTurnEnded', []);
    }
    
    _onGameEnded(payload) {
        this._gameState = 'finished';
        this._clearTurnTimer();
        this._winnerIndex = payload.winnerIndex;
        this._triggerEvent('onGameEnded', [payload.winnerIndex]);
    }
    
    _onPlayerJoined(payload) {
        const { gameId, playerId, playerIndex } = payload;
        if (!this._players.includes(playerId)) {
            this._players.splice(playerIndex, 0, playerId);
        }
        this._triggerEvent('onPlayerJoined', [playerId, playerIndex]);
    }
    
    _onPlayerLeft(payload) {
        const { gameId, playerId, playerIndex } = payload;
        const index = this._players.indexOf(playerId);
        if (index >= 0) {
            this._players.splice(index, 1);
        }
        this._triggerEvent('onPlayerLeft', [playerId, playerIndex]);
    }
    
    _onChatMessage(payload) {
        const message = {
            id: payload.id,
            playerId: payload.playerId,
            playerIndex: payload.playerIndex,
            message: payload.message,
            timestamp: payload.timestamp
        };
        this._chatMessages.push(message);
        
        if (!this._isMyTurn()) {
            this._unreadChatCount++;
        }
        
        this._triggerEvent('onChatMessage', [message]);
    }
    
    _onGameDataUpdated(payload) {
        this._updateGameData(payload.data);
        this._triggerEvent('onGameDataUpdated', [payload.key, payload.value]);
    }
    
    _onInvitation(payload) {
        this._pendingInvitations.push(payload);
        this._triggerEvent('onInvitation', [payload]);
    }
    
    _onInvitationAccepted(payload) {
        this._pendingInvitations = this._pendingInvitations.filter(
            inv => inv.id !== payload.invitationId
        );
        this._triggerEvent('onInvitationAccepted', [payload]);
    }
    
    _onGameState(payload) {
        // Full state sync (reconnection, etc.)
        this._players = payload.players || [];
        this._currentTurn = payload.currentTurn || 1;
        this._currentPlayerIndex = payload.currentPlayerIndex || 0;
        this._myPlayerIndex = this._players.indexOf(this._playerId);
        this._gameData = payload.gameData || {};
        this._gameState = payload.gameState || 'waiting';
        this._winnerIndex = payload.winnerIndex || -2;
        this._chatMessages = payload.chatMessages || [];
        this._unreadChatCount = payload.unreadChatCount || 0;
        
        if (this._turnTimeout > 0 && this._isMyTurn() && this._gameState === 'active') {
            this._startTurnTimer();
        }
        
        this._triggerEvent('onGameStateSynced', []);
    }
    
    // --- Timer Management ---
    
    _startTurnTimer() {
        this._clearTurnTimer();
        if (this._turnTimeout > 0 && this._isMyTurn()) {
            this._turnTimer = setTimeout(() => {
                this._triggerEvent('onTurnTimeout', []);
                // Host will handle the forfeit logic
            }, this._turnTimeout * 1000);
        }
    }
    
    _clearTurnTimer() {
        if (this._turnTimer) {
            clearTimeout(this._turnTimer);
            this._turnTimer = null;
        }
    }
    
    // --- Helpers ---
    
    _isMyTurn() {
        return this._myPlayerIndex === this._currentPlayerIndex && 
               this._gameState === 'active';
    }
    
    _updateGameData(newData) {
        if (newData && typeof newData === 'object') {
            this._gameData = { ...this._gameData, ...newData };
        }
    }
    
    // --- Public API (called from events) ---
    // These just update local state; host handles all Supabase communication
    
    doStartGame(gameId, playerIds, initialData) {
        this._gameId = gameId;
        // Just update local state, host handles Supabase
        this._gameId = gameId;
    }
    
    doJoinGame(gameId, playerId) {
        this._gameId = gameId;
        this._playerId = playerId;
    }
    
    doEndTurn(turnData, nextPlayerIndex) {
        // Local state update only - host will send END_TURN command
        if (!this._isMyTurn()) return;
        
        const data = turnData ? JSON.parse(turnData) : {};
        this._gameData = { ...this._gameData, ...data };
        this._triggerEvent('onTurnEnded', []);
    }
    
    doForfeitTurn() {
        if (!this._isMyTurn()) return;
        this._triggerEvent('onTurnEnded', []);
    }
    
    doForfeitGame() {
        this._gameState = 'finished';
        this._triggerEvent('onGameEnded', [-1]);
    }
    
    doRequestGameState() {
        // Host will respond with ASYNC_MULTI_GAME_STATE
    }
    
    doSetGameData(key, value) {
        try {
            const parsedValue = JSON.parse(value);
            this._gameData[key] = parsedValue;
        } catch (e) {
            console.error('Invalid JSON for game data:', value);
        }
    }
    
    doGetGameData(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? JSON.stringify(value) : defaultValue;
    }
    
    doSendChatMessage(message) {
        // Local chat history update only
        this._chatMessages.push({
            id: Date.now().toString(),
            playerId: this._playerId,
            message: message,
            timestamp: Date.now()
        });
    }
    
    doInvitePlayer(playerId, message) {
        // Host handles invitation logic
    }
    
    // --- Conditions ---
    
    isMyTurn() {
        return this._isMyTurn();
    }
    
    isGameActive() {
        return this._gameState === 'active';
    }
    
    isGameFinished() {
        return this._gameState === 'finished';
    }
    
    getWinner() {
        return this._winnerIndex;
    }
    
    getCurrentPlayerIndex() {
        return this._currentPlayerIndex;
    }
    
    getPlayerCount() {
        return this._players.length;
    }
    
    getPlayerIdAtIndex(index) {
        return this._players[index] || '';
    }
    
    isPlayerConnected(index) {
        return index >= 0 && index < this._players.length;
    }
    
    getTurnNumber() {
        return this._currentTurn;
    }
    
    hasGameData(key) {
        return key in this._gameData;
    }
    
    getGameDataString(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? String(value) : defaultValue;
    }
    
    getGameDataNumber(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? Number(value) : defaultValue;
    }
    
    getGameDataBool(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? Boolean(value) : defaultValue;
    }
    
    hasUnreadChatMessages() {
        return this._unreadChatCount > 0;
    }
    
    getUnreadChatCount() {
        return this._unreadChatCount;
    }
    
    isInvitationPending() {
        return this._pendingInvitations.length > 0;
    }
    
    getPendingInvitations() {
        return JSON.stringify(this._pendingInvitations);
    }
    
    canStartGame(minPlayers) {
        return this._players.length >= (minPlayers || 2);
    }
    
    // --- Expressions ---
    
    getCurrentTurn() {
        return this._currentTurn;
    }
    
    getCurrentPlayerIndex() {
        return this._currentPlayerIndex;
    }
    
    getPlayerCount() {
        return this._players.length;
    }
    
    getPlayerIdAt(index) {
        return this._players[index] || '';
    }
    
    getGameDataStringExp(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? String(value) : defaultValue;
    }
    
    getGameDataNumberExp(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? Number(value) : defaultValue;
    }
    
    getGameDataBoolExp(key, defaultValue) {
        const value = this._gameData[key];
        return value !== undefined ? Boolean(value) : defaultValue;
    }
    
    getWinnerIndex() {
        return this._winnerIndex;
    }
    
    getTurnNumber() {
        return this._currentTurn;
    }
    
    getUnreadChatCount() {
        return this._unreadChatCount;
    }
    
    getPendingInvitationCount() {
        return this._pendingInvitations.length;
    }
    
    getPlayerIdAt(index) {
        return this._players[index] || '';
    }
    
    getMyPlayerIndex() {
        return this._myPlayerIndex;
    }
    
    // --- Event Registration ---
    
    onGameStarted(callback) {
        this._eventCallbacks.onGameStarted.push(callback);
    }
    
    onMyTurn(callback) {
        this._eventCallbacks.onMyTurn.push(callback);
    }
    
    onTurnStarted(callback) {
        this._eventCallbacks.onTurnStarted.push(callback);
    }
    
    onTurnEnded(callback) {
        this._eventCallbacks.onTurnEnded.push(callback);
    }
    
    onTurnDataReceived(callback) {
        this._eventCallbacks.onTurnDataReceived.push(callback);
    }
    
    onGameEnded(callback) {
        this._eventCallbacks.onGameEnded.push(callback);
    }
    
    onPlayerJoined(callback) {
        this._eventCallbacks.onPlayerJoined.push(callback);
    }
    
    onPlayerLeft(callback) {
        this._eventCallbacks.onPlayerLeft.push(callback);
    }
    
    onChatMessage(callback) {
        this._eventCallbacks.onChatMessage.push(callback);
    }
    
    onGameDataUpdated(callback) {
        this._eventCallbacks.onGameDataUpdated.push(callback);
    }
    
    onInvitation(callback) {
        this._eventCallbacks.onInvitation.push(callback);
    }
    
    onError(callback) {
        this._eventCallbacks.onError.push(callback);
    }
    
    onTurnTimeout(callback) {
        this._eventCallbacks.onTurnTimeout.push(callback);
    }
    
    _triggerEvent(eventName, args) {
        const callbacks = this._eventCallbacks[eventName] || [];
        callbacks.forEach(cb => {
            try { cb(...args); } catch (e) { console.error(e); }
        });
    }
    
    doStepPreEvents(runtimeScene) {
        // Update behavior logic each frame
    }
    
    doStepPostEvents(runtimeScene) {
        // Post-events logic
    }
    
    onDestroy() {
        this._clearTurnTimer();
        if (typeof window !== 'undefined') {
            window.removeEventListener('message', this._handleParentMessage);
        }
    }
}

gdjs.registerBehavior('AsyncMultiplayerBehavior', AsyncMultiplayerRuntimeBehavior);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsyncMultiplayerRuntimeBehavior;
}