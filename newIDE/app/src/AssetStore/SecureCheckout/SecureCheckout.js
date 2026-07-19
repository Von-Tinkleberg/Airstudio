// @flow
import React from 'react';
import { LineStackLayout } from '../../UI/Layout';
import Text from '../../UI/Text';
import { Trans } from '@lingui/macro';
import AirStudioThemeContext from '../../UI/Theme/AirStudioThemeContext';
import ShieldChecked from '../../UI/CustomSvgIcons/ShieldChecked';
import ThumbsUp from '../../UI/CustomSvgIcons/ThumbsUp';
import { Spacer } from '../../UI/Grid';

const SecureCheckout = ({
  includeCancelInformation,
  noMargin,
}: {|
  includeCancelInformation?: boolean,
  noMargin?: boolean,
|}): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  return (
    <LineStackLayout
      noMargin={noMargin}
      justifyContent="center"
      alignItems="center"
    >
      <ShieldChecked style={{ color: airStudioTheme.message.valid }} />
      <Text color="secondary">
        <Trans>Paypal secure</Trans>
      </Text>
      <ShieldChecked style={{ color: airStudioTheme.message.valid }} />
      <Text color="secondary">
        <Trans>Stripe secure</Trans>
      </Text>
      {includeCancelInformation && (
        <>
          <ThumbsUp
            style={{
              color: airStudioTheme.message.valid,
              width: 20,
              height: 20,
            }}
          />
          <Spacer />
          <Text color="secondary">
            <Trans>Cancel anytime</Trans>
          </Text>
        </>
      )}
    </LineStackLayout>
  );
};

export default SecureCheckout;
