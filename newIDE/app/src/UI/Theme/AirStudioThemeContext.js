// @flow
import * as React from 'react';
import { type airStudioTheme } from '.';
import DefaultLightTheme from './DefaultLightTheme';

const AirStudioThemeContext: React.Context<any> = React.createContext<airStudioTheme>(
  DefaultLightTheme.airStudioTheme
);

export default AirStudioThemeContext;
