// @flow

const COMMAND_TYPES = [
  'CREATE_PROJECT', 'LOAD_PROJECT', 'SAVE_PROJECT', 
  'EXPORT_GAME', 'GET_PROJECT_DATA', 'GET_VERSION',
  'CLOSE_PROJECT', 'UNDO', 'REDO'
];

const DEFAULT_ALLOWED_ORIGINS = ['*'];

function createIframeApi() {
  const listeners = new Map();
  let isReady = false;
  let parentWindow = null;
  let inIframe = false;
  let allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS];
  let projectLoader = null;
  let projectSaver = null;
  let projectCreator = null;
  let projectExporter = null;
  let projectCloser = null;

  function detectIframe() {
    try {
      inIframe = window.self !== window.top;
      parentWindow = window.parent;
    } catch (e) {
      inIframe = true;
    }
  }

  function isOriginAllowed(origin) {
    return allowedOrigins.includes('*') || allowedOrigins.includes(origin);
  }

  function notifyListeners(message) {
    const handlers = listeners.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (e) {
          console.error('[IframeApi] Listener error:', e);
        }
      });
    }
    const allHandlers = listeners.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => {
        try {
          handler(message);
        } catch (e) {
          console.error('[IframeApi] Wildcard listener error:', e);
        }
      });
    }
  }

  function setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.source === window) return;
      if (!isOriginAllowed(event.origin)) {
        console.warn('[IframeApi] Blocked message from disallowed origin:', event.origin);
        return;
      }
      const message = event.data;
      if (!message || !message.type) return;

      if (isCommand(message)) {
        handleCommand(message);
      }

      notifyListeners(message);
    });
  }

  function isCommand(message) {
    return COMMAND_TYPES.includes(message.type);
  }

  async function handleCommand(command) {
    try {
      switch (command.type) {
        case 'CREATE_PROJECT':
          await handleCreateProject(command.payload && command.payload.projectName);
          break;
        case 'LOAD_PROJECT':
          await handleLoadProject(command.payload.projectJson, command.payload.fileMetadata);
          break;
        case 'SAVE_PROJECT':
          await handleSaveProject();
          break;
        case 'EXPORT_GAME':
          await handleExportGame(command.payload && command.payload.exportType);
          break;
        case 'GET_PROJECT_DATA':
          handleGetProjectData();
          break;
        case 'GET_VERSION':
          handleGetVersion();
          break;
        case 'CLOSE_PROJECT':
          await handleCloseProject();
          break;
        case 'UNDO':
          handleUndo();
          break;
        case 'REDO':
          handleRedo();
          break;
        default:
          break;
      }
    } catch (error) {
      sendEvent({ type: 'ERROR', payload: { message: error.message, code: error.code } });
    }
  }

  async function handleCreateProject(projectName) {
    if (!projectCreator) {
      sendEvent({ type: 'ERROR', payload: { message: 'Project creator not configured' } });
      return;
    }
    const fileMetadata = await projectCreator(projectName || 'New AirStudio Project');
    sendEvent({ type: 'PROJECT_CREATED', payload: { fileMetadata } });
  }

  async function handleLoadProject(projectJson, fileMetadata) {
    if (!projectLoader) {
      sendEvent({ type: 'ERROR', payload: { message: 'Project loader not configured' } });
      return;
    }
    await projectLoader(projectJson, fileMetadata);
    sendEvent({ type: 'PROJECT_LOADED', payload: { fileMetadata } });
  }

  async function handleSaveProject() {
    if (!projectSaver) {
      sendEvent({ type: 'ERROR', payload: { message: 'Project saver not configured' } });
      return;
    }
    const { projectJson, fileMetadata } = await projectSaver();
    sendEvent({ type: 'PROJECT_SAVED', payload: { fileMetadata, projectJson } });
  }

  async function handleExportGame(exportType) {
    if (!projectExporter) {
      sendEvent({ type: 'ERROR', payload: { message: 'Project exporter not configured' } });
      return;
    }
    const url = await projectExporter(exportType);
    sendEvent({ type: 'PROJECT_EXPORTED', payload: { url, format: exportType || 'html5' } });
  }

  async function handleGetProjectData() {
    if (projectSaver) {
      try {
        const { projectJson, fileMetadata } = await projectSaver();
        sendEvent({ type: 'PROJECT_DATA', payload: { projectJson, fileMetadata } });
      } catch (e) {
        sendEvent({ type: 'ERROR', payload: { message: e.message } });
      }
    }
  }

  function handleGetVersion() {
    try {
      const Version = require('../Version');
      sendEvent({ 
        type: 'VERSION', 
        payload: { 
          version: Version.getIDEVersion(), 
          buildHash: Version.getIDEVersionWithHash() 
        } 
      });
    } catch (e) {
      sendEvent({ type: 'VERSION', payload: { version: '0.1.0', buildHash: 'unknown' } });
    }
  }

  async function handleCloseProject() {
    if (projectCloser) {
      await projectCloser();
    }
    sendEvent({ type: 'PROJECT_CLOSED' });
  }

  function handleUndo() {
    if (window.editorHistory) {
      window.editorHistory.undo();
    }
  }

  function handleRedo() {
    if (window.editorHistory) {
      window.editorHistory.redo();
    }
  }

  function getTargetOrigin() {
    if (allowedOrigins.includes('*')) return '*';
    return allowedOrigins[0] || '*';
  }

  function sendCommand(command) {
    if (parentWindow) {
      parentWindow.postMessage(command, getTargetOrigin());
    }
  }

  function sendEvent(event) {
    if (parentWindow) {
      parentWindow.postMessage(event, getTargetOrigin());
    }
    notifyListeners(event);
  }

  function init() {
    detectIframe();
    setupMessageListener();
    isReady = true;
    
    if (inIframe && parentWindow) {
      parentWindow.postMessage({ type: 'READY' }, getTargetOrigin());
    }
  }

  return {
    init,
    setAllowedOrigins: (origins) => {
      allowedOrigins = Array.isArray(origins) ? [...origins] : [origins];
    },
    addAllowedOrigin: (origin) => {
      if (!allowedOrigins.includes(origin)) {
        allowedOrigins.push(origin);
      }
    },
    on: (event, handler) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event).push(handler);
      return () => {
        const handlers = listeners.get(event);
        if (handlers) {
          const idx = handlers.indexOf(handler);
          if (idx >= 0) handlers.splice(idx, 1);
        }
      };
    },
    sendCommand,
    sendEvent,
    isReady: () => isReady,
    isInIframe: () => inIframe,
    setProjectLoader: (loader) => { projectLoader = loader; },
    setProjectSaver: (saver) => { projectSaver = saver; },
    setProjectCreator: (creator) => { projectCreator = creator; },
    setProjectExporter: (exporter) => { projectExporter = exporter; },
    setProjectCloser: (closer) => { projectCloser = closer; },
  };
}

let instance = null;

function getIframeApi() {
  if (!instance) {
    instance = createIframeApi();
  }
  return instance;
}

if (typeof window !== 'undefined') {
  window.AirStudioIframeApi = getIframeApi();
}

module.exports = { getIframeApi };
