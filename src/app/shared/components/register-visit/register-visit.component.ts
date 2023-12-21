import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseApi } from '../../interfaces/response-api';
import { Usuario } from '../../interfaces/login';
import { rutValidator } from '../../../shared/utils/utilidades';
import { Router } from '@angular/router';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthApiService } from '@core/services-v2/auth.service';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { CartService } from '@core/services-v2/cart.service';
import {
  IShoppingCart,
  IShoppingCartGuest,
} from '@core/models-v2/cart/shopping-cart.interface';
import { IEcommerceUser } from '@core/models-v2/auth/user.interface';
import { IGuest } from '@core/models-v2/storage/guest.interface';

@Component({
  selector: 'app-register-visit',
  templateUrl: './register-visit.component.html',
  styleUrls: ['./register-visit.component.scss'],
})
export class RegisterVisitComponent implements OnInit, OnChanges {
  @Output() returnLoginEvent: EventEmitter<any> = new EventEmitter();
  @Input() linkLogin!: any;
  @Input() innerWidth!: number;
  @Input() invitado!: IEcommerceUser | IGuest;
  giros!: any[];
  comunas!: any[];
  slices = 8;
  formVisita!: FormGroup;
  passwordFormGroup!: FormGroup;
  isInvoice = false;
  tipo_fono = '+569';
  loadingForm = false;
  blockedForm = true;
  isValidRut = false;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    // Services V2
    private cartService: CartService,
    private readonly sessionStorage: SessionStorageService,
    private readonly authService: AuthApiService,
    private readonly authStateService: AuthStateServiceV2
  ) {
    this.formDefault();
  }

  ngOnChanges() {
    if (this.invitado) {
      if (this.invitado.phone?.slice(0, 4) !== '+569') {
        this.slices = 9;
        this.tipo_fono = '+56';
      }
      this.formVisita.setValue({
        rut: this.invitado.documentId || '',
        nombre: this.invitado.firstName,
        apellido: this.invitado.lastName,
        telefono: this.invitado?.phone?.slice(-this.slices),
        email: this.invitado.email,
      });
    }
  }

  ngOnInit() {
    this.formBlock(true);
  }

  formDefault() {
    this.formVisita = this.fb.group({
      rut: ['', [Validators.required, Validators.maxLength(10), rutValidator]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loadGiro() {
    this.clientService.buscarGiros().subscribe(
      (r: any) => {
        this.giros = r;
      },
      (error) => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  async registerUser() {
    const dataSave = { ...this.formVisita.value };

    let resp: any = await this.clientService.ValidarCorreo(
      String(dataSave.email).toLowerCase()
    );

    if (!resp.error || (resp.error && resp.data == 2)) {
      this.loadingForm = true;

      dataSave.tipoCliente = 1;
      dataSave.telefono = this.tipo_fono + dataSave.telefono;
      const user = this.sessionStorage.get(); //: Usuario = this.localS.get('usuario');

      let usuarioVisita: IEcommerceUser;
      usuarioVisita = this.setUsuario(dataSave);

      // FIXME: antes se usaba, y ahora??
      // usuarioVisita._id = user._id;
      if (user) {
        const guest: IGuest = {
          documentId: usuarioVisita.documentId,
          firstName: usuarioVisita.firstName,
          lastName: usuarioVisita.lastName,
          phone: usuarioVisita.phone,
          email: usuarioVisita.email,
          street: '',
          number: '',
          commune: '',
        };
        this.cartService
          .setGuestUser(user.email, guest)
          .subscribe((r: any) => {});
      }

      this.returnLoginEvent.emit(usuarioVisita);
    } else if (resp.error && resp.data != 2) {
      this.toastr.warning(
        'Hemos detectado que el email ingresado esta registrado, por favor inicie sesión para continuar'
      );
    }
  }

  setUsuario(formulario: any): IEcommerceUser {
    return {
      active: true,
      avatar: '',
      documentId: formulario.rut,
      company: formulario.nombre + ' ' + formulario.apellido,
      country: 'CL',
      email: String(formulario.email).toLowerCase(),
      firstName: formulario.nombre,
      lastName: formulario.apellido,
      loginTemp: true,
      phone: formulario.telefono,
      userRole: 'temp',
    };
  }

  login() {
    const user = this.sessionStorage.get();

    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    const dataLogin = {
      username: this.formVisita.value.email,
      password: this.formVisita.value.pwd,
    };

    this.authService.login(dataLogin.username, dataLogin.password).subscribe({
      next: (res) => {
        const iva = res.user.preferences.iva ?? true;
        const data: ISession = {
          ...res.user,
          login_temp: false,
          preferences: { iva },
        };
        this.sessionStorage.set(data);
        this.authStateService.setSession(data);
        if (userIdOld) {
          this.cartService
            .transferShoppingCart({
              origin: userIdOld,
              destination: data.email,
            })
            .subscribe((res: IShoppingCart) => {
              this.cartService.load();
            });
        } else {
          this.cartService.load();
        }
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  invoice() {
    this.isInvoice = !this.isInvoice;

    if (this.isInvoice) {
      window.scrollTo({ top: 0 });
      this.formVisita.get('rut')?.setValue(null);
      this.formVisita.get('razonsocial')?.setValidators([Validators.required]);
      this.formVisita.get('giro')?.setValidators([Validators.required]);
    } else {
      this.formVisita.get('razonsocial')?.clearValidators();
      this.formVisita.get('giro')?.clearValidators();
    }

    this.formVisita.get('razonsocial')?.updateValueAndValidity();
    this.formVisita.get('giro')?.updateValueAndValidity();

    setTimeout(() => {
      this.formBlock();
    }, 10);
  }

  returnLogin(): void {
    this.returnLoginEvent.emit(true);
  }

  formBlock(force = false) {
    if (force) {
      this.isValidRut = true;
    }

    if (this.isValidRut) {
      this.formVisita.get('nombre')?.enable();
      this.formVisita.get('apellido')?.enable();
      this.formVisita.get('telefono')?.enable();
      this.formVisita.get('email')?.enable();
    } else {
      this.formVisita.get('nombre')?.disable();
      this.formVisita.get('apellido')?.disable();
      this.formVisita.get('telefono')?.disable();
      this.formVisita.get('email')?.disable();
    }
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formVisita.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]);
    else
      this.formVisita.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);

    this.formVisita.get('telefono')?.updateValueAndValidity();
  }

  facturar() {
    this.router.navigate(['/sitio', 'registro-usuario']);
  }
}
