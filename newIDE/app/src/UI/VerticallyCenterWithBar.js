// @flow

import * as React from 'react';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';

const styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'stretch',
    alignItems: 'center',
  },
  verticalBar: {
    flex: 1,
  },
  childrenContainer: {
    flex: 0,
  },
};

type Props = {|
  children: React.Node,
|};

const VerticallyCenterWithBar = (props: Props): React.MixedElement => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.verticalBar,
          borderLeft: `1px solid ${airStudioTheme.palette.secondary}`,
        }}
      />
      <div style={styles.childrenContainer}>{props.children}</div>
      <div
        style={{
          ...styles.verticalBar,
          borderLeft: `1px solid ${airStudioTheme.palette.secondary}`,
        }}
      />
    </div>
  );
};

export default VerticallyCenterWithBar;
