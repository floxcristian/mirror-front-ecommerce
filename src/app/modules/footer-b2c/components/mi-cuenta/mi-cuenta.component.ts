import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss'],
})
export class MiCuentaComponent implements OnInit {
  terminos = false;
  usuario!: ISession;
  links = [
    { label: 'Mi cuenta', url: 'resumen' },
    { label: 'Mis pedidos', url: 'pedidos-pendientes' },
    { label: 'Mis cotizaciones', url: 'cotizaciones' },
    { label: 'Seguimiento de compra', url: 'seguimiento' },
    { label: 'Cerrar sesión', url: 'login' },
  ];

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession();

    this.authStateService.session$.subscribe((user) => {
      this.usuario = user;
    });
  }

  validarCuenta(link: any): void {
    this.localStorage.set('ruta', link.url);
    const usuario = this.usuario;
    if (!usuario) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    } else if (usuario.login_temp) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    } else if (link.label != 'Cerrar sesión') {
      this.router.navigate(['/mi-cuenta', link.url]);
    } else {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }
  }
}
