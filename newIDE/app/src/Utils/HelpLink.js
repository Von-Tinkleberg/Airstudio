// @flow

export const isRelativePathToDocumentationRoot = (path: string): boolean => {
  return path.startsWith('/');
};

export const isDocumentationAbsoluteUrl = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://');
};

export const getHelpLink = (path: string, anchor: string = ''): string => {
  if (isRelativePathToDocumentationRoot(path))
return `https://airstudio.io/docs${path}?utm_source=airstudio&utm_medium=help-link${

  anchor ? `#${anchor}` : ''
}`;
  if (isDocumentationAbsoluteUrl(path)) return path;

  return '';
};
