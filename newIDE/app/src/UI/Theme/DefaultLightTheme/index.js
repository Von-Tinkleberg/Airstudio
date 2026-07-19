import { createairStudioTheme } from '../CreateTheme';
import styles from './DefaultLightThemeVariables.json';
import './DefaultLightThemeVariables.css';

export default createairStudioTheme({
  styles,

  rootClassNameIdentifier: 'DefaultLightTheme',
  paletteType: 'light',
});
