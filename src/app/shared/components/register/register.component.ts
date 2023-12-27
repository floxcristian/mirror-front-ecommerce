// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';
import { IBusinessLine } from '@core/services-v2/customer-business-line/business-line.interface';
import { ICity } from '@core/services-v2/geolocation/models/city.interface';
// Services
import { ClientsService } from '../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidator } from '../../validations/password';
import {
  CargoContacto,
  CargosContactoResponse,
} from '../../interfaces/cargoContacto';
import { rutValidator } from '../../utils/utilidades';
import { AngularEmailAutocompleteComponent } from '../angular-email-autocomplete/angular-email-autocomplete.component';
import { getDomainsToAutocomplete } from './domains-autocomplete';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthApiService } from '@core/services-v2/auth.service';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';
import { CartService } from '@core/services-v2/cart.service';
import { CustomerBusinessLineApiService } from '@core/services-v2/customer-business-line/customer-business-line.api.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() returnLoginEvent: EventEmitter<any> = new EventEmitter();
  @Input() linkLogin!: any;
  @Input() innerWidth!: number;

  businessLines!: IBusinessLine[];
  cities!: ICity[];
  tipo_fono = '+569';
  coleccionComuna!: any[];
  localidades!: any[];
  userForm!: FormGroup;
  passwordFormGroup!: FormGroup;
  isInvoice = true;
  loadingForm = false;
  rutDisabled = false;
  isValidRut = false;
  autocompletado = true;
  direccion: any;
  disableDireccion = true;
  checkBoxPersona = false;
  checkBoxTerminos = false;
  checkBoxSuscribir = false;
  checkBoxEmpresa!: boolean;
  domains: any[] = [];
  cargos: CargoContacto[] = [];
  rut = '';
  JSON = JSON;
  cantMaxRut: number = 10;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    // Services V2
    private cartService: CartService,
    private readonly sessionStorage: SessionStorageService,
    private readonly authService: AuthApiService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly customerBusinessLineApiService: CustomerBusinessLineApiService,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  ngOnInit(): void {
    this.getBusinessLines();
    this.getCities();
    this.buildUserForm();
    this.domains = getDomainsToAutocomplete();
    this.getCargos();
    this.formBlock();
  }

  private buildUserForm(): void {
    this.userForm = this.fb.group(
      {
        rut: [, [Validators.required, rutValidator]],
        contactRut: [, [Validators.required, rutValidator]],
        cargo: [, Validators.required],
        nombre: [, Validators.required],
        apellido: [, Validators.required],
        telefono: [, [Validators.required]],
        razonsocial: [],
        giro: [],

        calle: [, Validators.required],
        numero: [, Validators.required],
        comuna: [, Validators.required],
        localizacion: [],
        latitud: [],
        longitud: [],
        referencia: [],
        departamento: [],

        pwd: [, [Validators.required, Validators.minLength(6)]],
        confirmPwd: [, [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: PasswordValidator.validate.bind(this),
      }
    );

    this.Select_fono(this.tipo_fono);
  }

  /**
   * Obtener giros.
   */
  private getBusinessLines(): void {
    this.customerBusinessLineApiService.getBusinessLines().subscribe({
      next: (businessLines) => {
        this.businessLines = businessLines;
      },
    });
  }

  /**
   * Obtener ciudades.
   */
  private getCities(): void {
    this.geolocationApiService.getCities().subscribe({
      next: (cities) => (this.cities = cities),
    });
  }

  getCargos() {
    this.clientService
      .getCargosContacto()
      .subscribe((response: CargosContactoResponse) => {
        if (!response.error) {
          this.cargos = response.data;
        }
      });
  }

  registerUser(email: AngularEmailAutocompleteComponent) {
    this.loadingForm = true;
    const emailValidado = email.inputValue;
    const dataSave = { ...this.userForm.value };

    dataSave.password = dataSave.pwd;
    dataSave.telefono = this.tipo_fono + dataSave.telefono;

    // Se setea correo en minuscula
    dataSave.email = String(emailValidado).toLowerCase();

    dataSave.rut = this.rut;

    // validamos si es boleta o factura
    if (this.isInvoice) {
      dataSave.tipoCliente = 2;
      dataSave.nombreGiro =
        this.businessLines.find((item) => item.code === dataSave.giro)?.name ||
        '';
    } else {
      dataSave.tipoCliente = 1;
      dataSave.contactRut = this.rut;
      dataSave.cargo = 'FACTURACION';
    }

    delete dataSave.pwd;
    delete dataSave.confirmPwd;

    // guardamos id de carro actual
    // const user: Usuario = this.localS.get('usuario');
    const user = this.sessionStorage.get();
    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    this.clientService.register(dataSave).subscribe(
      (r: any) => {
        this.loadingForm = false;

        if (r.error) {
          this.toastr.error(r.msg);
          return;
        }
        this.toastr.success(
          'Se ha registrado existosamente, puede continuar con el proceso de compra'
        );

        const dataLogin = {
          username: dataSave.email,
          password: this.userForm.value.pwd,
        };

        this.authService
          .login(dataLogin.username, dataLogin.password)
          .subscribe({
            next: (res) => {
              const iva = res.user.preferences.iva ?? true;
              const session: ISession = {
                ...res.user,
                login_temp: false,
                preferences: { iva },
              };
              this.sessionStorage.set(session);
              this.authStateService.setSession(session);
              if (userIdOld) {
                this.cartService
                  .transferShoppingCart({
                    origin: userIdOld,
                    destination: session.email,
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
      },
      (error) => {
        this.toastr.error('Error de conexión con el servidor');
      }
    );
  }

  fake(email: AngularEmailAutocompleteComponent) {
    this.loadingForm = true;
    const emailValidado = email.inputValue;
    const dataSave = { ...this.userForm.value };

    dataSave.password = dataSave.pwd;

    // Se setea correo en minuscula
    dataSave.email = String(emailValidado).toLowerCase();

    dataSave.rut = this.rut;

    // validamos si es boleta o factura
    if (this.isInvoice) {
      dataSave.tipoCliente = 2;
      dataSave.nombreGiro =
        this.businessLines.find((item) => item.code === dataSave.giro)?.name ||
        '';
    } else {
      dataSave.tipoCliente = 1;
      dataSave.contactRut = this.rut;
      dataSave.cargo = 'FACTURACION';
    }

    delete dataSave.pwd;
    delete dataSave.confirmPwd;

    // guardamos id de carro actual
    const user = this.sessionStorage.get(); //: Usuario = this.localS.get('usuario');
    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    const dataLogin = {
      username: this.userForm.value.email,
      password: this.userForm.value.pwd,
    };
    this.authService.login(dataLogin.username, dataLogin.password).subscribe({
      next: (res) => {
        const iva = res.user.preferences.iva ?? true;
        const session: ISession = {
          ...res.user,
          login_temp: false,
          preferences: { iva },
        };
        this.sessionStorage.set(session);
        this.authStateService.setSession(session);
        if (userIdOld) {
          this.cartService
            .transferShoppingCart({
              origin: userIdOld,
              destination: session.email,
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

  login() {
    const user = this.sessionStorage.get(); //: Usuario = this.localS.get('usuario');

    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    const dataLogin = {
      username: this.userForm.value.email,
      password: this.userForm.value.pwd,
    };

    this.authService.login(dataLogin.username, dataLogin.password).subscribe({
      next: (res) => {
        const iva = res.user.preferences.iva ?? true;
        const session: ISession = {
          ...res.user,
          login_temp: false,
          preferences: { iva },
        };

        this.sessionStorage.set(session);
        this.authStateService.setSession(session);
        if (userIdOld) {
          this.cartService
            .transferShoppingCart({
              origin: userIdOld,
              destination: session.email,
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
    this.checkBoxPersona = !this.checkBoxPersona;
    if (this.isInvoice) {
      window.scrollTo({ top: 0 });
      this.userForm.get('rut')?.setValue(null);
      this.userForm.get('contactRut')?.setValue(null);
      this.userForm
        .get('contactRut')
        ?.setValidators([Validators.required, rutValidator]);
      this.userForm.get('cargo')?.setValidators([Validators.required]);
      this.userForm.get('razonsocial')?.setValidators([Validators.required]);
      this.userForm.get('giro')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('rut')?.setValue(null);
      this.userForm.get('contactRut')?.setValue(null);
      this.userForm.get('contactRut')?.clearValidators();
      this.userForm.get('cargo')?.clearValidators();
      this.userForm.get('razonsocial')?.clearValidators();
      this.userForm.get('giro')?.clearValidators();
    }

    this.userForm.markAsUntouched();
    this.isValidRut = false;
    this.formBlock();
  }

  returnLogin() {
    this.returnLoginEvent.emit(true);
  }

  validateCustomer(e: any) {
    let value = e.target.value;
    if (this.userForm.controls['rut'].status === 'VALID') {
      value = value.replace(/\./g, '');
      this.clientService.validateCustomer(value).subscribe(
        (r: any) => {
          if (r.error === false) {
            if (r.data) {
              this.isValidRut = false;
              this.formBlock();
              this.toastr.warning(
                'El RUT ingresado ya se encuentra registrado en nuestros sistemas '
              );
            } else {
              this.isValidRut = true;
              this.formBlock();
            }
          }
        },
        (error) => {
          this.toastr.error('Error de conexión con el servidor');
        }
      );
    } else {
      this.isValidRut = false;
      this.formBlock();
    }
  }

  formBlock() {
    if (this.isValidRut) {
      this.rutDisabled = true;
      this.userForm.get('rut')?.disable();
      this.userForm.get('contactRut')?.enable();
      this.userForm.get('cargo')?.enable();
      this.userForm.get('nombre')?.enable();
      this.userForm.get('apellido')?.enable();
      this.userForm.get('telefono')?.enable();
      this.userForm.get('pwd')?.enable();
      this.userForm.get('confirmPwd')?.enable();
      this.userForm.get('calle')?.enable();
      this.userForm.get('comuna')?.enable();
      this.userForm.get('numero')?.enable();
      this.userForm.get('departamento')?.enable();
      this.userForm.get('referencia')?.enable();

      if (this.isInvoice) {
        this.userForm.get('razonsocial')?.enable();
        this.userForm.get('giro')?.enable();
      }
    } else {
      this.rutDisabled = false;
      this.userForm.get('rut')?.enable();
      this.userForm.get('contactRut')?.disable();
      this.userForm.get('cargo')?.disable();
      this.userForm.get('nombre')?.disable();
      this.userForm.get('apellido')?.disable();
      this.userForm.get('telefono')?.disable();
      this.userForm.get('pwd')?.disable();
      this.userForm.get('confirmPwd')?.disable();
      this.userForm.get('calle')?.disable();
      this.userForm.get('numero')?.disable();
      this.userForm.get('comuna')?.disable();
      this.userForm.get('departamento')?.disable();
      this.userForm.get('referencia')?.disable();

      if (this.isInvoice) {
        this.userForm.get('razonsocial')?.disable();
        this.userForm.get('giro')?.disable();
      }
    }
  }

  setDireccion(data: any[]) {
    this.clearAddress();

    if (this.getAddressData(data[0], 'street_number')) {
      this.disableDireccion = false;

      if (this.getAddressData(data[0], 'locality')) {
        this.userForm.controls['comuna'].setValue(
          this.findComuna(this.getAddressData(data[0], 'locality'))
        );
      } else {
        this.userForm.controls['comuna'].setValue(
          this.findComuna(
            this.getAddressData(data[0], 'administrative_area_level_3')
          )
        );
      }
      this.userForm.controls['calle'].setValue(
        this.getAddressData(data[0], 'route')
      );
      this.userForm.controls['numero'].setValue(
        this.getAddressData(data[0], 'street_number')
      );
      this.userForm.controls['latitud'].setValue(data[1].lat);
      this.userForm.controls['longitud'].setValue(data[1].lng);

      this.obtenerLocalidades({
        id: this.userForm.controls['comuna'].value,
      });
      this.cargarDireccion();
    }
  }

  getAddressData(address_components: any, tipo: string) {
    let value = '';

    address_components.forEach((element: any) => {
      if (element.types[0] == tipo) {
        value = element.long_name;
        return;
      }
    });
    return value;
  }

  quitarAcentos(cadena: string) {
    // Definimos los caracteres que queremos eliminar
    const specialChars = '!@#$^&%*()+=-[]/{}|:<>?,.';

    // Los eliminamos todos
    for (let i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, '_');

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, 'a');
    cadena = cadena.replace(/é/gi, 'e');
    cadena = cadena.replace(/í/gi, 'i');
    cadena = cadena.replace(/ó/gi, 'o');
    cadena = cadena.replace(/ú/gi, 'u');
    cadena = cadena.replace(/ñ/gi, 'n');

    return cadena;
  }

  findComuna(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      const result = this.cities.find(
        (city) => this.quitarAcentos(city.city) === nombre
      );

      if (result) {
        this.obtenerLocalidades(result);
        this.findComunaLocalizacion(result.city);
        return result.id;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  findComunaLocalizacion(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      const result = this.localidades.find(
        (data) => this.quitarAcentos(data.localidad) === nombre
      );

      if (result && result.localidad) {
        this.userForm.controls['localizacion'].setValue(result.localidad);
      }
    }
  }

  clearAddress() {
    this.userForm.controls['comuna'].setValue('');
    this.userForm.controls['calle'].setValue(null);
    this.userForm.controls['numero'].setValue(null);
    this.userForm.controls['departamento'].setValue(null);
    this.userForm.controls['referencia'].setValue('');
    this.userForm.controls['localizacion'].setValue('');
    this.userForm.controls['latitud'].setValue('');
    this.userForm.controls['longitud'].setValue('');
  }

  clearRut() {
    this.isValidRut = false;
    this.formBlock();
    this.userForm.get('rut')?.setValue(null);
    this.userForm.get('rut')?.markAsUntouched();
    this.rut = '';
  }

  cargarDireccion() {
    this.direccion = null;
    if (
      this.userForm.controls['calle'].value != '' &&
      this.userForm.controls['comuna'].value != '' &&
      this.userForm.controls['numero'].value != ''
    ) {
      const { calle, numero, comuna, localizacion } = this.userForm.value;
      const comunaArr = comuna.split('@');

      this.direccion = {
        direccion: `${calle} ${numero}`,
        zona: `${comunaArr[0]} ${localizacion}`,
      };
    } else {
      return;
    }
  }

  obtenerLocalidades(event: any) {
    const localidades: any[] = [];
    const comunaArr = event.id.split('@');
    const comunas = this.coleccionComuna.filter(
      (comuna) => comuna.comuna == comunaArr[0]
    );
    comunas.map((comuna) =>
      comuna.localidades.map((localidad: any) => localidades.push(localidad))
    );
    this.localidades = localidades;
  }

  geolocalizacion(event: any) {
    this.userForm.controls['latitud'].setValue(event.lat);
    this.userForm.controls['longitud'].setValue(event.lng);
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.userForm.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]);
    else
      this.userForm.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);

    this.userForm.get('telefono')?.updateValueAndValidity();
  }

  registrar() {
    this.checkBoxSuscribir = !this.checkBoxSuscribir;
  }
  acepto() {
    this.checkBoxTerminos = !this.checkBoxTerminos;
  }
}
