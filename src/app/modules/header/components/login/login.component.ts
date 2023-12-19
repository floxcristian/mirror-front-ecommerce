import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../shared/services/cart.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { ClientsService } from '../../../../shared/services/clients.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { AuthApiService } from '@core/services-v2/auth.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionTokenStorageService } from '@core/storage/session-token-storage.service';
import { GuestStorageService } from '@core/storage/guest-storage.service';

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
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private cart: CartService,
    private clientsService: ClientsService,
    private localStorage: LocalStorageService,
    // Service V2
    private readonly authService: AuthApiService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly sessionStorage: SessionStorageService,
    private readonly sessionTokenStorage: SessionTokenStorageService,
    private readonly guestStorage: GuestStorageService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.verificaSession();
  }

  redirectTo(uri: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  entrar() {
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
          // Variable para saber la ruta de la pagina.
          // Si esta en seguimiento este debe dirigirse a la pagina seguimiento en login.
          const url: any = this.localStorage.get('ruta');
          this.ruta = url || ['/inicio'];

          let queryParams: any = this.localStorage.get('queryParams');
          queryParams = queryParams || {};

          let sub;
          if (
            this.router.url.split('?')[0] != '/carro-compra/confirmar-orden-oc'
          ) {
            sub = this.cart.items$.subscribe((resp) => {
              // Si realiza login en sitio/iniciar-sesion podra dirigirse a seguimiento
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
                  : ['supervisor', 'comprador', 'buyer'].includes(
                      res.user.userRole
                    )
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
          this.sessionStorage.set(data);
          this.sessionTokenStorage.set(res.token);
          this.guestStorage.remove();
          this.authStateService.setSession(data);
          this.verificaSession();
          if (userIdOld) {
            this.cart
              .cartTransfer({
                origen: userIdOld,
                destino: data.email,
              })
              .subscribe((res: ResponseApi) => {
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
  }

  verificaSession() {
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
