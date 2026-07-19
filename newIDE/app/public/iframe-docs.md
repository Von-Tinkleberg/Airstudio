# Embedding AirStudio in Your Application

*Complete iframe integration guide*

---

## Quick Start

```html
<iframe
  id="airstudio-editor"
  src="https://editor.yourapp.com"
  style="width:100%; height:100vh; border:none;"
  allow="fullscreen; clipboard-read; clipboard-write"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-clipboard-read allow-clipboard-write">
</iframe>
```

---

## Communication Protocol

**Origin:** `https://editor.yourapp.com` (must match iframe `src`)

### Parent → AirStudio Commands
```javascript
const editor = document.getElementById('airstudio-editor').contentWindow;
const origin = 'https://editor.yourapp.com';

function send(type, payload = {}) {
  editor.postMessage({ type, payload }, origin);
}

// Create new project
send('CREATE_PROJECT', { projectName: 'My Game' });

// Load existing project
send('LOAD_PROJECT', { 
  projectJson: {...}, 
  fileMetadata: { name: 'game.json', version: 1, gameId: 'uuid' } 
});

// Save current project
send('SAVE_PROJECT');

// Export as HTML5 zip
send('EXPORT_GAME', { exportType: 'html5' });

// Get current project data
send('GET_PROJECT_DATA');

// Get editor version
send('GET_VERSION');

// Close current project
send('CLOSE_PROJECT');
```

### AirStudio → Parent Events
```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://editor.yourapp.com') return;
  const { type, payload } = event.data;

  switch (type) {
    case 'READY':
      // { version, buildHash }
      console.log('Editor ready');
      break;

    case 'PROJECT_CREATED':
      // { fileMetadata }
      break;

    case 'PROJECT_LOADED':
      // { fileMetadata }
      break;

    case 'PROJECT_SAVED':
      // { fileMetadata, projectJson }
      // → Persist to your database
      break;

    case 'PROJECT_EXPORTED':
      // { url: 'blob:...', format: 'html5' }
      // → Upload to storage, create game record
      break;

    case 'PROJECT_DATA':
      // { projectJson, fileMetadata }
      break;

    case 'VERSION':
      // { version: '0.1.0', buildHash: 'abc123' }
      break;

    case 'PROJECT_CLOSED':
      break;

    case 'ERROR':
      // { message, code? }
      console.error('Editor error:', payload.message);
      break;
  }
});
```

---

## Typical Integration Flow

### 1. Initialize Auth (Optional)
```javascript
// After iframe loads
editor.postMessage({
  type: 'INIT_AUTH',
  payload: {
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseAnonKey: 'xxx',
    accessToken: supabaseSession?.access_token
  }
}, origin);
```

### 2. Create New Project
```javascript
function createNewGame(name = 'Untitled') {
  send('CREATE_PROJECT', { projectName: name });
}
// Listen for PROJECT_CREATED → store fileMetadata in your DB
```

### 3. Load Existing Project
```javascript
async function loadGame(gameId) {
  const { data } = await supabase.from('projects').select('*').eq('id', gameId).single();
  send('LOAD_PROJECT', { 
    projectJson: data.project_json, 
    fileMetadata: { name: data.name, version: data.version, gameId: data.id }
  });
}
```

### 4. Save / Autosave
```javascript
// Manual save button
function saveGame() { send('SAVE_PROJECT'); }

// Autosave (debounced)
let saveTimeout;
editor.addEventListener('message', (e) => {
  if (e.data.type === 'PROJECT_MODIFIED') {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => send('SAVE_PROJECT'), 5000);
  }
});
```

### 5. Export & Publish
```javascript
function publishGame() {
  send('EXPORT_GAME', { exportType: 'html5' });
}
// Listen for PROJECT_EXPORTED
// → Upload blob to Supabase Storage
// → Create record in `games` table
```

---

## Sandbox Permissions
```html
sandbox="
  allow-scripts 
  allow-same-origin 
  allow-forms 
  allow-popups 
  allow-modals 
  allow-downloads 
  allow-clipboard-read 
  allow-clipboard-write
"
```

| Permission | Purpose |
|------------|---------|
| `allow-scripts` | Run editor JS |
| `allow-same-origin` | Access localStorage, cookies, Supabase |
| `allow-forms` | Input fields, dialogs |
| `allow-popups` | External editor windows (Jfxr, Yarn) |
| `allow-modals` | Alert/confirm dialogs |
| `allow-downloads` | Export downloads |
| `allow-clipboard-read/write` | Copy/paste in editor |

---

## Authentication Strategies

### Option A: Token Proxy (Recommended)
Parent holds Supabase session, passes `accessToken` to iframe. Iframe creates Supabase client with token.

### Option B: Parent-Only Supabase
Iframe sends all data operations via `postMessage` to parent. Parent executes Supabase calls.

### Option C: Cookie-Based (Same Domain)
If hosted on same root domain, cookies work automatically.

---

## Error Handling

```javascript
window.addEventListener('message', (e) => {
  if (e.data.type === 'ERROR') {
    // Handle gracefully
    if (e.data.payload.code === 'SAVE_FAILED') {
      showToast('Save failed. Retrying...');
      setTimeout(() => send('SAVE_PROJECT'), 5000);
    }
  }
});
```

---

## Version Detection

```javascript
send('GET_VERSION');
// Returns: { version: '0.1.0', buildHash: 'abc123def' }
```

---

## External Editors

AirStudio opens these in popups (need `allow-popups`):
- **AirCanvas** (sprite editor) - `external/aircanvas/`
- **Jfxr** (sound effects) - `external/jfxr/`
- **Yarn** (dialogue trees) - `external/yarn/`

They communicate via same `postMessage` protocol.

---

## Async/Turn-Based Games

AirStudio's built-in multiplayer is **real-time** (WebRTC). For async games:

1. **Game state** → Send via `GAME_TURN_ENDED` custom event to parent
2. **Parent** → Persist to Supabase (`games` table)
3. **Supabase Realtime** → Notify next player
4. **Next player opens game** → `LOAD_PROJECT` with saved state

```javascript
// In game events (AirStudio)
function submitTurn(nextPlayerId, state) {
  parent.postMessage({
    type: 'GAME_TURN_ENDED',
    payload: { nextPlayerId, gameState: state, turn: currentTurn + 1 }
  }, origin);
}
```

---

## Deployment Checklist

- [ ] Serve `build/` with correct MIME types (`.wasm` → `application/wasm`)
- [ ] Enable CORS for `libGD.wasm` if on different domain
- [ ] Set `Content-Security-Policy: frame-ancestors https://yourapp.com`
- [ ] Enable HTTPS (required for `allow-same-origin`, clipboard, Service Worker)
- [ ] Configure `Referrer-Policy: same-origin`
- [ ] Test in target browsers (Chrome, Firefox, Safari, Edge)

---

## File Structure (Deploy `build/`)

```
build/
├── index.html
├── favicon.ico, favicon-*.png, apple-touch-icon.png
├── manifest.json
├── libGD.js
├── libGD.wasm
├── service-worker.js
├── static/
│   ├── js/*.js (chunked)
│   ├── css/*.css
│   └── media/*
├── external/
│   ├── aircanvas/ (sprite editor)
│   ├── jfxr/ (sound editor)
│   └── yarn/ (dialogue editor)
├── res/ (editor icons)
├── CppPlatform/ (native export templates)
├── JsPlatform/ (HTML5 export templates)
└── GDJS/ (runtime source for preview)
```

---

## Support

- **Repository:** https://github.com/airstudio/airstudio
- **Issues:** https://github.com/airstudio/airstudio/issues
- **Discord:** https://discord.gg/airstudio

---

*AirStudio — Web-based game engine, embeddable anywhere.*