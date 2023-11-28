import { LoginService } from './../../../../shared/services/login.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RootService } from './../../../../shared/services/root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

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
    public loginService: LoginService,
    private cd: ChangeDetectorRef,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    if (this.usuario.documentId !== '0') this.root.getPreferenciasCliente();
    this.isB2B =
      this.usuario.userRole === 'supervisor' ||
      this.usuario.userRole === 'comprador';

    this.loginService.loginSessionObs$.pipe().subscribe((usuario) => {
      if (!usuario.hasOwnProperty('user_role')) {
        usuario.user_role = '';
      }

      this.usuario = usuario;
      this.mostrarMenu = true;
      this.mostrarBienvenida = true;
      this.linkMiCuenta = this.loginService.setRoles(this.usuario.userRole);

      if (this.isB2B) {
        this.linkMiCuenta = this.linkMiCuenta.filter(
          (l) => !this.linksOcultosB2B.includes(l.label)
        );
      }
      this.root.getPreferenciasCliente();
    });

    if (this.usuario != null) {
      this.linkMiCuenta = this.loginService.setRoles(this.usuario.userRole);
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
