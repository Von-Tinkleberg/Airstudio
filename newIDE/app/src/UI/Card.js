// @flow

import * as React from 'react';
import MUICard from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';
import { Column, Line } from './Grid';
import { useResponsiveWindowSize } from './Responsive/ResponsiveWindowMeasurer';

const highlightedBorderWidth = 4;

const styles = {
  headerContainer: {
    minWidth: 0,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  cardContent: {
    minWidth: 0,
  },
};

type Props = {|
  children: React.Node,
  cardCornerAction?: React.Node,
  header?: React.Node,
  background?: 'medium' | 'dark',

  disabled?: boolean,
  isHighlighted?: boolean,
  padding?: number,
|};

const Card = ({
  children,
  header,
  background,
  cardCornerAction,
  isHighlighted,
  disabled,
  padding,
}: Props): React.Node => {
  const { isMobile } = useResponsiveWindowSize();
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const cardContentStyle: {|
    minWidth: number,
    padding?: number | string,
    marginLeft?: number,
    paddingTop?: number,
    paddingBottom?: number,
    paddingLeft?: number,
    paddingRight?: number,
  |} = {
    ...styles.cardContent,
    ...{
      paddingTop: padding || 0,
      paddingBottom: padding || 18,
      paddingRight: padding || (isMobile ? 8 : 24),
      paddingLeft: Math.max(
        0,
        // Compensate offset brought by left border
        padding || (isMobile ? 8 : 24) - highlightedBorderWidth
      ),
    },
  };
  return (
    <MUICard
      elevation={0}
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor:
          background === 'dark'
            ? airStudioTheme.paper.backgroundColor.dark
            : airStudioTheme.paper.backgroundColor.medium,
        ...(isHighlighted
          ? {
              borderWidth: `0 0 0 ${highlightedBorderWidth}px`,
              borderStyle: 'solid',
              borderLeftColor: airStudioTheme.message.valid,
            }
          : {}),
      }}
    >
      <Column expand noMargin>
        {header && (
          <Line justifyContent="space-between" expand>
            <div
              style={{
                ...styles.headerContainer,
                paddingLeft: isMobile ? 8 : 24,
                paddingRight: cardCornerAction ? (isMobile ? 8 : 24) : 0,
              }}
            >
              {header}
            </div>
            <Column>{cardCornerAction}</Column>
          </Line>
        )}
        <CardContent style={cardContentStyle}>{children}</CardContent>
      </Column>
    </MUICard>
  );
};

export default Card;
