// @flow
/**
 * Async Multiplayer Extension - Conditions
 */

const conditions = [
  {
    name: 'IsMyTurn',
    description: t`Is it my turn?`,
    fullDescription: t`Check if it's currently the local player's turn`,
    category: t`Turn Control`,
    parameters: [],
  },
  {
    name: 'IsGameActive',
    description: t`Is game active?`,
    fullDescription: t`Check if the game is currently in progress (not finished)`,
    category: t`Game State`,
    parameters: [],
  },
  {
    name: 'IsGameFinished',
    description: t`Is game finished?`,
    fullDescription: t`Check if the game has ended (win/lose/draw/forfeit)`,
    category: t`Game State`,
    parameters: [],
  },
  {
    name: 'GetWinner',
    description: t`Get winner`,
    fullDescription: t`Get the winner of the game (player index, -1 = draw, -2 = no winner yet)`,
    category: t`Game State`,
    parameters: [],
  },
  {
    name: 'GetCurrentPlayerIndex',
    description: t`Get current player index`,
    fullDescription: t`Get the index of the player whose turn it currently is (0-based)`,
    category: t`Turn Control`,
    parameters: [],
  },
  {
    name: 'GetPlayerCount',
    description: t`Get player count`,
    fullDescription: t`Get the total number of players in the game`,
    category: t`Players`,
    parameters: [],
  },
  {
    name: 'GetPlayerIdAtIndex',
    description: t`Get player ID at index`,
    fullDescription: t`Get the player ID (Supabase user ID) at a given player index`,
    category: t`Players`,
    parameters: [
      {
        name: 'index',
        label: t`Player Index`,
        type: 'NUMBER',
        description: t`Player index (0-based)`,
      },
    ],
  },
  {
    name: 'IsPlayerConnected',
    description: t`Is player connected?`,
    fullDescription: t`Check if a player is currently connected to the game`,
    category: t`Players`,
    parameters: [
      {
        name: 'playerIndex',
        label: t`Player Index`,
        type: 'NUMBER',
        description: t`Player index to check`,
      },
    ],
  },
  {
    name: 'GetTurnNumber',
    description: t`Get turn number`,
    fullDescription: t`Get the current turn number (1-based)`,
    category: t`Turn Control`,
    parameters: [],
  },
  {
    name: 'HasGameData',
    description: t`Has game data?`,
    fullDescription: t`Check if a key exists in the game data`,
    category: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Key to check`,
      },
    ],
  },
  {
    name: 'GetGameDataString',
    description: t`Get game data as string`,
    fullDescription: t`Get a string value from game data`,
    category: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Key to retrieve`,
      },
      {
        name: 'defaultValue',
        label: t`Default Value`,
        type: 'STRING',
        defaultValue: '""',
      },
    ],
  },
  {
    name: 'GetGameDataNumber',
    description: t`Get game data as number`,
    fullDescription: t`Get a numeric value from game data`,
    category: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Key to retrieve`,
      },
      {
        name: 'defaultValue',
        label: t`Default Value`,
        type: 'NUMBER',
        defaultValue: 0,
      },
    ],
  },
  {
    name: 'GetGameDataBool',
    description: t`Get game data as boolean`,
    fullDescription: t`Get a boolean value from game data`,
    category: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
        description: t`Key to retrieve`,
      },
      {
        name: 'defaultValue',
        label: t`Default Value`,
        type: 'BOOLEAN',
        defaultValue: false,
      },
    ],
  },
  {
    name: 'HasUnreadChatMessages',
    description: t`Has unread chat messages?`,
    fullDescription: t`Check if there are unread chat messages for the local player`,
    category: t`Chat`,
    parameters: [],
  },
  {
    name: 'GetUnreadChatCount',
    description: t`Get unread chat count`,
    fullDescription: t`Get the number of unread chat messages`,
    category: t`Chat`,
    parameters: [],
  },
  {
    name: 'IsInvitationPending',
    description: t`Is invitation pending?`,
    fullDescription: t`Check if there's a pending invitation for the local player`,
    category: t`Invitations`,
    parameters: [],
  },
  {
    name: 'GetPendingInvitations',
    description: t`Get pending invitations`,
    fullDescription: t`Get list of pending game invitations for the local player`,
    category: t`Invitations`,
    parameters: [],
  },
  {
    name: 'CanStartGame',
    description: t`Can start game?`,
    fullDescription: t`Check if enough players are connected to start the game`,
    category: t`Game Control`,
    parameters: [
      {
        name: 'minPlayers',
        label: t`Minimum Players`,
        type: 'NUMBER',
        defaultValue: 2,
      },
    ],
  },
];

export default conditions;