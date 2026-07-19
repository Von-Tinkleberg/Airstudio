import { createairStudioTheme } from '../CreateTheme';

import styles from './OneDarkThemeVariables.json';
import './OneDarkThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'OneDarkTheme',
  paletteType: 'dark',
  airStudioIconsCSSFilter: 'hue-rotate(-10deg) saturate(50%)',
});
