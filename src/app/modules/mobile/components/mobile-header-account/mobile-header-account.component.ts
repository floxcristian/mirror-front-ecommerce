import { Usuario } from './../../../../shared/interfaces/login';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';
import { MenuService } from '@core/services-v2/menu/menu.service';

@Component({
  selector: 'app-mobile-header-account',
  templateUrl: './mobile-header-account.component.html',
  styleUrls: ['./mobile-header-account.component.scss'],
})
export class MobileHeaderAccountComponent implements OnInit {
  usuario!: ISession | null;
  mostrarMenu = false;
  mostrarBienvenida = false;
  linkMiCuenta = [
    {
      label: 'Mi perfil',
      url: ['/', 'mi-cuenta', 'resumen'],
      icon: 'far fa-user',
    },
    {
      label: 'Mis Pedidos',
      url: ['/', 'mi-cuenta', 'mis-compras'],
      icon: 'fas fa-shopping-cart',
    },
    {
      label: 'Cerrar sesión',
      url: ['/', 'mi-cuenta', 'login'],
      icon: 'fas fa-power-off',
      dark: true,
    },
  ];

  constructor(
    public localS: LocalStorageService,
    private cd: ChangeDetectorRef,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly menuService: MenuService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionStorage.get();

    this.authStateService.session$.subscribe((user) => {
      this.usuario = user;
      this.mostrarMenu = true;
      this.mostrarBienvenida = true;
      this.linkMiCuenta = this.menuService.get(this.usuario.userRole);
    });

    if (this.usuario) {
      this.linkMiCuenta = this.menuService.get(this.usuario.userRole);
    }
    this.cd.detectChanges();
  }

  cambiaElementosMenu(value: any) {
    this.mostrarMenu = value;
  }

  cerrarBienvenida() {
    this.mostrarBienvenida = false;
  }
}
