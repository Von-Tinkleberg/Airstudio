// @flow
import Window from '../Window';

const isDev = Window.isDev();

export const AirStudioGamePreviews = {
  baseUrl: `https://game-previews.airstudio.io/`,
};

export const AirStudioGamesPlatform = {
  getInstantBuildUrl: (buildId: string): string =>
    isDev
      ? `https://games.airstudio.io/instant-builds/${buildId}?dev=true`
      : `https://games.airstudio.io/instant-builds/${buildId}`,
  getGameUrl: (gameId: string): string =>
    isDev
      ? `https://games.airstudio.io/games/${gameId}?dev=true`
      : `https://games.airstudio.io/games/${gameId}`,
  getGameUrlWithSlug: (userSlug: string, gameSlug: string): string =>
    isDev
      ? `https://games.airstudio.io/${userSlug.toLowerCase()}/${gameSlug.toLowerCase()}?dev=true`
      : `https://games.airstudio.io/${userSlug.toLowerCase()}/${gameSlug.toLowerCase()}`,
  getUserPublicProfileUrl: (userId: string, username: ?string): string =>
    username
      ? `https://games.airstudio.io/${username}${isDev ? '?dev=true' : ''}`
      : `https://games.airstudio.io/user/${userId}${isDev ? '?dev=true' : ''}`,
};

export const AirStudioFirebaseConfig = {
  apiKey: 'AIzaSyAnX9QMacrIl3yo4zkVFEVhDppGVDDewBc',
  authDomain: 'airstudio-services.firebaseapp.com',
  databaseURL: 'https://airstudio-services.firebaseio.com',
  projectId: 'airstudio-services',
  storageBucket: 'airstudio-services.appspot.com',
  messagingSenderId: '44882707384',
};

export const AirStudioAuthorizationWebSocketApi = {
  baseUrl: ((isDev
    ? 'wss://api-ws-dev.airstudio.io/authorization'
    : 'wss://api-ws.airstudio.io/authorization'): string),
};

export const AirStudioBuildApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/build'
    : 'https://api.airstudio.io/build'): string),
};

export const AirStudioUsageApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/usage'
    : 'https://api.airstudio.io/usage'): string),
};

export const AirStudioReleaseApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/release'
    : 'https://api.airstudio.io/release'): string),
};

export const AirStudioAssetApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/asset'
    : 'https://api.airstudio.io/asset'): string),
};

export const AirStudioAssetCdn = {
  baseUrl: {
    staging: 'https://resources.airstudio.app/staging/assets-database',
    live: 'https://resources.airstudio.app/assets-database',
  },
};

export const AirStudioAnalyticsApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/analytics'
    : 'https://api.airstudio.io/analytics'): string),
};

export const AirStudioGameApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/game'
    : 'https://api.airstudio.io/game'): string),
};

export const AirStudioUserApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/user'
    : 'https://api.airstudio.io/user'): string),
};

export const AirStudioPlayApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/play'
    : 'https://api.airstudio.io/play'): string),
};

export const AirStudioShopApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/shop'
    : 'https://api.airstudio.io/shop'): string),
};

export const AirStudioProjectApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/project'
    : 'https://api.airstudio.io/project'): string),
};

export const AirStudioGenerationApi = {
  baseUrl: ((isDev
    ? 'https://api-dev.airstudio.io/generation'
    : 'https://api.airstudio.io/generation'): string),
};

export const AirStudioAiCdn = {
  baseUrl: {
    staging: 'https://public-resources.airstudio.io/staging/ai',
    live: 'https://public-resources.airstudio.io/ai',
  },
};

export const AirStudioProjectResourcesStorage = {
  baseUrl: ((isDev
    ? 'https://project-resources-dev.airstudio.io'
    : 'https://project-resources.airstudio.io'): string),
};

export const AirStudioPrivateAssetsStorage = {
  baseUrl: ((isDev
    ? 'https://private-assets-dev.airstudio.io'
    : 'https://private-assets.airstudio.io'): string),
};

export const AirStudioPrivateGameTemplatesStorage = {
  baseUrl: ((isDev
    ? 'https://private-game-templates-dev.airstudio.io'
    : 'https://private-game-templates.airstudio.io'): string),
};

export const AirStudioPublicAssetResourcesStorageBaseUrl =
  'https://asset-resources.airstudio.io';
export const AirStudioPublicAssetResourcesStorageStagingBaseUrl =
  'https://asset-resources.airstudio.io/staging';
