// @flow
import * as React from 'react';

import MuiLinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';

const styles = {
  linearProgress: { flex: 1 },
};

type Props = {|
  expand?: boolean,
  value?: ?number,
|};

function ColoredLinearProgress(props: Props): React.Node {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const classes = makeStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: airStudioTheme.paper.backgroundColor.medium,
    },
    bar: {
      borderRadius: 5,
      backgroundColor:
        props.value === 100
          ? airStudioTheme.linearProgress.color.complete
          : airStudioTheme.linearProgress.color.incomplete,
    },
  })();

  return (
    <MuiLinearProgress
      classes={classes}
      style={styles.linearProgress}
      variant="determinate"
      value={props.value}
    />
  );
}

export default ColoredLinearProgress;
