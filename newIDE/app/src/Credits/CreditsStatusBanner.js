// @flow
import { Trans } from '@lingui/macro';
import * as React from 'react';
import { Column } from '../UI/Grid';
import AirStudioThemeContext from '../UI/Theme/AirStudioThemeContext';
import { LineStackLayout, ResponsiveLineStackLayout } from '../UI/Layout';
import FlatButton from '../UI/FlatButton';
import Text from '../UI/Text';
import AuthenticatedUserContext from '../Profile/AuthenticatedUserContext';
import Coin from './Icons/Coin';
import { CreditsPackageStoreContext } from '../AssetStore/CreditsPackages/CreditsPackageStoreContext';

const styles = {
  container: {
    borderRadius: 8,
    padding: 8,
  },
};

type Props = {|
  displayPurchaseAction: boolean,
  actionButtonLabel?: React.Node,
  onActionButtonClick?: () => void,
|};

const CreditsStatusBanner = ({
  displayPurchaseAction,
  actionButtonLabel,
  onActionButtonClick,
}: Props): null | React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const { limits, onRefreshLimits } = React.useContext(
    AuthenticatedUserContext
  );
  const { openCreditsPackageDialog } = React.useContext(
    CreditsPackageStoreContext
  );

  // Ensure credits are refreshed when this component is shown.
  React.useEffect(
    () => {
      onRefreshLimits();
    },
    [onRefreshLimits]
  );

  if (!limits) {
    return null;
  }

  return (
    <>
      <div
        style={{
          ...styles.container,
          backgroundColor: airStudioTheme.credits.backgroundColor,
          color: airStudioTheme.credits.color,
        }}
      >
        <ResponsiveLineStackLayout
          alignItems="center"
          justifyContent="space-between"
          noMargin
          noResponsiveLandscape
        >
          <Column>
            <LineStackLayout alignItems="flex-end" noMargin>
              <Coin />
              <Text noMargin color="inherit">
                <Trans>
                  Credits available: {limits.credits.userBalance.amount}
                </Trans>
              </Text>
            </LineStackLayout>
          </Column>
          {displayPurchaseAction && (
            <Column>
              <FlatButton
                label={<Trans>Get credit packs</Trans>}
                onClick={() =>
                  openCreditsPackageDialog({ showCalloutTip: true })
                }
                noBackground
              />
            </Column>
          )}
          {actionButtonLabel && (
            <Column>
              <FlatButton
                label={actionButtonLabel}
                onClick={onActionButtonClick}
                noBackground
              />
            </Column>
          )}
        </ResponsiveLineStackLayout>
      </div>
    </>
  );
};

export default CreditsStatusBanner;
