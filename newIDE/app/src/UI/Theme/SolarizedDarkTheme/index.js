import { createairStudioTheme } from '../CreateTheme';

import styles from './SolarizedDarkThemeVariables';
import './SolarizedDarkThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'SolarizedDarkTheme',
  paletteType: 'dark',
  airStudioIconsCSSFilter: 'hue-rotate(-15deg) saturate(70%) brightness(90%)',
});
