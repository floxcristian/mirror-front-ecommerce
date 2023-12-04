import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RootService } from './../../../../shared/services/root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { MenuService } from '@core/services-v2/menu/menu.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  usuario!: ISession;

  mostrarMenu: boolean = false;
  mostrarBienvenida: boolean = false;
  linkMiCuenta = [
    {
      label: 'Mi perfil',
      url: ['/', 'mi-cuenta', 'resumen'],
      icon: 'far fa-user',
    },
  ];
  isB2B: boolean = false;
  linksOcultosB2B = [
    'Resumen',
    'Portal de pagos',
    'Cargar Masiva Productos',
    'Seguimiento',
  ];
  @Input() tipo: 'b2b' | 'b2c' = 'b2c';

  constructor(
    public localS: LocalStorageService,
    private root: RootService,
    private cd: ChangeDetectorRef,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly menuService: MenuService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession();
    if (this.usuario.documentId !== '0') this.root.getPreferenciasCliente();
    this.isB2B =
      this.usuario.userRole === 'supervisor' ||
      this.usuario.userRole === 'comprador';

    this.authStateService.session$.subscribe((user) => {
      this.usuario = user;
      this.mostrarMenu = true;
      this.mostrarBienvenida = true;
      this.linkMiCuenta = this.menuService.get(this.usuario.userRole);

      if (this.isB2B) {
        this.linkMiCuenta = this.linkMiCuenta.filter(
          (l) => !this.linksOcultosB2B.includes(l.label)
        );
      }
      this.root.getPreferenciasCliente();
    });

    if (this.usuario) {
      this.linkMiCuenta = this.menuService.get(this.usuario.userRole);
      if (this.isB2B) {
        this.linkMiCuenta = this.linkMiCuenta.filter(
          (l) => !this.linksOcultosB2B.includes(l.label)
        );
      }
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
