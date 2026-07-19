// @flow
import * as React from 'react';
import { I18n } from '@lingui/react';
import { type MessageDescriptor } from '../Utils/i18n/MessageDescriptor.flow';
import AirStudioThemeContext from './Theme/AirStudioThemeContext';

// We support a subset of the props supported by Material-UI v0.x MenuItem
// They should be self descriptive - refer to Material UI docs otherwise.
type Props = {|
  value: string | number | boolean,
  label: MessageDescriptor | React.Node,
  disabled?: boolean,
  shouldNotTranslate?: boolean,
|};

/**
 * A native select option to be used with `SelectField`.
 */
const SelectOption = (props: Props): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);

  return (
    <I18n>
      {({ i18n }) => (
        <option
          value={props.value}
          disabled={props.disabled}
          style={{
            color: airStudioTheme.text.color.primary,
            backgroundColor: airStudioTheme.palette.canvasColor,
          }}
        >
          {props.shouldNotTranslate ? props.label : i18n._(props.label)}
        </option>
      )}
    </I18n>
  );
};

export default SelectOption;
