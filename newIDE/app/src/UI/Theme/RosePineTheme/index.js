import { createairStudioTheme } from '../CreateTheme';

import styles from './RosePineThemeVariables.json';
import './RosePineThemeVariables.css';

export default createairStudioTheme({
  styles,
  rootClassNameIdentifier: 'RosePineTheme',
  paletteType: 'dark',
  airStudioIconsCSSFilter: 'hue-rotate(75deg) saturate(50%) brightness(100%)',
});
