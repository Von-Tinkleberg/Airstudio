// @flow
import * as React from 'react';
import AirStudioThemeContext from '../UI/Theme/AirStudioThemeContext';

export type InGameEditorSettings = {
  theme: {
    iconButtonSelectedBackgroundColor: string,
    iconButtonSelectedColor: string,
    toolbarBackgroundColor: string,
    toolbarSeparatorColor: string,
    textColorPrimary: string,
  },
};

/**
 * Generate the settings sent to the in-game editor, either at preview launch
 * or when there is a change in the settings.
 */
export const useInGameEditorSettings = (): InGameEditorSettings => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const iconButtonSelectedBackgroundColor =
    airStudioTheme.iconButton.selectedBackgroundColor;
  const iconButtonSelectedColor = airStudioTheme.iconButton.selectedColor;
  const toolbarBackgroundColor = airStudioTheme.toolbar.backgroundColor;
  const toolbarSeparatorColor = airStudioTheme.toolbar.separatorColor;
  const textColorPrimary = airStudioTheme.text.color.primary;

  const inGameEditorSettings = React.useMemo<InGameEditorSettings>(
    () => ({
      theme: {
        iconButtonSelectedBackgroundColor,
        iconButtonSelectedColor,
        toolbarBackgroundColor,
        toolbarSeparatorColor,
        textColorPrimary,
      },
    }),
    [
      iconButtonSelectedBackgroundColor,
      iconButtonSelectedColor,
      toolbarBackgroundColor,
      toolbarSeparatorColor,
      textColorPrimary,
    ]
  );

  return inGameEditorSettings;
};
