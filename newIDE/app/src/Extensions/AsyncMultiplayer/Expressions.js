// @flow
/**
 * Async Multiplayer Extension - Expressions
 */

const expressions = [
  {
    name: 'CurrentTurn',
    description: t`Current turn number`,
    group: t`Turn`,
    parameters: [],
  },
  {
    name: 'CurrentPlayerIndex',
    description: t`Current player index`,
    group: t`Turn`,
    parameters: [],
  },
  {
    name: 'PlayerCount',
    description: t`Total player count`,
    group: t`Players`,
    parameters: [],
  },
  {
    name: 'PlayerIdAt',
    description: t`Player ID at index`,
    group: t`Players`,
    parameters: [
      {
        name: 'index',
        label: t`Player Index`,
        type: 'NUMBER',
      },
    ],
  },
  {
    name: 'GameDataString',
    description: t`Game data string`,
    group: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
      },
      {
        name: 'defaultValue',
        label: t`Default`,
        type: 'STRING',
        defaultValue: '""',
      },
    ],
  },
  {
    name: 'GameDataNumber',
    description: t`Game data number`,
    group: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
      },
      {
        name: 'defaultValue',
        label: t`Default`,
        type: 'NUMBER',
        defaultValue: 0,
      },
    ],
  },
  {
    name: 'GameDataBool',
    description: t`Game data boolean`,
    group: t`Game Data`,
    parameters: [
      {
        name: 'key',
        label: t`Key`,
        type: 'STRING',
      },
      {
        name: 'defaultValue',
        label: t`Default`,
        type: 'BOOLEAN',
        defaultValue: false,
      },
    ],
  },
  {
    name: 'WinnerIndex',
    description: t`Winner player index`,
    group: t`Game State`,
    parameters: [],
  },
  {
    name: 'TurnNumber',
    description: t`Turn number`,
    group: t`Turn`,
    parameters: [],
  },
  {
    name: 'UnreadChatCount',
    description: t`Unread chat count`,
    group: t`Chat`,
    parameters: [],
  },
  {
    name: 'PendingInvitationCount',
    description: t`Pending invitations`,
    group: t`Invitations`,
    parameters: [],
  },
  {
    name: 'PlayerIdAt',
    description: t`Player ID at index`,
    group: t`Players`,
    parameters: [
      {
        name: 'index',
        label: t`Index`,
        type: 'NUMBER',
      },
    ],
  },
  {
    name: 'MyPlayerIndex',
    description: t`My player index`,
    group: t`Players`,
    parameters: [],
  },
];

export default expressions;