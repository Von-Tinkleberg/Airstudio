// @flow
import { t } from '@lingui/macro';

export default {
  name: 'AsyncMultiplayer',
  description: t`Async Turn-Based Multiplayer - Send turns via parent app (Supabase Realtime)`,
  fullDescription: t`Enables asynchronous turn-based multiplayer games. Players take turns and the game state is synced via your host app's Supabase Realtime.`,
  icon: 'turn-right',
  extensionId: 'async-multiplayer',
  author: 'AirStudio Team',
  license: 'MIT',
  website: 'https://airstudio.io',
  version: '1.0.0',
  minAirStudioVersion: '5.4.0',
};