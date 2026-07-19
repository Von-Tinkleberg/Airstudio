// @flow
import * as React from 'react';
import { type StoryDecorator } from '@storybook/react';
import WindowUtils from '../Utils/Window';

type AirStudioJsInitializerProps = {|
  children: () => React.Node,
|};

const BrowserDropDownMenuDisabler = ({
  children,
}: AirStudioJsInitializerProps) => {
  React.useEffect(() => {
    WindowUtils.setUpContextMenu();
  }, []);

  return children();
};

const BrowserDropDownMenuDisablerDecorator: StoryDecorator = (
  Story,
  context
) => (
  <BrowserDropDownMenuDisabler>{() => <Story />}</BrowserDropDownMenuDisabler>
);

export default BrowserDropDownMenuDisablerDecorator;
