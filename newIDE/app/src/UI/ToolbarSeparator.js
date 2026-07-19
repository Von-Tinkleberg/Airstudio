// @flow
import React from 'react';
import AirStudioThemeContext from '../UI/Theme/AirStudioThemeContext';

const ToolbarSeparator = (): React.MixedElement => {
  const theme = React.useContext(AirStudioThemeContext);
  return (
    <span
      style={{
        height: 32,
        marginLeft: 3,
        marginRight: 3,
        borderLeftStyle: 'solid',
        borderLeftWidth: 1,
        borderColor: theme.toolbar.separatorColor,
      }}
    />
  );
};

export default ToolbarSeparator;
