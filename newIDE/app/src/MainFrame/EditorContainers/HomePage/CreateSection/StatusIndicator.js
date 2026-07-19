// @flow
import * as React from 'react';
import AirStudioThemeContext from '../../../../UI/Theme/AirStudioThemeContext';

type Props = {|
  status: 'success' | 'error' | 'warning',
|};

const StatusIndicator = ({ status }: Props): React.MixedElement => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);

  const color =
    status === 'success'
      ? airStudioTheme.statusIndicator.success
      : status === 'error'
      ? airStudioTheme.statusIndicator.error
      : airStudioTheme.statusIndicator.warning;
  return (
    <div
      style={{
        width: 8,
        height: 8,
        margin: 6,
        borderRadius: 6,
        backgroundColor: color,
      }}
    />
  );
};

export default StatusIndicator;
