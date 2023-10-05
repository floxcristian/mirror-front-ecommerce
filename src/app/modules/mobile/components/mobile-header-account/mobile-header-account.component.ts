// import { LocalStorageService } from 'angular-2-local-storage';
import { LoginService } from './../../../../shared/services/login.service'
import { Usuario } from './../../../../shared/interfaces/login'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'

@Component({
  selector: 'app-mobile-header-account',
  templateUrl: './mobile-header-account.component.html',
  styleUrls: ['./mobile-header-account.component.scss'],
})
export class MobileHeaderAccountComponent implements OnInit {
  usuario!: Usuario
  mostrarMenu = false
  mostrarBienvenida = false
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
  ]

  constructor(
    public loginService: LoginService,
    public localS: LocalStorageService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.usuario = this.localS.get('usuario') as any

    this.loginService.loginSessionObs$.pipe().subscribe((usuario) => {
      if (!usuario.hasOwnProperty('user_role')) {
        if (usuario['user_role'] === 'superadmin') {
          this.linkMiCuenta = [
            {
              label: 'Órdenes de Venta',
              url: ['/', 'mi-cuenta', 'ordenes'],
              icon: 'far fa-file-alt',
            },
            {
              label: 'Cerrar sesión',
              url: ['/', 'mi-cuenta', 'login'],
              icon: 'fas fa-power-off',
              dark: true,
            },
          ]
        } else {
          usuario['user_role'] = ''
        }
      }

      this.usuario = usuario
      this.mostrarMenu = true
      this.mostrarBienvenida = true
      this.linkMiCuenta = this.loginService.setRoles(this.usuario.user_role)
    })

    if (this.usuario != null) {
      this.linkMiCuenta = this.loginService.setRoles(this.usuario.user_role)
    }
    this.cd.detectChanges()
  }

  cambiaElementosMenu(value: any) {
    this.mostrarMenu = value
  }

  cerrarBienvenida() {
    this.mostrarBienvenida = false
  }
}
