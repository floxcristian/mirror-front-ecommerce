import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link';
import { LoginService } from '../../../../shared/services/login.service';
import { Usuario } from '../../../../shared/interfaces/login';
// import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { RootService } from '../../../../shared/services/root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-footer-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @Input() header!: string;
  @Input() links: Link[] = [];
  usuario!: Usuario;
  innerWidth: number;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private root: RootService
  ) {
    this.innerWidth = window.innerWidth;
  }

  async ngOnInit() {
    this.usuario = await this.root.getDataSesionUsuario();

    this.loginService.loginSessionObs$.pipe().subscribe((usuario: any) => {
      this.usuario = usuario;
    });
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  async validarCuenta(link: any) {
    this.localStorage.set('ruta', link.url);
    let usuario = this.usuario;
    if (usuario == null) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }
    if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }
    this.usuario = usuario;
    if (link.label != 'Cerrar sesión') {
      this.router.navigate(['/mi-cuenta', link.url]);
    } else {
      this.router.navigate(['sitio', 'iniciar-sesion']);
    }
  }
}
