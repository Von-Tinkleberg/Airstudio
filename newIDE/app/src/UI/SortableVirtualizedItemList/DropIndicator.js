// @flow
import * as React from 'react';
import AirStudioThemeContext from '../Theme/AirStudioThemeContext';

const styles = {
  dropIndicator: {
    borderTop: '2px solid black',
    height: 0,
    marginTop: '-1px',
    marginBottom: '-1px',
    width: '100%',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  },
};

type Props = {| canDrop: boolean, zIndex?: 1 |};

export default function DropIndicator({
  canDrop,
  zIndex,
}: Props): React.MixedElement {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  return (
    <div
      style={{
        ...styles.dropIndicator,
        borderColor: canDrop
          ? airStudioTheme.dropIndicator.canDrop
          : airStudioTheme.dropIndicator.cannotDrop,
        zIndex: zIndex || undefined,
      }}
    />
  );
}
