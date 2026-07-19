// @flow

import * as React from 'react';
import AirStudioThemeContext from '../UI/Theme/AirStudioThemeContext';

const styles = {
  dot: {
    marginRight: 4,
    flexShrink: 0,
  },
};

const NotificationDot = ({
  color,
  size = 6,
}: {
  size?: number,
  color: 'notification' | 'warning',
}): React.MixedElement => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  return (
    <span
      style={{
        ...styles.dot,
        height: size,
        width: size,
        borderRadius: Math.ceil(size / 2),
        backgroundColor:
          color === 'notification'
            ? airStudioTheme.notification.badgeColor
            : airStudioTheme.statusIndicator.warning,
      }}
    />
  );
};

export default NotificationDot;
