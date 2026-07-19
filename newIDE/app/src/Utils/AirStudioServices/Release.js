// @flow
import axios from 'axios';
import { AirStudioReleaseApi } from './ApiConfigs';
import { ensureIsArray } from '../DataValidator';

export type Release = {
  name: ?string,
  publishedAt: ?string,
  description: ?string,
};

export const getReleases = async (): Promise<Array<Release>> => {
  try {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const response = await axios.get(`${AirStudioReleaseApi.baseUrl}/release`, {
      params: {
        last: 4,
      },
    });
    return ensureIsArray({
      data: response.data,
      endpointName: '/release of Release API',
    });
  } catch (error) {
    return [];
  }
};

export const hasBreakingChange = (release: Release): boolean => {
  return (
    (release.description || '').toLowerCase().indexOf('breaking change') !== -1
  );
};

export const findRelease = (
  releases: Array<Release>,
  name: string
): ?Release => {
  return releases.find(release => release.name === name);
};
