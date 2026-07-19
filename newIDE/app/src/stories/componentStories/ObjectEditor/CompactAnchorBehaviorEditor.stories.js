// @flow

import * as React from 'react';
import { action } from '@storybook/addon-actions';

// Keep first as it creates the `global.gd` object:
import { testProject } from '../../AirStudioJsInitializerDecorator';

import paperDecorator from '../../PaperDecorator';
import CompactAnchorBehaviorEditor from '../../../ObjectEditor/CompactObjectPropertiesEditor/CompactAnchorBehaviorEditor';
import SerializedObjectDisplay from '../../SerializedObjectDisplay';
import fakeResourceManagementProps from '../../FakeResourceManagement';

const gd: libAirStudio= global.gd;

export default {
  title: 'ObjectEditor/CompactAnchorBehaviorEditor',
  component: CompactAnchorBehaviorEditor,
  decorators: [paperDecorator],
};

export const Default = (): React.Node => {
  const spriteObjectWithBehaviors = testProject.spriteObjectWithBehaviors;
  const anchorBehavior = spriteObjectWithBehaviors.getBehavior('Anchor');
  const behaviorMetadata = gd.MetadataProvider.getBehaviorMetadata(
    gd.JsPlatform.get(),
    'AnchorBehavior::AnchorBehavior'
  );

  return (
    <SerializedObjectDisplay object={spriteObjectWithBehaviors}>
      <CompactAnchorBehaviorEditor
        project={testProject.project}
        behaviors={[anchorBehavior]}
        object={spriteObjectWithBehaviors}
        behaviorMetadata={behaviorMetadata}
        onOpenFullEditor={action('onOpenFullEditor')}
        onBehaviorUpdated={action('onBehaviorUpdated')}
        resourceManagementProps={fakeResourceManagementProps}
        layersContainer={testProject.testLayout.getLayers()}
      />
    </SerializedObjectDisplay>
  );
};
