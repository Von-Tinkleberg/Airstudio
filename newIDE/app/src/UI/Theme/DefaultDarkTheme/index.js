import { createairStudioTheme } from '../CreateTheme';

import styles from './DefaultDarkThemeVariables.json';
import './DefaultDarkThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'DefaultDarkTheme',
  paletteType: 'dark',
});
