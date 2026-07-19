// @flow
import axios from 'axios';
import { AirStudioAssetApi } from './ApiConfigs';
import { type Filters } from './Filters';
import { type UserPublicProfile } from './User';
import { retryIfFailed } from '../RetryIfFailed';

export type ExampleShortHeader = {|
  id: string,
  slug: string,
  name: string,
  shortDescription: string,
  description: string,
  license: string,
  tags: Array<string>,
  authors?: Array<UserPublicProfile>,
  authorIds?: Array<string>,
  previewImageUrls: Array<string>,
  quickCustomizationImageUrl?: string,
  AirStudioVersion: string,
  codeSizeLevel: string,
  difficultyLevel?: string,
  linkedExampleShortHeaders?: Array<{ slug: string, relation: string }>,
|};

export type Example = {|
  ...ExampleShortHeader,
  projectFileUrl: string,
  authors: Array<string>,
|};

export type AllExamples = {|
  exampleShortHeaders: Array<ExampleShortHeader>,
  filters: Filters,
|};

export const listAllExamples = async (): Promise<AllExamples> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(`${AirStudioAssetApi.baseUrl}/example`, {
      params: {
        environment: 'live',
      },
    });
    const { exampleShortHeadersUrl, filtersUrl } = response.data;

    const [exampleShortHeaders, filters] = await Promise.all([
      retryIfFailed(
        { times: 2 },
        // $FlowFixMe[underconstrained-implicit-instantiation]
        async () => (await axios.get(exampleShortHeadersUrl)).data
      ),
      // $FlowFixMe[underconstrained-implicit-instantiation]
      retryIfFailed({ times: 2 }, async () => (await axios.get(filtersUrl)).data),
    ]);

    return { exampleShortHeaders, filters };
  } catch (error) {
    console.info('No example API available — running in offline mode.');
    return { exampleShortHeaders: [], filters: {} };
  }
};

export const getExample = async (
  exampleShortHeader: ExampleShortHeader
): Promise<Example> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(
      `${AirStudioAssetApi.baseUrl}/example-v2/${exampleShortHeader.id}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Not available offline');
  }
};

export const getUserExampleShortHeaders = async (
  authorId: string
): Promise<Array<ExampleShortHeader>> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(
      `${AirStudioAssetApi.baseUrl}/example-short-header`,
      {
        params: { authorId },
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};
