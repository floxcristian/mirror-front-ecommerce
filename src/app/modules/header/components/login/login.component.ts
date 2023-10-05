import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { LoginService } from '../../../../shared/services/login.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { CartService } from '../../../../shared/services/cart.service'
import { Usuario } from '../../../../shared/interfaces/login'
import { ResponseApi } from '../../../../shared/interfaces/response-api'
import { ClientsService } from '../../../../shared/services/clients.service'
import { isVacio } from '../../../../shared/utils/utilidades'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'

@Component({
  selector: 'app-header-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup
  @Output() muestraLogin: EventEmitter<any> = new EventEmitter()
  @Input() class: any
  @Input() linkRegister = false
  @Input() linkRecoverPassword = false
  @Input() showLabel = true
  @Input() ruta: any
  texto: boolean = false
  Remember = false
  contentRegister = false

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private cart: CartService,
    private clientsService: ClientsService,
    private localStorage: LocalStorageService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.verificaSession()
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]))
  }

  entrar() {
    //const user: Usuario = this.localS.get('usuario');
    const user: Usuario = this.localStorage.get('usuario') as Usuario

    let userIdOld: any = null
    if (user !== null) {
      userIdOld = user.email
    }

    this.loginService.iniciarSesion(this.form.value).subscribe(
      (r: any) => {
        if (r.status === 'OK') {
          //variable para saber la ruta de la pagina
          // si esta en seguimiento este debe dirigirse a la pagina seguimiento en login
          let url: any = this.localStorage.get('ruta')
          this.ruta = url == null ? ['/inicio'] : url

          let queryParams: any = this.localStorage.get('queryParams')
          queryParams = queryParams == null ? {} : queryParams

          let sub
          console.log(this.router.url)
          if (
            this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
          ) {
            sub = this.cart.items$.subscribe((resp) => {
              //si realiza login en sitio/iniciar-sesion podra dirigirse a seguimiento
              if (this.router.url == '/sitio/iniciar-sesion' && this.ruta) {
                ;(resp?.length || 0) > 0
                  ? this.router.navigate(['/carro-compra', 'resumen'])
                  : this.router.navigate(this.ruta)
              } else if (
                this.router.url != '/sitio/iniciar-sesion' &&
                this.ruta
              )
                (resp?.length || 0) > 0
                  ? this.router.navigate(['/carro-compra', 'resumen'])
                  : r.data.user_role === 'supervisor' ||
                    r.data.user_role === 'comprador'
                  ? this.router.navigate(['/inicio']).then(() => {
                      window.location.reload()
                    })
                  : this.router.navigate([this.router.url])
            })
          }

          // Se carga lista de favoritos
          this.clientsService.cargaFavoritosLocalStorage(r.data.rut)

          if (
            this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
          ) {
            sub?.unsubscribe()
          }

          const iva = isVacio(r.data.iva) ? true : r.data.iva

          const data = { ...r.data, login_temp: false, iva }

          this.localStorage.set('usuario', data)
          this.localStorage.remove('invitado')
          this.loginService.notify(data)
          this.verificaSession()

          if (userIdOld !== null) {
            const dataPut = {
              origen: userIdOld,
              destino: data.email,
            }
            this.cart.cartTransfer(dataPut).subscribe((res: ResponseApi) => {
              this.cart.load()
            })
          } else {
            this.cart.load()
          }

          if (
            this.router.url.split('?')[0] ==
              '/carro-compra/confirmar-orden-oc' &&
            this.ruta
          ) {
            console.log('entro', this.ruta, queryParams)
          }
        } else {
          this.toastr.error(`${r.errors[0]}`)
        }
      },
      (e) => {
        this.toastr.error(e.error.msg)
      },
    )
  }

  verificaSession() {
    const user: Usuario = this.localStorage.get('usuario') as Usuario
    if (user == null) {
      this.muestraLogin.emit(false)
    } else {
      if (user.login_temp) {
        this.muestraLogin.emit(false)
      } else {
        this.muestraLogin.emit(true)
      }
    }
  }

  RemenberFn() {
    this.Remember = !this.Remember
  }

  register() {
    this.contentRegister = true
  }

  returnLogin() {
    this.contentRegister = false
  }

  Registrar() {
    this.muestraLogin.emit(true)
    this.router.navigate(['/sitio', 'registro-usuario'])
  }
  ChangeType(input: any) {
    if (this.texto) this.texto = false
    else this.texto = true
    input.type = input.type === 'password' ? 'text' : 'password'
  }
}
