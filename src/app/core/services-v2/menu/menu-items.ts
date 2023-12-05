import { IMenuItem } from './menu-item.interface';

const OVERVIEW_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Resumen',
  url: ['/', 'mi-cuenta', 'resumen'],
  icon: 'fas fa-tachometer-alt',
};

const PROFILE_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Mi perfil',
  url: ['/', 'mi-cuenta', 'mi-perfil'],
  icon: 'fas fa-user',
};

const PURCHASE_HISTORY_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Historial de compras',
  url: ['/', 'mi-cuenta', 'historial-de-compras'],
  icon: 'fas fa-history',
};

const TRACKING_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Seguimiento',
  url: ['/', 'mi-cuenta', 'seguimiento'],
  icon: 'fas fa-truck-moving',
};

const MY_PURCHASE_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Mis Compras',
  url: ['/', 'mi-cuenta', 'mis-compras'],
  icon: 'fa-sharp fa-solid fa-bag-shopping',
};

const LOGOUT_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Cerrar sesión',
  url: ['/', 'mi-cuenta', 'login'],
  icon: 'fas fa-power-off',
};

export class MenuItem {
  static OVERVIEW_ITEM_MENU(): IMenuItem {
    return structuredClone(OVERVIEW_ITEM_MENU);
  }

  static PROFILE_ITEM_MENU(): IMenuItem {
    return structuredClone(PROFILE_ITEM_MENU);
  }

  static PURCHASE_HISTORY_ITEM_MENU(): IMenuItem {
    return structuredClone(PURCHASE_HISTORY_ITEM_MENU);
  }

  static TRACKING_ITEM_MENU(): IMenuItem {
    return structuredClone(TRACKING_ITEM_MENU);
  }

  static MY_PURCHASE_ITEM_MENU(): IMenuItem {
    return structuredClone(MY_PURCHASE_ITEM_MENU);
  }

  static LOGOUT_ITEM_MENU(): IMenuItem {
    return structuredClone(LOGOUT_ITEM_MENU);
  }
}
