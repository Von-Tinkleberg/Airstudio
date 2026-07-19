import { createairStudioTheme } from '../CreateTheme';

import styles from './DeepBlueThemeVariables.json';
import './DeepBlueThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'DeepBlueTheme',
  paletteType: 'dark',
  airStudioIconsCSSFilter: 'hue-rotate(-10deg) saturate(50%)',
});
