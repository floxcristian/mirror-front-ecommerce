// Angular
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Libs
import { ToastrService } from 'ngx-toastr';
// Rxjs
import { firstValueFrom } from 'rxjs';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IEcommerceUser } from '@core/models-v2/auth/user.interface';
import { IGuest } from '@core/models-v2/storage/guest.interface';
import { IBusinessLine } from '@core/services-v2/customer-business-line/business-line.interface';
import { IConfig } from '@core/config/config.interface';
// Services
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthApiService } from '@core/services-v2/auth/auth.service';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';
import { CartService } from '@core/services-v2/cart.service';
import { CustomerService } from '@core/services-v2/customer.service';
import { CustomerBusinessLineApiService } from '@core/services-v2/customer-business-line/customer-business-line.api.service';
import { ConfigService } from '@core/config/config.service';
import { DocumentValidator } from '@core/validators/document-form.validator';

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
  giros: IBusinessLine[] = [];
  comunas!: any[];
  slices = 8;
  formVisita!: FormGroup;
  passwordFormGroup!: FormGroup;
  isInvoice = false;
  selectedPhoneCode: string;
  loadingForm = false;
  blockedForm = true;
  isValidRut = false;
  config: IConfig;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    // Services V2
    private cartService: CartService,
    private readonly sessionStorage: SessionStorageService,
    private readonly authService: AuthApiService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly customerService: CustomerService,
    private readonly customerBusinessLineService: CustomerBusinessLineApiService,
    private readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.selectedPhoneCode = this.config.phoneCodes.mobile.code;
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.invitado) {
      if (
        this.invitado.phone?.slice(0, 4) !== this.config.phoneCodes.mobile.code
      ) {
        this.slices = 9;
        this.selectedPhoneCode = this.config.phoneCodes.landline.code;
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

  ngOnInit(): void {
    this.formBlock(true);
  }

  private buildForm(): void {
    this.formVisita = this.fb.group({
      rut: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          DocumentValidator.isValidDocumentId,
        ],
      ],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loadGiro(): void {
    this.customerBusinessLineService.getBusinessLines().subscribe({
      next: (businessLines) => (this.giros = businessLines),
      error: (e) => {
        console.error(e);
        this.toastr.error('No se pudieron traer los giros comerciales');
      },
    });
  }

  async registerUser() {
    const dataSave = { ...this.formVisita.value };

    const email = String(dataSave.email).toLowerCase();
    try {
      const resp = await firstValueFrom(
        this.customerService.checkEmail(email)
      );
      if (!resp.exists) {
        this.loadingForm = true;

        dataSave.tipoCliente = 1;
        dataSave.telefono = this.selectedPhoneCode + dataSave.telefono;
        const user = this.sessionStorage.get();

        const guestUser = this.setUsuario(dataSave);
        // FIXME: antes se usaba, y ahora??
        // usuarioVisita._id = user._id;
        if (user) {
          const guest: IGuest = {
            documentId: guestUser.documentId,
            firstName: guestUser.firstName,
            lastName: guestUser.lastName,
            phone: guestUser.phone,
            email: guestUser.email,
            street: '',
            number: '',
            commune: '',
          };
          await firstValueFrom(
            this.cartService.setGuestUser(user.email, guest)
          );
        }

        this.returnLoginEvent.emit(guestUser);
      } else {
        this.toastr.warning(
          'Hemos detectado que el email ingresado esta registrado, por favor inicie sesión para continuar.'
        );
      }
    } catch (e) {
      console.error(e);
      this.toastr.error('Ocurrió un error intentado validar correo');
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

  login(): void {
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
            .subscribe(() => {
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

  Select_fono(phoneCode: string): void {
    this.selectedPhoneCode = phoneCode;

    if (this.selectedPhoneCode === this.config.phoneCodes.mobile.code)
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
