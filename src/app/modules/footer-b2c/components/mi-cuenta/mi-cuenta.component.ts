import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Usuario } from '../../../../shared/interfaces/login';
import { LoginService } from '../../../../shared/services/login.service';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss'],
})
export class MiCuentaComponent implements OnInit {
  screenWidth: any;
  terminos = false;
  usuario!: Usuario;
  links = [
    { label: 'Mi cuenta', url: 'resumen' },
    { label: 'Mis pedidos', url: 'pedidos-pendientes' },
    { label: 'Mis cotizaciones', url: 'cotizaciones' },
    { label: 'Seguimiento de compra', url: 'seguimiento' },
    { label: 'Cerrar sesión', url: 'login' },
  ];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private root: RootService
  ) {
    this.screenWidth = window.innerWidth;
  }

  async ngOnInit() {
    this.usuario = await this.root.getDataSesionUsuario();

    this.loginService.loginSessionObs$.pipe().subscribe((usuario) => {
      this.usuario = usuario;
    });
  }

  validarCuenta(link: any) {
    this.localStorage.set('ruta', link.url);
    const usuario = this.usuario;

    if (usuario == null) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }

    if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
      // return this.router.navigate(['sitio', 'iniciar-sesion']);
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }

    this.usuario = usuario;

    if (link.label != 'Cerrar sesión') {
      this.router.navigate(['/mi-cuenta', link.url]);
    } else {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
}
