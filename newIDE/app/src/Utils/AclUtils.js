// @flow

import { t } from '@lingui/macro';
import { type Level } from './AirStudioServices/Project';

export const getTranslatableLevel = (level: Level): any => {
  switch (level) {
    case 'owner':
      return t`Owner`;
    case 'writer':
      return t`Read & Write`;
    case 'reader':
      return t`Read only`;
    default:
      return level;
  }
};
