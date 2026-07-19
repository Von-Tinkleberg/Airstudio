// @flow

import * as React from 'react';
import { I18n } from '@lingui/react';

import GameFeedback from '../../../../GameDashboard/Feedbacks/GameFeedback';

import {
  commentProcessed,
  commentUnprocessed,
  completeWebBuild,
  fakeSilverAuthenticatedUser,
  game1,
} from '../../../../fixtures/AirStudioServicesTestData';
import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';
import {
  AirStudioBuildApi,
  AirStudioPlayApi,
} from '../../../../Utils/AirStudioServices/ApiConfigs';
import { getPaperDecorator } from '../../../PaperDecorator';

export default {
  title: 'GameDashboard/Feedback/GameFeedback',
  component: GameFeedback,
  // $FlowFixMe[cannot-resolve-name]
  decorators: [(getPaperDecorator('medium'): StoryDecorator)],
};

export const DefaultGameFeedback = (): React.Node => {
  const mock = new MockAdapter(Axios);
  mock
    .onGet(`${AirStudioPlayApi.baseUrl}/game/${game1.id}/comment`)
    .reply(200, [commentProcessed, commentUnprocessed])
    .onGet(`${AirStudioBuildApi.baseUrl}/build`)
    .reply(200, [completeWebBuild])
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });
  return (
    <I18n>
      {({ i18n }) => (
        <GameFeedback
          i18n={i18n}
          authenticatedUser={fakeSilverAuthenticatedUser}
          game={game1}
        />
      )}
    </I18n>
  );
};

export const GameFeedbackOneSolvedComment = (): React.Node => {
  const mock = new MockAdapter(Axios);
  mock
    .onGet(`${AirStudioPlayApi.baseUrl}/game/${game1.id}/comment`)
    .reply(200, [commentProcessed])
    .onGet(`${AirStudioBuildApi.baseUrl}/build`)
    .reply(200, [completeWebBuild])
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });
  return (
    <I18n>
      {({ i18n }) => (
        <GameFeedback
          i18n={i18n}
          authenticatedUser={fakeSilverAuthenticatedUser}
          game={game1}
        />
      )}
    </I18n>
  );
};

export const GameFeedbackWithError = (): React.Node => {
  const mock = new MockAdapter(Axios);
  mock
    .onGet(`${AirStudioPlayApi.baseUrl}/game/${game1.id}/comment`)
    .reply(500, 'Internal server error')
    .onGet(`${AirStudioBuildApi.baseUrl}/build`)
    .reply(200, [completeWebBuild])
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });
  return (
    <I18n>
      {({ i18n }) => (
        <GameFeedback
          i18n={i18n}
          authenticatedUser={fakeSilverAuthenticatedUser}
          game={game1}
        />
      )}
    </I18n>
  );
};

export const GameFeedbackEmpty = (): React.Node => {
  const mock = new MockAdapter(Axios);
  mock
    .onGet(`${AirStudioPlayApi.baseUrl}/game/${game1.id}/comment`)
    .reply(200, [])
    .onGet(`${AirStudioBuildApi.baseUrl}/build`)
    .reply(200, [completeWebBuild])
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });
  return (
    <I18n>
      {({ i18n }) => (
        <GameFeedback
          i18n={i18n}
          authenticatedUser={fakeSilverAuthenticatedUser}
          game={game1}
        />
      )}
    </I18n>
  );
};
