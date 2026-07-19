// @flow
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import RedeemCodeDialog from '../../../Profile/RedeemCodeDialog';
import { fakeSilverAuthenticatedUser } from '../../../fixtures/AirStudioServicesTestData';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { AirStudioUsageApi } from '../../../Utils/AirStudioServices/ApiConfigs';
import AuthenticatedUserContext from '../../../Profile/AuthenticatedUserContext';

export default {
  title: 'Profile/RedeemCodeDialog',
  component: RedeemCodeDialog,
};

export const WorkingCode = (): React.Node => {
  const mock = new MockAdapter(axios, { delayResponse: 100 });
  mock
    .onPost(`${AirStudioUsageApi.baseUrl}/redemption-code/action/redeem-code`)
    .reply(200)
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider value={fakeSilverAuthenticatedUser}>
      <RedeemCodeDialog onClose={action('onClose')} />
    </AuthenticatedUserContext.Provider>
  );
};

export const CodeDoesNotExist = (): React.Node => {
  const mock = new MockAdapter(axios, { delayResponse: 100 });
  mock
    .onPost(`${AirStudioUsageApi.baseUrl}/redemption-code/action/redeem-code`)
    .reply(404)
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider value={fakeSilverAuthenticatedUser}>
      <RedeemCodeDialog onClose={action('onClose')} />
    </AuthenticatedUserContext.Provider>
  );
};

export const UnknownError = (): React.Node => {
  const mock = new MockAdapter(axios, { delayResponse: 100 });
  mock
    .onPost(`${AirStudioUsageApi.baseUrl}/redemption-code/action/redeem-code`)
    .reply(500)
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider value={fakeSilverAuthenticatedUser}>
      <RedeemCodeDialog onClose={action('onClose')} />
    </AuthenticatedUserContext.Provider>
  );
};

export const CannotBeRedeemedAnymoreError = (): React.Node => {
  const mock = new MockAdapter(axios, { delayResponse: 100 });
  mock
    .onPost(`${AirStudioUsageApi.baseUrl}/redemption-code/action/redeem-code`)
    .reply(409, {
      code: 'redemption-code/cannot-be-redeemed-anymore',
    })
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider value={fakeSilverAuthenticatedUser}>
      <RedeemCodeDialog onClose={action('onClose')} />
    </AuthenticatedUserContext.Provider>
  );
};

export const AlreadyRedeemedByUser = (): React.Node => {
  const mock = new MockAdapter(axios, { delayResponse: 100 });
  mock
    .onPost(`${AirStudioUsageApi.baseUrl}/redemption-code/action/redeem-code`)
    .reply(409, {
      code: 'user-redeemed-code/already-redeemed-by-user',
    })
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider value={fakeSilverAuthenticatedUser}>
      <RedeemCodeDialog onClose={action('onClose')} />
    </AuthenticatedUserContext.Provider>
  );
};
