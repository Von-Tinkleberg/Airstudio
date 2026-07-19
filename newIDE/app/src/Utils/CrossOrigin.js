// @flow
import { isNativeMobileApp } from './Platform';
import { addAirStudioResourceJwtTokenToUrl } from './AirStudioServices/Project';

// If modifying this function, make sure to update Resource3DPreview.worker.js copy.
export const checkIfIsAirStudioCloudBucketUrl = (url: string): boolean => {
  return (
    url.startsWith('https://project-resources.AirStudio.io/') ||
    url.startsWith('https://project-resources-dev.AirStudio.io/')
  );
};

// If modifying this function, make sure to update Resource3DPreview.worker.js copy.
export const checkIfCredentialsRequired = (url: string): boolean => {
  // On web/desktop, "credentials" are necessary to use the cookie previously
  // returned by the server.
  if (isNativeMobileApp()) return false;

  // Any resource stored on the AirStudio Cloud buckets needs the "credentials" of the user,
  // i.e: its AirStudio.io cookie, to be passed.
  if (checkIfIsAirStudioCloudBucketUrl(url)) return true;

  // For other resources, use the default way of loading resources ("anonymous" or "same-site").
  return false;
};

export const addAirStudioResourceTokenIfRequired = (url: string): string => {
  // On web/desktop, "credentials" are necessary to use the cookie previously
  // returned by the server.
  if (!isNativeMobileApp()) return url;

  if (!checkIfIsAirStudioCloudBucketUrl(url)) return url;

  return addAirStudioResourceJwtTokenToUrl(url);
};
