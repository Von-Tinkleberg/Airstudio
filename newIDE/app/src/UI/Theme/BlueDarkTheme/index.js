import { createairStudioTheme } from '../CreateTheme';

import styles from './BlueDarkThemeVariables.json';
import './BlueDarkThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'BlueDarkTheme',
  paletteType: 'dark',
});
