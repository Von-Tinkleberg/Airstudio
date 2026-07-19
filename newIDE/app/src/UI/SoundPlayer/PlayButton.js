// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Play from '../CustomSvgIcons/Play';
import Pause from '../CustomSvgIcons/Pause';
import { makeStyles } from '@material-ui/styles';
import AirStudioThemeContext from '../Theme/AirStudioThemeContext';

type Props = {|
  primary?: boolean,
  isPlaying: boolean,
  onClick: () => void,
|};

const PlayButton = (props: Props): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const playButtonTheme =
    airStudioTheme.soundPlayer.playButton[
      props.primary ? 'primary' : 'secondary'
    ];

  const classes = makeStyles({
    root: {
      color: playButtonTheme.color,
      backgroundColor: playButtonTheme.backgroundColor,
      outlineColor: playButtonTheme.borderColor,
      outlineWidth: 2,
      outlineStyle: 'solid',
      '&:hover': {
        backgroundColor: playButtonTheme.hover.backgroundColor,
        outlineColor: playButtonTheme.hover.borderColor,
      },
    },
  })();
  return (
    <IconButton classes={classes} onClick={props.onClick}>
      {props.isPlaying ? <Pause /> : <Play />}
    </IconButton>
  );
};

export default PlayButton;
