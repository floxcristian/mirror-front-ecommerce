import { IMenuItem } from './menu-item.interface';

export const OVERVIEW_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Resumen',
  url: ['/', 'mi-cuenta', 'resumen'],
  icon: 'fas fa-tachometer-alt',
};

export const PROFILE_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Mi perfil',
  url: ['/', 'mi-cuenta', 'mi-perfil'],
  icon: 'fas fa-user',
};

export const PURCHASE_HISTORY_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Historial de compras',
  url: ['/', 'mi-cuenta', 'historial-de-compras'],
  icon: 'fas fa-history',
};

export const TRACKING_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Seguimiento',
  url: ['/', 'mi-cuenta', 'seguimiento'],
  icon: 'fas fa-truck-moving',
};

export const LOGOUT_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Cerrar sesión',
  url: ['/', 'mi-cuenta', 'login'],
  icon: 'fas fa-power-off',
};

export const MY_PURCHASE_ITEM_MENU: IMenuItem = {
  type: 'link',
  label: 'Mis Compras',
  url: ['/', 'mi-cuenta', 'mis-compras'],
  icon: 'fa-sharp fa-solid fa-bag-shopping',
};
