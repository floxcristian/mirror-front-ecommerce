import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoginService } from '../../../../shared/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../shared/services/cart.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { ClientsService } from '../../../../shared/services/clients.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { AuthServiceV2 } from '@core/services-v2/auth.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-header-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  @Output() muestraLogin: EventEmitter<any> = new EventEmitter();
  @Input() class: any;
  @Input() linkRegister = false;
  @Input() linkRecoverPassword = false;
  @Input() showLabel = true;
  @Input() ruta: any;
  texto: boolean = false;
  Remember = false;
  contentRegister = false;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private cart: CartService,
    private clientsService: ClientsService,
    private localStorage: LocalStorageService,
    private readonly authService: AuthServiceV2,
    private readonly authStateService: AuthStateServiceV2,
    // Storage
    private readonly sessionStorage: SessionStorageService,
    private readonly invitadoStorage: InvitadoStorageService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.verificaSession();
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  entrar() {
    //const user: Usuario = this.localStorage.get('usuario') as Usuario;
    const user = this.sessionStorage.get();

    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    this.authService
      .login(
        this.form.get('username')?.value,
        this.form.get('password')?.value
      )
      .subscribe({
        next: (res) => {
          const url: any = this.localStorage.get('ruta');
          this.ruta = url || ['/inicio'];

          let queryParams: any = this.localStorage.get('queryParams');
          queryParams = queryParams || {};

          let sub;
          if (
            this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
          ) {
            sub = this.cart.items$.subscribe((resp) => {
              //si realiza login en sitio/iniciar-sesion podra dirigirse a seguimiento
              if (this.router.url == '/sitio/iniciar-sesion' && this.ruta) {
                (resp?.length || 0) > 0
                  ? this.router.navigate(['/carro-compra', 'resumen'])
                  : this.router.navigate(this.ruta);
              } else if (
                this.router.url != '/sitio/iniciar-sesion' &&
                this.ruta
              ) {
                (resp?.length || 0) > 0
                  ? this.router.navigate(['/carro-compra', 'resumen'])
                  : ['supervisor', 'comprador'].includes(res.user.userRole)
                  ? this.router.navigate(['/inicio']).then(() => {
                      window.location.reload();
                    })
                  : this.router.navigate([this.router.url]);
              }
            });
          }

          // Se carga lista de favoritos
          this.clientsService.cargaFavoritosLocalStorage(res.user.documentId);

          if (
            this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
          ) {
            sub?.unsubscribe();
          }

          const iva = res.user.preferences.iva ?? true;
          const data: ISession = {
            ...res.user,
            login_temp: false,
            preferences: { iva },
          };

          // FIXME: revisar internamente.
          this.sessionStorage.set(data);
          // this.localStorage.set('usuario', data);
          //this.localStorage.remove('invitado');
          this.invitadoStorage.remove();
          this.authStateService.setSession(data);
          //this.loginService.notify(data);
          this.verificaSession();
          if (userIdOld) {
            const dataPut = {
              origen: userIdOld,
              destino: data.email,
            };
            this.cart.cartTransfer(dataPut).subscribe((res: ResponseApi) => {
              this.cart.load();
            });
          } else {
            this.cart.load();
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.message);
        },
      });

    /*
    this.loginService.iniciarSesion(this.form.value).subscribe(
      (r: any) => {
        //variable para saber la ruta de la pagina
        // si esta en seguimiento este debe dirigirse a la pagina seguimiento en login
        let url: any = this.localStorage.get('ruta');
        this.ruta = url == null ? ['/inicio'] : url;

        let queryParams: any = this.localStorage.get('queryParams');
        queryParams = queryParams == null ? {} : queryParams;

        let sub;

        if (
          this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
        ) {
          sub = this.cart.items$.subscribe((resp) => {
            //si realiza login en sitio/iniciar-sesion podra dirigirse a seguimiento
            if (this.router.url == '/sitio/iniciar-sesion' && this.ruta) {
              (resp?.length || 0) > 0
                ? this.router.navigate(['/carro-compra', 'resumen'])
                : this.router.navigate(this.ruta);
            } else if (this.router.url != '/sitio/iniciar-sesion' && this.ruta)
              (resp?.length || 0) > 0
                ? this.router.navigate(['/carro-compra', 'resumen'])
                : r.data.user_role === 'supervisor' ||
                  r.data.user_role === 'comprador'
                ? this.router.navigate(['/inicio']).then(() => {
                    window.location.reload();
                  })
                : this.router.navigate([this.router.url]);
          });
        }

        // Se carga lista de favoritos
        this.clientsService.cargaFavoritosLocalStorage(r.data.rut);

        if (
          this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
        ) {
          sub?.unsubscribe();
        }

        const iva = isVacio(r.data.iva) ? true : r.data.iva;

        const data = { ...r.data, login_temp: false, iva };

        this.localStorage.set('usuario', data);
        this.localStorage.remove('invitado');
        this.loginService.notify(data);
        this.verificaSession();

        if (userIdOld !== null) {
          const dataPut = {
            origen: userIdOld,
            destino: data.email,
          };
          this.cart.cartTransfer(dataPut).subscribe((res: ResponseApi) => {
            this.cart.load();
          });
        } else {
          this.cart.load();
        }
      },
      (e) => {
        this.toastr.error(e.error.msg);
      }
    );*/
  }

  verificaSession() {
    // const user: Usuario = this.localStorage.get('usuario') as Usuario;
    const user = this.sessionStorage.get();
    if (!user) {
      this.muestraLogin.emit(false);
    } else {
      if (user.login_temp) {
        this.muestraLogin.emit(false);
      } else {
        this.muestraLogin.emit(true);
      }
    }
  }

  RemenberFn() {
    this.Remember = !this.Remember;
  }

  register() {
    this.contentRegister = true;
  }

  returnLogin() {
    this.contentRegister = false;
  }

  Registrar() {
    this.muestraLogin.emit(true);
    this.router.navigate(['/sitio', 'registro-usuario']);
  }
  ChangeType(input: any) {
    if (this.texto) this.texto = false;
    else this.texto = true;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
