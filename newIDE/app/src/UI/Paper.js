// @flow
import * as React from 'react';
import MuiPaper from '@material-ui/core/Paper';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';

type Props = {|
  id?: string,
  children: React.Node,
  elevation?: number,
  variant?: 'outlined',
  // The background property allows to create contrast between papers,
  // 'dark' corresponds to the darker background on Dark theme,
  // but it corresponds to the lighter background on Light theme.
  background: 'light' | 'medium' | 'dark',
  style?: Object,
  square?: boolean,
|};

export const getBackgroundColor = (
  airStudioTheme: airStudioTheme,
  backgroundColor: 'light' | 'medium' | 'dark'
): any =>
  backgroundColor === 'dark'
    ? airStudioTheme.paper.backgroundColor.dark
    : backgroundColor === 'medium'
    ? airStudioTheme.paper.backgroundColor.medium
    : airStudioTheme.paper.backgroundColor.light;

const Paper: React.ComponentType<{
  ...Props,
  +ref?: React.RefSetter<HTMLDivElement>,
}> = React.forwardRef<Props, HTMLDivElement>(
  ({ id, children, background, elevation, variant, style, square }, ref) => {
    const airStudioTheme = React.useContext(AirStudioThemeContext);
    const backgroundColor = getBackgroundColor(airStudioTheme, background);
    return (
      <MuiPaper
        id={id}
        ref={ref}
        variant={variant}
        elevation={elevation || 0}
        style={{
          backgroundColor,
          ...style,
        }}
        square={!!square}
      >
        {children}
      </MuiPaper>
    );
  }
);

export default Paper;
