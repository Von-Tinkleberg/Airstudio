# AirStudio Iframe Embedding & Async Multiplayer Integration

Complete documentation for embedding AirStudio as an iframe in your application and implementing async turn-based multiplayer games.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Iframe Embedding](#iframe-embedding)
3. [Communication Protocol](#communication-protocol)
4. [Async Multiplayer System](#async-multiplayer-system)
5. [Database Schema](#database-schema)
6. [Parent App Integration](#parent-app-integration)
7. [Deployment](#deployment)
7. [API Reference](#api-reference)

---

## Quick Start

### 1. Build AirStudio

```bash
cd newIDE/app
npm install
npm run build
```

The `build/` folder contains your deployable AirStudio editor.

### 2. Host the Build

Deploy the `build/` folder to your CDN or static hosting:
- Vercel: `vercel deploy build/`
- Netlify: `netlify deploy --dir=build`
- AWS S3 + CloudFront
- Any static hosting

### 3. Embed in Your App

```html
<div id="editor-container" style="width:100%; height:100vh;">
  <iframe 
    id="airstudio-editor"
    src="https://editor.yourapp.com"
    style="width:100%; height:100%; border:none;"
    allow="fullscreen; clipboard-read; clipboard-write"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-clipboard-read allow-clipboard-write">
  </iframe>
</div>
```

### 4. Initialize Communication

```javascript
const editor = document.getElementById('airstudio-editor').contentWindow;
const origin = 'https://editor.yourapp.com';

function send(type, payload = {}) {
  editor.postMessage({ type, payload }, origin);
}

window.addEventListener('message', (event) => {
  if (event.origin !== origin) return;
  const { type, payload } = event.data;
  
  switch (type) {
    case 'READY':
      console.log('Editor ready!');
      break;
    case 'PROJECT_SAVED':
      saveToDatabase(payload);
      break;
    case 'PROJECT_EXPORTED':
      deployGame(payload.url);
      break;
  }
});

// Initialize
send('INIT_AUTH', { 
  supabaseUrl: 'https://xxx.supabase.co',
  supabaseAnonKey: 'xxx',
  accessToken: userSession.access_token 
});
```

---

## Iframe Embedding

### Required Sandbox Permissions

| Permission | Purpose |
|------------|---------|
| `allow-scripts` | Run editor JavaScript |
| `allow-same-origin` | Access localStorage, cookies, IndexedDB |
| `allow-forms` | Input fields, dialogs |
| `allow-popups` | External editors (Jfxr, Yarn, AirCanvas) |
| `allow-modals` | Alert/confirm dialogs |
| `allow-downloads` | Export downloads |
| `allow-clipboard-read` | Copy/paste |
| `allow-clipboard-write` | Copy/paste |

### CSP Headers

If you use Content Security Policy:

```http
Content-Security-Policy: 
  frame-ancestors https://yourapp.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
  worker-src 'self' blob:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-src https://editor.yourapp.com;
  frame-ancestors https://yourapp.com;
```

### Required Origins

| Domain | Purpose |
|--------|---------|
| `https://editor.yourapp.com` | AirStudio editor |
| `https://api.supabase.co` | Supabase API |
| `https://*.supabase.co` | Supabase Realtime |
| `wss://*.supabase.co` | Supabase WebSocket |

---

## Communication Protocol

### Parent → AirStudio Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `CREATE_PROJECT` | `{ projectName }` | Create new project |
| `LOAD_PROJECT` | `{ projectJson, fileMetadata }` | Load existing project |
| `SAVE_PROJECT` | - | Save current project |
| `EXPORT_GAME` | `{ exportType }` | Export game (html5) |
| `GET_PROJECT_DATA` | - | Get serialized project |
| `GET_VERSION` | - | Get editor version |
| `CLOSE_PROJECT` | - | Close current project |

### AirStudio → Parent Events

| Event | Payload | Description |
|-------|---------|-------------|
| `READY` | `{ version, buildHash }` | Editor loaded |
| `PROJECT_CREATED` | `{ fileMetadata }` | New project created |
| `PROJECT_LOADED` | `{ fileMetadata }` | Project loaded |
| `PROJECT_SAVED` | `{ fileMetadata, projectJson }` | Project saved |
| `PROJECT_EXPORTED` | `{ url, format }` | Game exported |
| `PROJECT_DATA` | `{ projectJson, fileMetadata }` | Project data response |
| `VERSION` | `{ version, buildHash }` | Version response |
| `PROJECT_CLOSED` | - | Project closed |
| `ERROR` | `{ message, code }` | Error occurred |

### Example: Full Integration

```javascript
class AirStudioEmbed {
  constructor(iframeId, origin) {
    this.iframe = document.getElementById(iframeId);
    this.origin = origin;
    this.editorWindow = this.iframe.contentWindow;
    this.pendingRequests = new Map();
    this.requestId = 0;
    
    window.addEventListener('message', this._handleMessage.bind(this));
    this.iframe.onload = () => this._onLoad();
  }
  
  _onLoad() {
    this.send('INIT_AUTH', {
      supabaseUrl: 'https://xxx.supabase.co',
      supabaseAnonKey: 'xxx',
      accessToken: getCurrentUserToken()
    });
  }
  
  _handleMessage(event) {
    if (event.origin !== this.origin) return;
    const { type, payload, requestId } = event.data;
    
    if (requestId && this.pendingRequests.has(requestId)) {
      const { resolve, reject } = this.pendingRequests.get(requestId);
      this.pendingRequests.delete(requestId);
      if (type === 'ERROR') reject(new Error(payload.message));
      else resolve(payload);
    }
    
    // Handle async events
    this.emit(type, payload);
  }
  
  send(type, payload = {}) {
    return new Promise((resolve, reject) => {
      const requestId = ++this.requestId;
      this.pendingRequests.set(requestId, { resolve, reject });
      this.editorWindow.postMessage({ type, payload, requestId }, this.origin);
      
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Timeout'));
        }
      }, 30000);
    });
  }
  
  // High-level methods
  createProject(name) {
    return this.send('CREATE_PROJECT', { projectName: name });
  }
  
  loadProject(projectJson, fileMetadata) {
    return this.send('LOAD_PROJECT', { projectJson, fileMetadata });
  }
  
  saveProject() {
    return this.send('SAVE_PROJECT');
  }
  
  exportGame(exportType = 'html5') {
    return this.send('EXPORT_GAME', { exportType });
  }
  
  getProjectData() {
    return this.send('GET_PROJECT_DATA');
  }
  
  on(event, handler) {
    this.handlers = this.handlers || {};
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(handler);
  }
  
  emit(event, data) {
    (this.handlers[event] || []).forEach(h => h(data));
  }
}

// Usage
const editor = new AirStudioEmbed('airstudio-editor', 'https://editor.myapp.com');

editor.on('PROJECT_SAVED', async ({ fileMetadata, projectJson }) => {
  await saveToSupabase(fileMetadata, projectJson);
});

editor.on('PROJECT_EXPORTED', async ({ url }) => {
  await deployGame(url);
});

// Create new game
editor.createProject('My Awesome Game');
```

---

## Async Multiplayer System

### Overview

AirStudio includes a complete async turn-based multiplayer system (`AsyncMultiplayerBehavior`) that works via parent app communication for Supabase Realtime sync.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Parent App (Your App)                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Supabase Client                                        │ │
│  │  - Games table (state, turns, players)                  │ │
│  │  - Game events (audit trail)                            │ │
│  │  - Chat messages                                        │ │
│  │  - Invitations                                          │ │
│  │  - Realtime subscriptions                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           ▲                                   │
│                    postMessage                                 │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  AirStudio Iframe                                       │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  AsyncMultiplayerBehavior (Runtime)                 │ │ │
│  │  │  - Turn management                                  │ │ │
│  │  │  - Game state sync                                  │ │ │
│  │  │  - Chat/invitations                                │ │ │
│  │  │  - Parent communication (postMessage)              │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Game Flow

```
1. CREATE_GAME (parent) → AirStudio
   - Parent creates game in Supabase
   - Sends START_GAME with gameId, players, initialState

2. PLAYERS JOIN → AirStudio loads game
   - Each player opens iframe
   - Receives JOIN_GAME with gameId

3. TURN LOOP:
   a. Current player makes moves in editor
   b. Player clicks "End Turn"
   c. AirStudio sends END_TURN with turnData
   d. Parent saves state to Supabase
   d. Parent notifies next player (push/email)
   e. Next player opens game → receives TURN_STARTED

4. GAME ENDS:
   - Win/lose/draw/forfeit
   - Parent marks game finished in DB
```

---

## Using AsyncMultiplayerBehavior in AirStudio

### Add to Your Game

1. Open your project in AirStudio
2. Add behavior to scene: **AsyncMultiplayerBehavior**
3. Configure properties:
   - `gameId`: (set via events)
   - `playerId`: (set via events) 
   - `turnTimeout`: seconds per turn (0 = none)
   - `maxPlayers`: max players (2-8)
   - `sendOnTurnEnd`: auto-send turn data

### Events

#### Conditions
| Condition | Description |
|-----------|-------------|
| Is my turn? | Check if it's local player's turn |
| Is game active? | Game in progress |
| Is game finished? | Game ended |
| Get winner | Winner index (-2=ongoing, -1=draw, ≥0=player) |
| Current turn | Turn number |
| Current player index | Whose turn (0-based) |
| Player count | Total players |
| Has game data? | Check if key exists |
| Unread chat count | Unread messages |
| Pending invitations | Pending invites |

#### Actions
| Action | Parameters | Description |
|--------|------------|-------------|
| Start Game | `gameId`, `playerIds`, `initialData` | Create/start game |
| Join Game | `gameId`, `playerId` | Join existing game |
| End Turn | `turnData`, `nextPlayerIndex` | End turn with data |
| Forfeit Turn | - | Skip turn |
| Forfeit Game | - | Concede game |
| Request State | - | Full state sync |
| Set Game Data | `key`, `value (JSON)` | Sync key-value |
| Send Chat | `message` | Send chat |
| Invite Player | `playerId`, `message` | Invite to game |

#### Expressions
| Expression | Returns |
|------------|---------|
| `CurrentTurn()` | Current turn number |
| `CurrentPlayerIndex()` | Current player (0-based) |
| `PlayerCount()` | Total players |
| `PlayerIdAt(index)` | Player ID at index |
| `GameDataString(key, default)` | String game data |
| `GameDataNumber(key, default)` | Numeric game data |
| `GameDataBool(key, default)` | Boolean game data |
| `WinnerIndex()` | Winner (-2=ongoing, -1=draw) |
| `UnreadChatCount()` | Unread messages |
| `MyPlayerIndex()` | Local player index |

### Event Sheet Example

```gdevelop
# Game Start
Event: Scene begins
  Action: AsyncMultiplayer::StartGame("game-123", "player-1,player-2", '{"board":[]}')

# My Turn
Event: AsyncMultiplayer::IsMyTurn()
  Action: Enable player input
  Action: Show "Your turn!" text

# End Turn Button
Event: Player clicks "End Turn"
  Action: AsyncMultiplayer::EndTurn('{"board":Variable(board),"moves":Variable(moves)}', -1)

# Turn Started
Event: AsyncMultiplayer::OnMyTurn()
  Action: Show turn number: AsyncMultiplayer::CurrentTurn()
  Action: Load game state from AsyncMultiplayer::GameDataString("board","[]")

# Turn Ended
Event: AsyncMultiplayer::OnTurnEnded()
  Action: Disable player input

# Game Ended
Event: AsyncMultiplayer::OnGameEnded()
  Action: Show "Game Over! Winner: " + AsyncMultiplayer::WinnerIndex()
```

---

## Database Schema

Run this in your Supabase SQL Editor:

```sql
-- See async-multiplayer-schema.sql for complete schema
-- Includes: games, game_events, game_chat, game_invitations
-- RLS policies, helper functions, triggers
```

Run: `async-multiplayer-schema.sql` in Supabase SQL Editor.

### Key Tables

| Table | Purpose |
|-------|---------|
| `games` | Core game state (players, turn, status) |
| `game_events` | Audit trail (turns, chat, joins) |
| `game_chat` | In-game chat messages |
| `game_invitations` | Pending/accepted invites |

### RLS Policies

All tables use RLS - players can only access games they're part of.

---

## Parent App Integration

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Create Multiplayer Client

```javascript
// airstudio-multiplayer.js (already created in public/)
import { AirStudioMultiplayer } from './airstudio-multiplayer.js';

const multiplayer = new AirStudioMultiplayer({
  supabaseUrl: 'https://xxx.supabase.co',
  supabaseAnonKey: 'xxx',
  editorOrigin: 'https://editor.myapp.com'
});

await multiplayer.init();
multiplayer.setEditorWindow(document.getElementById('editor').contentWindow);
```

### 2. Handle Events

```javascript
// Game turn ended - save to DB, notify next player
multiplayer.on('GAME_TURN_ENDED', async ({ gameId, nextPlayerId, gameState, turn }) => {
  await supabase.from('games').upsert({
    id: gameId,
    state: gameState,
    current_turn: turn,
    current_player: nextPlayerId
  });
  
  // Send push notification
  await sendPushNotification(nextPlayerId, 'Your turn!');
});

// Game finished
multiplayer.on('GAME_FINISHED', async ({ gameId, winnerIndex, gameState }) => {
  await supabase.from('games').update({
    status: 'finished',
    winner: winnerIndex >= 0 ? gameState.players[winnerIndex] : null,
    finished_at: new Date().toISOString()
  }).eq('id', gameId);
});

// Errors
multiplayer.on('ERROR', ({ message }) => {
  showToast('Editor error: ' + message);
});
```

### 3. Game Management API

```javascript
// Create new game
const game = await multiplayer.createGame('game-uuid', ['player-1', 'player-2'], { board: [] });

// Load existing game
const game = await multiplayer.loadGame('game-uuid');

// Send turn data
multiplayer.sendTurn('game-uuid', { board: newBoard, move: lastMove });

// End turn
multiplayer.endTurn('game-uuid'); // auto-advance
// or
multiplayer.endTurn('game-uuid', 1); // specific next player

// Chat
multiplayer.sendChatMessage('game-uuid', 'Good move!');

// Invite player
multiplayer.invitePlayer('game-uuid', 'player-3', 'Join my game!');
```

---

## Deployment

### Build AirStudio

```bash
cd newIDE/app
npm run build
```

Output: `build/` folder with:
```
build/
├── index.html
├── static/
│   ├── js/*.js
│   ├── css/*.css
│   └── media/*
├── external/
│   ├── aircanvas/ (sprite editor)
│   ├── jfxr/ (sound editor)
│   └── yarn/ (dialogue editor)
├── libGD.js / libGD.wasm (game engine)
├── service-worker.js (PWA)
└── manifest.json
```

### Deploy to Vercel

```bash
cd build
vercel deploy --prod
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `EDITOR_ORIGIN` | Your editor domain (e.g., `https://editor.myapp.com`) |

### CORS Configuration

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://editor.myapp.com`
- **Redirect URLs**: `https://editor.myapp.com/**`

### CORS Headers (if hosting separately)

```nginx
# nginx config
location / {
    add_header Access-Control-Allow-Origin "https://yourapp.com";
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    add_header Access-Control-Allow-Credentials "true";
}
```

---

## API Reference

### AirStudioMultiplayer Class

#### Constructor

```javascript
new AirStudioMultiplayer(config)
```

| Config | Type | Required | Description |
|--------|------|----------|-------------|
| `supabaseUrl` | string | Yes | Supabase project URL |
| `supabaseAnonKey` | string | Yes | Supabase anonymous key |
| `editorOrigin` | string | Yes | Editor iframe origin |
| `turnTimeout` | number | No | Default turn timeout (seconds) |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `init()` | `Promise<void>` | Initialize Supabase client |
| `setEditorWindow(window)` | `void` | Set iframe contentWindow |
| `sendCommand(type, payload)` | `void` | Send command to editor |
| `on(event, handler)` | `void` | Register event listener |
| `off(event, handler)` | `void` | Remove event listener |
| `createGame(id, players, state)` | `Promise<Object>` | Create game in DB + editor |
| `loadGame(id)` | `Promise<Object>` | Load game from DB + editor |
| `sendTurn(id, data)` | `void` | Send turn to editor |
| `endTurn(id, nextPlayer)` | `void` | End turn in editor |
| `sendChatMessage(id, msg)` | `void` | Send chat |
| `invitePlayer(id, playerId, msg)` | `void` | Invite player |
| `getGameState(id)` | `Object\|undefined` | Get cached game state |
| `subscribeToGame(id, callback)` | `RealtimeChannel` | Subscribe to DB changes |
| `logGameEvent(id, type, data, playerId)` | `Promise` | Log event |
| `getGameEvents(id, limit)` | `Promise<Array>` | Get event history |
| `destroy()` | `void` | Cleanup |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `READY` | `{ version, buildHash }` | Editor loaded |
| `PROJECT_CREATED` | `{ fileMetadata }` | Project created |
| `PROJECT_LOADED` | `{ fileMetadata }` | Project loaded |
| `PROJECT_SAVED` | `{ fileMetadata, projectJson }` | Project saved |
| `PROJECT_EXPORTED` | `{ url, format }` | Game exported |
| `GAME_TURN_ENDED` | `{ gameId, nextPlayerId, gameState, turn }` | Turn ended |
| `GAME_STARTED` | `{ gameId, players, initialState }` | Game started |
| `GAME_FINISHED` | `{ gameId, winnerIndex, gameState }` | Game finished |
| `PLAYER_JOINED` | `{ gameId, playerId, playerIndex }` | Player joined |
| `PLAYER_LEFT` | `{ gameId, playerId }` | Player left |
| `CHAT_MESSAGE` | `{ gameId, playerId, message }` | Chat received |
| `INVITATION_SENT` | `{ gameId, fromPlayerId, toPlayerId }` | Invite sent |
| `INVITATION_ACCEPTED` | `{ gameId, playerId }` | Invite accepted |
| `GAME_CHANGED` | Supabase payload | DB change |
| `GAME_EVENT` | Supabase payload | Event inserted |
| `ERROR` | `{ message, code }` | Error occurred |

---

## Troubleshooting

### Editor Won't Load

- Check browser console for CSP errors
- Verify `frame-ancestors` CSP allows your domain
- Check iframe `sandbox` has all required permissions

### Supabase Connection Failed

- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify RLS policies allow access

### Multiplayer Not Syncing

- Check Supabase Realtime is enabled
- Verify `game_events` table has INSERT trigger
- Check browser console for WebSocket errors
- Verify Realtime channel subscription

### Turn Not Advancing

- Check `turnTimeout` > 0 in behavior
- Verify parent app receives `GAME_TURN_ENDED`
- Check Supabase `games` table updates

### Chat/Invitations Not Working

- Verify `game_chat` and `game_invitations` tables exist
- Check RLS policies allow INSERT/SELECT
- Verify Supabase Realtime on `game_chat` table

---

## File Structure Summary

```
AirStudio/
├── newIDE/app/
│   ├── public/
│   │   ├── airstudio-multiplayer.js      # Parent app client
│   │   ├── async-multiplayer-schema.sql  # Supabase schema
│   │   ├── aircanvas/                    # Sprite editor (built)
│   │   ├── jfxr/                         # Sound editor (built)
│   │   └── yarn/                         # Dialogue editor (built)
│   ├── src/
│   │   ├── Extensions/AsyncMultiplayer/
│   │   │   ├── index.js                  # Extension entry
│   │   │   ├── ExtensionInfo.js          # Metadata
│   │   │   ├── AsyncMultiplayerBehavior.js # Editor behavior
│   │   │   ├── AsyncMultiplayerRuntimeBehavior.js # Runtime
│   │   │   ├── Conditions.js             # Conditions
│   │   │   ├── Actions.js                # Actions
│   │   │   └── Expressions.js            # Expressions
│   │   ├── Utils/IframeApi.js            # Iframe API
│   │   ├── MainFrame/index.js            # Main frame (iframe init)
│   │   └── ServiceWorkerSetup.js         # SW disabled in iframe
│   └── build/                            # Deployable output
```

---

## License

MIT License - Feel free to use in commercial projects.

---

## Support

- **GitHub Issues**: https://github.com/airstudio/airstudio/issues
- **Documentation**: https://docs.airstudio.io
- **Discord**: https://discord.gg/airstudio