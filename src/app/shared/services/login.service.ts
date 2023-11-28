// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Subject, Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Services
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
// Interfaces
import { Login, Usuario } from '../interfaces/login';
import { SessionService } from '@core/states-v2/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginSession$: Subject<any> = new Subject();
  readonly loginSessionObs$: Observable<any> =
    this.loginSession$.asObservable();
  linkMiCuenta: any = [];

  constructor(
    private http: HttpClient,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService
  ) {}

  isLogin() {
    const user = this.sessionStorage.get();
    if (!user) {
      return false;
    } else {
      if (user.login_temp) {
        return false;
      } else {
        this.localS.remove('invitado');
        return true;
      }
    }
  }

  iniciarSesion(data: Login) {
    return this.http.post(environment.apiCMS + 'users/login', data);
  }

  notify(data: any) {
    if (!data) {
      const usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
      this.loginSession$.next(usuario);
    } else {
      this.loginSession$.next(data);
    }
  }

  setRoles(profile: any) {
    if (profile === 'superadmin') {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Mi perfil',
          url: ['/', 'mi-cuenta', 'mi-perfil'],
          icon: 'fas fa-user',
        },
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
        {
          type: 'link',
          label: 'Seguimiento',
          url: ['/', 'mi-cuenta', 'seguimiento'],
          icon: 'fas fa-truck-moving',
        },
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
        {
          type: 'link',
          label: 'Cerrar sesión',
          url: ['/', 'mi-cuenta', 'login'],
          icon: 'fas fa-power-off',
        },
      ];
    } else if (profile === 'supervisor') {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Resumen',
          url: ['/', 'mi-cuenta', 'resumen'],
          icon: 'fas fa-tachometer-alt',
        },
        {
          type: 'link',
          label: 'Mi perfil',
          url: ['/', 'mi-cuenta', 'mi-perfil'],
          icon: 'fas fa-user',
        },
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
        {
          type: 'link',
          label: 'Mis Compras',
          url: ['/', 'mi-cuenta', 'mis-compras'],
          icon: 'fa-sharp fa-solid fa-bag-shopping',
        },
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
        {
          type: 'link',
          label: 'Seguimiento',
          url: ['/', 'mi-cuenta', 'seguimiento'],
          icon: 'fas fa-truck-moving',
        },
        {
          type: 'link',
          label: 'Cerrar sesión',
          url: ['/', 'mi-cuenta', 'login'],
          icon: 'fas fa-power-off',
        },
      ];
    } else if (profile === 'comprador') {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Resumen',
          url: ['/', 'mi-cuenta', 'resumen'],
          icon: 'fas fa-tachometer-alt',
        },
        {
          type: 'link',
          label: 'Mi perfil',
          url: ['/', 'mi-cuenta', 'mi-perfil'],
          icon: 'fas fa-user',
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
        {
          type: 'link',
          label: 'Mis Compras',
          url: ['/', 'mi-cuenta', 'mis-compras'],
          icon: 'fa-sharp fa-solid fa-bag-shopping',
        },
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
        {
          type: 'link',
          label: 'Historial de compras',
          url: ['/', 'mi-cuenta', 'historial-de-compras'],
          icon: 'fas fa-history',
        },
        {
          type: 'link',
          label: 'Carga Masiva Productos',
          url: ['/', 'mi-cuenta', 'carga-masiva-prod'],
          icon: 'fas fa-file-upload',
        },
        {
          type: 'link',
          label: 'Seguimiento',
          url: ['/', 'mi-cuenta', 'seguimiento'],
          icon: 'fas fa-truck-moving',
        },
        {
          type: 'link',
          label: 'Cerrar sesión',
          url: ['/', 'mi-cuenta', 'login'],
          icon: 'fas fa-power-off',
        },
      ];
    } else if (profile === 'cms') {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Cerrar sesión',
          url: ['/', 'mi-cuenta', 'login'],
          icon: 'fas fa-power-off',
        },
      ];
    } else if (profile === 'compradorb2c') {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Resumen',
          url: ['/', 'mi-cuenta', 'resumen'],
          icon: 'fas fa-tachometer-alt',
        },
        {
          type: 'link',
          label: 'Mi perfil',
          url: ['/', 'mi-cuenta', 'mi-perfil'],
          icon: 'fas fa-user',
        },
        {
          type: 'link',
          label: 'Historial de compras',
          url: ['/', 'mi-cuenta', 'historial-de-compras'],
          icon: 'fas fa-history',
        },
        {
          type: 'link',
          label: 'Seguimiento',
          url: ['/', 'mi-cuenta', 'seguimiento'],
          icon: 'fas fa-truck-moving',
        },
        {
          type: 'link',
          label: 'Cerrar sesión',
          url: ['/', 'mi-cuenta', 'login'],
          icon: 'fas fa-power-off',
        },
      ];
    } else {
      this.linkMiCuenta = [
        {
          type: 'link',
          label: 'Seguimiento',
          url: ['/', 'mi-cuenta', 'seguimiento'],
          icon: 'fas fa-truck-moving',
        },
      ];
    }

    return this.linkMiCuenta;
  }
}
