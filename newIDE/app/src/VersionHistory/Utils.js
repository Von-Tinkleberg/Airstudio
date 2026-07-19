import type { VersionRestoringStatus } from '.';

export const getStatusColor = (
  airStudioTheme: airStudioTheme,
  status: VersionRestoringStatus
) => {
  return status === 'unsavedChanges'
    ? airStudioTheme.statusIndicator.error
    : status === 'saving'
    ? airStudioTheme.statusIndicator.warning
    : status === 'latest'
    ? airStudioTheme.palette.secondary
    : status === 'opened'
    ? airStudioTheme.statusIndicator.warning
    : airStudioTheme.statusIndicator.success;
};
