// @flow
import * as React from 'react';

import MuiLinearProgress from '@material-ui/core/LinearProgress';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = (
  color?: 'success',
  barColor?: string,
  trackColor?: string,
  airStudioTheme: airStudioTheme
) =>
  makeStyles({
    colorSecondary: {
      backgroundColor: trackColor || airStudioTheme.paper.backgroundColor.light,
    },
    barColorSecondary: {
      backgroundColor:
        barColor ||
        (color === 'success'
          ? airStudioTheme.statusIndicator.success
          : airStudioTheme.palette.secondary),
    },
  })();

type Props = {|
  variant?: 'indeterminate' | 'determinate',
  color?: 'success',
  barColor?: string,
  trackColor?: string,
  value?: ?number,
  style?: {| height?: number, borderRadius?: number, width?: number |},
|};

function LinearProgress(props: Props): React.Node {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const classes = useStyles(
    props.color,
    props.barColor,
    props.trackColor,
    airStudioTheme
  );

  return (
    <MuiLinearProgress
      classes={classes}
      color="secondary"
      style={{ flex: 1, ...props.style }}
      variant={props.variant}
      value={props.value}
    />
  );
}

export default LinearProgress;
