// @flow
import * as React from 'react';
import { I18n } from '@lingui/react';

import {
  type SubscriptionPlanWithPricingSystems,
  type SubscriptionPlanPricingSystem,
} from '../../Utils/AirStudioServices/Usage';
import Text from '../../UI/Text';
import { Column, Line } from '../../UI/Grid';
import AirStudioThemeContext from '../../UI/Theme/AirStudioThemeContext';
import { ResponsiveLineStackLayout } from '../../UI/Layout';
import CheckCircle from '../../UI/CustomSvgIcons/CheckCircle';
import Paper from '../../UI/Paper';
import { useResponsiveWindowSize } from '../../UI/Responsive/ResponsiveWindowMeasurer';
import { selectMessageByLocale } from '../../Utils/i18n/MessageByLocale';
import { Trans } from '@lingui/macro';
import InfoIcon from '../../UI/CustomSvgIcons/CircledInfo';
import { Tooltip } from '@material-ui/core';
import Silver from './Icons/Silver';
import Gold from './Icons/Gold';
import Education from './Icons/Education';
import Startup from './Icons/Startup';
import Business from './Icons/Business';
import AirStudioGLogo from '../../UI/CustomSvgIcons/AirStudioGLogo';

export const formatPriceWithCurrency = (
  amountInCents: number,
  currency: string
): string => {
  if (currency === 'USD') {
    return `$${amountInCents / 100}`;
  }
  return `${amountInCents / 100}${currency === 'EUR' ? 'â‚¬' : currency}`;
};

export const getPlanPrice = (
  pricingSystem: SubscriptionPlanPricingSystem
): React.Node => {
  const price = (
    <Column noMargin alignItems="center">
      <b>
        {formatPriceWithCurrency(
          pricingSystem.amountInCents,
          pricingSystem.currency
        )}
      </b>
    </Column>
  );

  if (pricingSystem.period === 'week') {
    if (pricingSystem.periodCount === 1) {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="week" noMargin color="primary">
            <Trans>{price} per seat, each week</Trans>
          </Text>
        );
      } else {
        return (
          <Text key="week" noMargin color="primary">
            <Trans>{price} per week</Trans>
          </Text>
        );
      }
    } else {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="week" noMargin color="primary">
            <Trans>
              {price} per seat, every {pricingSystem.periodCount} weeks
            </Trans>
          </Text>
        );
      } else {
        return (
          <Text key="week" noMargin color="primary">
            <Trans>
              {price} every {pricingSystem.periodCount} weeks
            </Trans>
          </Text>
        );
      }
    }
  } else if (pricingSystem.period === 'month') {
    if (pricingSystem.periodCount === 1) {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="month" noMargin color="primary">
            <Trans>{price} per seat, each month</Trans>
          </Text>
        );
      } else {
        return (
          <Text key="month" noMargin color="primary">
            <Trans>{price} per month</Trans>
          </Text>
        );
      }
    } else {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="month" noMargin color="primary">
            <Trans>
              {price} per seat, every {pricingSystem.periodCount} months
            </Trans>
          </Text>
        );
      } else {
        return (
          <Text key="month" noMargin color="primary">
            <Trans>
              {price} every {pricingSystem.periodCount} months
            </Trans>
          </Text>
        );
      }
    }
  } else {
    if (pricingSystem.periodCount === 1) {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="year" noMargin color="primary">
            <Trans>{price} per seat, each year</Trans>
          </Text>
        );
      } else {
        return (
          <Text key="year" noMargin color="primary">
            <Trans>{price} per year</Trans>
          </Text>
        );
      }
    } else {
      if (pricingSystem.isPerUser) {
        return (
          <Text key="year" noMargin color="primary">
            <Trans>
              {price} per seat, every {pricingSystem.periodCount} years
            </Trans>
          </Text>
        );
      } else {
        return (
          <Text key="year" noMargin color="primary">
            <Trans>
              {price} every {pricingSystem.periodCount} years
            </Trans>
          </Text>
        );
      }
    }
  }
};

// Helper in case we only have access to the plan ID and not the full plan object.
export const getPlanInferredNameFromId = (planId: string): string => {
  switch (planId) {
    case 'AirStudio_silver':
    case 'AirStudio_indie': // legacy
      return 'Silver';
    case 'AirStudio_gold':
    case 'AirStudio_pro': // legacy
      return 'Gold';
    case 'AirStudio_education':
      return 'Education';
    case 'AirStudio_startup':
    case 'AirStudio_enterprise':
      return 'Pro';
    default:
      return 'AirStudio';
  }
};

export const planIdSortingFunction = (
  planIdA: string,
  planIdB: string
): number => {
  const planOrder = [
    'AirStudio_free',
    'AirStudio_indie',
    'AirStudio_silver',
    'AirStudio_gold',
    'AirStudio_pro',
    'AirStudio_education',
    'AirStudio_startup',
    'AirStudio_enterprise',
  ];
  const indexA = planOrder.indexOf(planIdA);
  const indexB = planOrder.indexOf(planIdB);
  return indexA - indexB;
};

export const getPlanIcon = ({
  planId,
  logoSize,
}: {
  planId: string,
  logoSize: number,
}): React.Node => {
  const AirStudio_LOGO_PADDING = 10;
  // The plan logos are bigger than the AirStudio logo because they contain a glow effect,
  // so we increase the size.
  const PLAN_LOGO_SIZE = logoSize + 2 * AirStudio_LOGO_PADDING;

  switch (planId) {
    case 'AirStudio_silver':
    case 'AirStudio_indie': // legacy
      return (
        <Silver
          style={{
            width: PLAN_LOGO_SIZE,
            height: PLAN_LOGO_SIZE,
          }}
        />
      );
    case 'AirStudio_gold':
    case 'AirStudio_pro': // legacy
      return (
        <Gold
          style={{
            width: PLAN_LOGO_SIZE,
            height: PLAN_LOGO_SIZE,
          }}
        />
      );
    case 'AirStudio_education':
      return (
        <Education
          style={{
            width: PLAN_LOGO_SIZE,
            height: PLAN_LOGO_SIZE,
          }}
        />
      );
    case 'AirStudio_startup':
      return (
        <Startup
          style={{
            width: PLAN_LOGO_SIZE,
            height: PLAN_LOGO_SIZE,
          }}
        />
      );
    case 'AirStudio_enterprise':
      return (
        <Business
          style={{
            width: PLAN_LOGO_SIZE,
            height: PLAN_LOGO_SIZE,
          }}
        />
      );
    default:
      return (
        <AirStudioGLogo
          style={{
            width: logoSize,
            height: logoSize,
            padding: AirStudio_LOGO_PADDING,
          }}
        />
      );
  }
};

const styles = {
  bulletIcon: { width: 20, height: 20, marginRight: 10 },
  planPricesPaper: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bulletText: { flex: 1 },
};

type Props = {|
  subscriptionPlanWithPricingSystems: SubscriptionPlanWithPricingSystems,
  subscriptionPricingSystem: ?SubscriptionPlanPricingSystem,
  cancelAtPeriodEnd?: boolean,
  redemptionCodeExpirationDate?: ?number,
  isHighlighted: boolean,
  actions?: React.Node,
  isPending?: boolean,
  hidePrice?: boolean,
  background: 'medium' | 'dark',
|};

const PlanSmallCard = ({
  subscriptionPlanWithPricingSystems,
  subscriptionPricingSystem,
  cancelAtPeriodEnd = false,
  redemptionCodeExpirationDate,
  isHighlighted,
  actions,
  isPending,
  hidePrice = false,
  background,
}: Props): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const { isMobile } = useResponsiveWindowSize();

  const planIcon = getPlanIcon({
    planId: subscriptionPlanWithPricingSystems.id,
    logoSize: 40,
  });

  return (
    <I18n>
      {({ i18n }) => (
        <Paper
          background={background}
          style={{
            paddingRight: isMobile ? 8 : 32,
            paddingLeft: !!planIcon ? 0 : isMobile ? 8 : 65,
            border: `1px solid ${airStudioTheme.text.color.disabled}`,
            paddingTop: 16,
            paddingBottom: 16,
            ...(isHighlighted
              ? {
                  borderLeftWidth: 4,
                  borderLeftColor: airStudioTheme.palette.secondary,
                }
              : {}),
          }}
        >
          <Line noMargin>
            <Column noMargin>{planIcon}</Column>
            <Column noMargin expand>
              <Line noMargin justifyContent="space-between" alignItems="center">
                <Text size="block-title">
                  <span>
                    <b>
                      {selectMessageByLocale(
                        i18n,
                        subscriptionPlanWithPricingSystems.nameByLocale
                      )}
                    </b>
                  </span>
                </Text>
                <Column noMargin alignItems="flex-end">
                  {!hidePrice && cancelAtPeriodEnd ? (
                    <Line noMargin alignItems="center">
                      <Text noMargin color="primary">
                        <Trans>Cancelled</Trans>
                      </Text>{' '}
                      <Tooltip
                        title={
                          <Text>
                            <Trans>
                              Your subscription is set to be cancelled at the
                              end of the current billing period. You will retain
                              access to the plan benefits until then.
                            </Trans>
                          </Text>
                        }
                      >
                        <InfoIcon />
                      </Tooltip>
                    </Line>
                  ) : subscriptionPricingSystem ? (
                    getPlanPrice(subscriptionPricingSystem)
                  ) : redemptionCodeExpirationDate ? (
                    <Line noMargin alignItems="center">
                      <Text noMargin color="primary">
                        <Trans>Redeemed</Trans>
                      </Text>
                      {/* $FlowFixMe[constant-condition] */}
                      {!!redemptionCodeExpirationDate && (
                        <Tooltip
                          title={
                            <Text>
                              <Trans>
                                Thanks to the redemption code you've used, you
                                have this subscription enabled until{' '}
                                {i18n.date(redemptionCodeExpirationDate)}.
                              </Trans>
                            </Text>
                          }
                        >
                          <InfoIcon />
                        </Tooltip>
                      )}
                    </Line>
                  ) : null}
                </Column>
              </Line>
              <Text color="secondary" noMargin>
                {selectMessageByLocale(
                  i18n,
                  subscriptionPlanWithPricingSystems.descriptionByLocale
                )}
              </Text>
              <Line>
                <Column noMargin>
                  {subscriptionPlanWithPricingSystems.bulletPointsByLocale.map(
                    (bulletPointByLocale, index) => (
                      <Column key={index} expand noMargin>
                        <Line noMargin alignItems="center">
                          {isHighlighted ? (
                            <CheckCircle
                              style={{
                                ...styles.bulletIcon,
                                color: airStudioTheme.message.valid,
                              }}
                            />
                          ) : (
                            <CheckCircle style={styles.bulletIcon} />
                          )}
                          {/* $FlowFixMe[incompatible-type] */}
                          <Text style={styles.bulletText}>
                            {selectMessageByLocale(i18n, bulletPointByLocale)}
                          </Text>
                        </Line>
                      </Column>
                    )
                  )}
                </Column>
              </Line>
              {actions && (
                <ResponsiveLineStackLayout
                  noResponsiveLandscape
                  expand
                  noMargin
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  {actions}
                </ResponsiveLineStackLayout>
              )}
            </Column>
          </Line>
        </Paper>
      )}
    </I18n>
  );
};

export default PlanSmallCard;
