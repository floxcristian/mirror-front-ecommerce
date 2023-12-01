// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginResponse,
  IUserRole,
} from '@core/models-v2/auth/login-response.interface';
// Rxjs
import { Observable } from 'rxjs';
// Models
import { IMenuItem } from './menu-item.interface';
// Constants
import {
  OVERVIEW_ITEM_MENU,
  PROFILE_ITEM_MENU,
  PURCHASE_HISTORY_ITEM_MENU,
  TRACKING_ITEM_MENU,
  LOGOUT_ITEM_MENU,
  MY_PURCHASE_ITEM_MENU,
} from './menu-items';
// Environment
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  get(profile: IUserRole): IMenuItem[] {
    let menuItems = [];
    if (profile === 'superadmin') {
      menuItems = [
        PROFILE_ITEM_MENU,
        {
          type: 'link',
          label: 'Órdenes de Venta',
          url: ['/', 'mi-cuenta', 'ordenes'],
          icon: 'far fa-file-alt',
        },
        {
          type: 'link',
          label: 'Carros Guardados',
          url: ['/', 'mi-cuenta', 'carros-guardados'],
          icon: 'fas fa-cart-arrow-down',
        },
        TRACKING_ITEM_MENU,
        {
          type: 'link',
          label: 'Usuarios',
          url: ['/', 'mi-cuenta', 'usuarios'],
          icon: 'fas fa-users',
        },
        {
          type: 'link',
          label: 'Cargar Masiva Productos',
          url: ['/', 'mi-cuenta', 'carga-masiva-prod'],
          icon: 'fas fa-file-upload',
        },
        LOGOUT_ITEM_MENU,
      ];
    } else if (profile === 'supervisor') {
      menuItems = [
        OVERVIEW_ITEM_MENU,
        PROFILE_ITEM_MENU,
        {
          type: 'link',
          label: 'Usuarios',
          url: ['/', 'mi-cuenta', 'gestion-usuariob2b'],
          icon: 'fas fa-users',
        },
        {
          type: 'link',
          label: 'Mi Flota',
          url: ['/', 'mi-cuenta', 'mi-flota'],
          icon: 'fas fa-warehouse',
        },
        {
          type: 'link',
          label: 'Centros de costo',
          url: ['/', 'mi-cuenta', 'mis-centros-costos'],
          icon: 'fas fa-hand-holding-usd',
        },
        MY_PURCHASE_ITEM_MENU,
        {
          type: 'link',
          label: 'Listas de productos',
          url: ['/', 'mi-cuenta', 'listas-de-productos'],
          icon: 'fas fa-list-ul',
        },
        {
          type: 'link',
          label: 'Lista de Precios',
          url: ['/', 'mi-cuenta', 'lista-precios'],
          icon: 'fas fa-dollar-sign',
        },
        {
          type: 'link',
          label: 'Carros Guardados',
          url: ['/', 'mi-cuenta', 'carros-guardados'],
          icon: 'fas fa-cart-arrow-down',
        },
        {
          type: 'link',
          label: 'Pague sus facturas aquí',
          url: ['/', 'mi-cuenta', 'portal-de-pagos'],
          icon: 'fas fa-money-check-alt',
        },
        {
          type: 'link',
          label: 'Solicitudes de compras',
          url: ['/', 'mi-cuenta', 'solicitudes-de-compras'],
          icon: 'far fa-thumbs-up',
        },
        {
          type: 'link',
          label: 'Pedidos Pendientes',
          url: ['/', 'mi-cuenta', 'pedidos-pendientes'],
          icon: 'far fa-clock',
        },
        {
          type: 'link',
          label: 'Cotizaciones',
          url: ['/', 'mi-cuenta', 'cotizaciones'],
          icon: 'fas fa-file-invoice',
        },
        {
          type: 'link',
          label: 'Documentos',
          url: ['/', 'mi-cuenta', 'historial-de-compras'],
          icon: 'fas fa-history',
        },

        {
          type: 'link',
          label: 'Carga Masiva Productos',
          url: ['/', 'mi-cuenta', 'carga-masiva-prod'],
          icon: 'fas fa-file-upload',
        },
        TRACKING_ITEM_MENU,
        LOGOUT_ITEM_MENU,
      ];
    } else if (profile === 'comprador') {
      menuItems = [
        OVERVIEW_ITEM_MENU,
        PROFILE_ITEM_MENU,
        {
          type: 'link',
          label: 'Mi Flota',
          url: ['/', 'mi-cuenta', 'mi-flota'],
          icon: 'fas fa-warehouse',
        },
        {
          type: 'link',
          label: 'Centros de costo',
          url: ['/', 'mi-cuenta', 'mis-centros-costos'],
          icon: 'fas fa-hand-holding-usd',
        },
        MY_PURCHASE_ITEM_MENU,
        {
          type: 'link',
          label: 'Listas de productos',
          url: ['/', 'mi-cuenta', 'listas-de-productos'],
          icon: 'fas fa-list-ul',
        },
        {
          type: 'link',
          label: 'Lista de Precios',
          url: ['/', 'mi-cuenta', 'lista-precios'],
          icon: 'fas fa-dollar-sign',
        },
        {
          type: 'link',
          label: 'Carros Guardados',
          url: ['/', 'mi-cuenta', 'carros-guardados'],
          icon: 'fas fa-cart-arrow-down',
        },
        {
          type: 'link',
          label: 'Solicitudes de compras',
          url: ['/', 'mi-cuenta', 'solicitudes-de-compras'],
          icon: 'far fa-thumbs-up',
        },
        {
          type: 'link',
          label: 'Pedidos Pendientes',
          url: ['/', 'mi-cuenta', 'pedidos-pendientes'],
          icon: 'far fa-clock',
        },
        {
          type: 'link',
          label: 'Cotizaciones',
          url: ['/', 'mi-cuenta', 'cotizaciones'],
          icon: 'fas fa-file-invoice',
        },
        PURCHASE_HISTORY_ITEM_MENU,
        {
          type: 'link',
          label: 'Carga Masiva Productos',
          url: ['/', 'mi-cuenta', 'carga-masiva-prod'],
          icon: 'fas fa-file-upload',
        },
        TRACKING_ITEM_MENU,
        LOGOUT_ITEM_MENU,
      ];
    } else if (profile === 'cms') {
      menuItems = [LOGOUT_ITEM_MENU];
    } else if (profile === 'compradorb2c') {
      menuItems = [
        OVERVIEW_ITEM_MENU,
        PROFILE_ITEM_MENU,
        PURCHASE_HISTORY_ITEM_MENU,
        TRACKING_ITEM_MENU,
        LOGOUT_ITEM_MENU,
      ];
    } else {
      menuItems = [TRACKING_ITEM_MENU];
    }

    return menuItems;
  }
}
