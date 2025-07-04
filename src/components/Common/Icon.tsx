import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import solidConfig from './Icon/solid-config.json';
import regularConfig from './Icon/regular-config.json';
import lightConfig from './Icon/light-config.json';
import brandsConfig from './Icon/brands-config.json';

export const LightIcon = createIconSetFromIcoMoon(
  lightConfig,
  'fa-light',
  'fa-light.ttf',
);
export const SolidIcon = createIconSetFromIcoMoon(
  solidConfig,
  'fa-solid',
  'fa-solid.ttf',
);
export const BrandsIcon = createIconSetFromIcoMoon(
  brandsConfig,
  'fa-brands',
  'fa-brands.ttf',
);
export const RegularIcon = createIconSetFromIcoMoon(
  regularConfig,
  'fa-regular',
  'fa-regular.ttf',
);

export default LightIcon;
