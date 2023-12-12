import { Link } from './link';
import { Menu } from './menu';
import { Megamenu } from './megamenu';
import { IThirdLvl } from '@core/models-v2/cms/categories-response.interface';

export interface NavigationLink extends Link {
  menu?: Megamenu | Menu | IThirdLvl[];
}
