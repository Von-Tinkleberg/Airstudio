// @flow
import * as React from 'react';
import AirStudioThemeContext from '../../UI/Theme/AirStudioThemeContext';

const styles = {
  columnDropIndicator: {
    borderRight: '1px solid',
    borderLeft: '1px solid',
    width: 8,
    marginLeft: '-1px',
    height: '100%',
    boxSizing: 'border-box',
  },
};

export function ColumnDropIndicator(): React.MixedElement {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  return (
    <div
      style={{
        ...styles.columnDropIndicator,
        backgroundColor: airStudioTheme.dropIndicator.canDrop,
        borderColor: airStudioTheme.dropIndicator.border,
      }}
    />
  );
}
