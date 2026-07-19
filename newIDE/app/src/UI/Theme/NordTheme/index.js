import { createairStudioTheme } from '../CreateTheme';

import styles from './NordThemeVariables.json';
import './NordThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'NordTheme',
  paletteType: 'dark',
  airStudioIconsCSSFilter: 'hue-rotate(-15deg) saturate(57%) brightness(120%)',
});
