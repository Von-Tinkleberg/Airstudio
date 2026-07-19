// @flow
import { t } from '@lingui/macro';

export const actions = [
  {
    name: 'StartGame',
    description: t`Start multiplayer game`,
    fullDescription: t`Initialize and start a new async multiplayer game`,
    icon: 'play',
    category: t`Game Control`,
    parameters: [
      {
        name: 'gameId',
        label: t`Game ID`,
        type: 'STRING',
        description: t`Unique game session ID`,
      },
      {
        name: 'playerIds',
        label: t`Player IDs (comma-separated)`,
        type: 'STRING',
        description: t`Comma-separated list of player IDs in turn order`,
      },
      {
        name: 'initialData',
        label: t`Initial Game Data (JSON)`,
        type: 'STRING',
        description: t`Initial game state as JSON string`,
        defaultValue: '{}',
      },
    ],
  },
  {
    name: 'JoinGame',
    description: t`Join existing game`,
    fullDescription: t`Join an existing multiplayer game session`,
    icon: 'user-plus',
    category: t`Game Control`,
    parameters: [
      {
        name: 'gameId',
        label: t`Game ID`,
        type: 'STRING',
        description: t`Game session ID to join`,
      },
      {
        name: 'playerId',
        label: t`Your Player ID`,
        type: 'STRING',
        description: t`Your unique player ID`,
      },
    ],
  },
  {
    name: 'EndTurn',
    description: t`End turn and send data`,
    fullDescription: t`End current player's turn and send turn data to next player`,
    icon: 'turn-right',
    category: t`Turn Control`,
    parameters: [
      {
        name: 'turnData',
        label: t`Turn Data (JSON)`,
        type: 'STRING',
        description: t`Game state to send to next player as JSON string`,
        defaultValue: '{}',
      },
      {
        name: 'nextPlayerIndex',
        label: t`Next Player Index (optional)`,
        type: 'NUMBER',
        description: t`Force specific next player (0 = next in order, -1 = auto)`,
        defaultValue: -1,
      },
    ],
  },
  {
    name: 'ForfeitTurn',
    description: t`Forfeit turn`,
    fullDescription: t`Forfeit current turn, giving turn to next player`,
    icon: 'flag',
    category: t`Turn Control`,
    parameters: [],
  },
  {
    name: 'ForfeitGame',
    description: t`Forfeit game`,
    fullDescription: t`Forfeit the entire game (opponent wins)`,
    icon: 'flag',
    category: t`Game Control`,
    parameters: [],
  },
  {
    name: 'RequestGameState',
    description: t`Request current game state`,
    fullDescription: t`Request the current game state from the server`,
    icon: 'refresh',
    category: t`Game State`,
    parameters: [],
  },
  {
    name: 'SetGameData',
    description: t`Set game data`,
    fullDescription: t`Set a key-value pair in the game state (synced to all players)`,
    icon: 'data',
    category: t`Game State`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Data key`,
      },
      {
        name: 'value',
        label: t`Value (JSON)`,
        type: 'STRING',
        description: t`Value as JSON string`,
      },
    ],
  },
  {
    name: 'GetGameData',
    description: t`Get game data`,
    fullDescription: t`Get a value from the game state`,
    icon: 'data',
    category: t`Game State`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Data key to retrieve`,
      },
      {
        name: 'defaultValue',
        label: t`Default Value (JSON)`,
        type: 'STRING',
        description: t`Default if key not found`,
        defaultValue: 'null',
      },
    ],
  },
  {
    name: 'SendChatMessage',
    description: t`Send chat message`,
    fullDescription: t`Send a chat message to all players in the game`,
    icon: 'message',
    category: t`Chat`,
    parameters: [
      {
        name: 'message',
        label: t`Message`,
        type: 'STRING',
        description: t`Chat message text`,
      },
    ],
  },
  {
    name: 'InvitePlayer',
    description: t`Invite player to game`,
    fullDescription: t`Send an invitation to another player to join the game`,
    icon: 'user-plus',
    category: t`Game Control`,
    parameters: [
      {
        name: 'playerId',
        label: t`Player ID to invite`,
        type: 'STRING',
        description: t`Player ID to send invitation to`,
      },
      {
        name: 'message',
        label: t`Invitation message`,
        type: 'STRING',
        description: t`Optional message to include with invitation`,
        defaultValue: '',
      },
    ],
  },
];

export default actions;