import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { LogisticsService } from '../../services/logistics.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseApi } from '../../interfaces/response-api';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../services/cart.service';
import { PasswordValidator } from '../../validations/password';
import { Router } from '@angular/router';
import {
  CargoContacto,
  CargosContactoResponse,
} from '../../interfaces/cargoContacto';
import { rutValidator } from '../../utils/utilidades';
import { AngularEmailAutocompleteComponent } from '../angular-email-autocomplete/angular-email-autocomplete.component';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { getDomainsToAutocomplete } from './domains-autocomplete';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthServiceV2 } from '@core/services-v2/auth.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() returnLoginEvent: EventEmitter<any> = new EventEmitter();
  @Input() linkLogin!: any;
  @Input() innerWidth!: number;
  giros!: any[];
  comunas!: any[];
  tipo_fono = '+569';
  coleccionComuna!: any[];
  localidades!: any[];
  formUsuario!: FormGroup;
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
    private logisticsService: LogisticsService,
    private fb: FormBuilder,
    private localS: LocalStorageService,
    private loginService: LoginService,
    private cartService: CartService,
    private router: Router,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authService: AuthServiceV2,
    private readonly authStateService: AuthStateServiceV2
  ) {}

  ngOnInit() {
    this.loadGiro();
    this.loadComunas();
    this.formDefault();
    this.domains = getDomainsToAutocomplete();
    this.getCargos();
    this.formBlock();
  }

  formDefault() {
    this.formUsuario = this.fb.group(
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

  loadComunas() {
    this.logisticsService.obtieneComunas().subscribe(
      (r: any) => {
        this.coleccionComuna = r.data;
        this.comunas = r.data.map((record: any) => {
          const v =
            record.comuna + '@' + record.provincia + '@' + record.region;
          return { id: v, value: record.comuna };
        });
      },
      (error) => {
        this.toastr.error(error.error.msg);
      }
    );
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
    const dataSave = { ...this.formUsuario.value };

    dataSave.password = dataSave.pwd;
    dataSave.telefono = this.tipo_fono + dataSave.telefono;

    // Se setea correo en minuscula
    dataSave.email = String(emailValidado).toLowerCase();

    dataSave.rut = this.rut;

    // validamos si es boleta o factura
    if (this.isInvoice) {
      dataSave.tipoCliente = 2;
      dataSave.nombreGiro = this.giros.find(
        (g) => g.codigo === dataSave.giro
      ).nombre;
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
          password: this.formUsuario.value.pwd,
        };

        this.authService
          .login(dataLogin.username, dataLogin.password)
          .subscribe({
            next: (res) => {
              const iva = res.user.preferences.iva ?? true;
              const data = { ...res.user, login_temp: false, iva };
              //FIXME: revisar si dejar en data o manipular otro nombre
              this.sessionStorage.set(data);
              this.authStateService.setSession(data);
              if (userIdOld !== null) {
                const dataPut = {
                  origen: userIdOld,
                  destino: data.email,
                };
                this.cartService
                  .cartTransfer(dataPut)
                  .subscribe((res: ResponseApi) => {
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

        // this.loginService.iniciarSesion(dataLogin).subscribe(
        //   (r: any) => {
        //     if (r.status === 'OK') {
        //       const data = { ...r.data, login_temp: false };
        //       this.localS.set('usuario', data);
        //       this.loginService.notify(data);

        //       if (userIdOld !== null) {
        //         const dataPut = {
        //           origen: userIdOld,
        //           destino: data.email,
        //         };
        //         this.cartService
        //           .cartTransfer(dataPut)
        //           .subscribe((res: ResponseApi) => {
        //             this.cartService.load();
        //           });
        //       } else {
        //         this.cartService.load();
        //       }
        //       this.router.navigate(['/inicio']);
        //     } else {
        //       this.toastr.error(`${r.errors[0]}`);
        //     }
        //   },
        //   (e) => {
        //     this.toastr.error(e.error.msg);
        //   }
        // );
      },
      (error) => {
        this.toastr.error('Error de conexión con el servidor');
      }
    );
  }

  fake(email: AngularEmailAutocompleteComponent) {
    this.loadingForm = true;
    const emailValidado = email.inputValue;
    const dataSave = { ...this.formUsuario.value };

    dataSave.password = dataSave.pwd;

    // Se setea correo en minuscula
    dataSave.email = String(emailValidado).toLowerCase();

    dataSave.rut = this.rut;

    // validamos si es boleta o factura
    if (this.isInvoice) {
      dataSave.tipoCliente = 2;
      dataSave.nombreGiro = this.giros.find(
        (g) => g.codigo === dataSave.giro
      ).nombre;
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
      username: this.formUsuario.value.email,
      password: this.formUsuario.value.pwd,
    };
    this.authService.login(dataLogin.username, dataLogin.password).subscribe({
      next: (res) => {
        const iva = res.user.preferences.iva ?? true;
        const data = { ...res.user, login_temp: false, iva };
        //FIXME: revisar si dejar en data o manipular otro nombre
        this.sessionStorage.set(data);
        this.authStateService.setSession(data);
        if (userIdOld !== null) {
          const dataPut = {
            origen: userIdOld,
            destino: data.email,
          };
          this.cartService
            .cartTransfer(dataPut)
            .subscribe((res: ResponseApi) => {
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

    // this.loginService.iniciarSesion(dataLogin).subscribe(
    //   (r: any) => {
    //     if (r.status === 'OK') {
    //       const data = { ...r.data, login_temp: false };
    //       this.localS.set('usuario', data);
    //       this.loginService.notify(data);

    //       if (userIdOld !== null) {
    //         const dataPut = {
    //           origen: userIdOld,
    //           destino: data.username,
    //         };
    //         this.cartService
    //           .cartTransfer(dataPut)
    //           .subscribe((res: ResponseApi) => {
    //             this.cartService.load();
    //           });
    //       } else {
    //         this.cartService.load();
    //       }
    //     } else {
    //       this.toastr.error(`${r.errors[0]}`);
    //     }
    //   },
    //   (e) => {
    //     this.toastr.error(e.error.msg);
    //   }
    // );
  }

  login() {
    const user = this.sessionStorage.get(); //: Usuario = this.localS.get('usuario');

    let userIdOld: any = null;
    if (user) {
      userIdOld = user.email;
    }

    const dataLogin = {
      username: this.formUsuario.value.email,
      password: this.formUsuario.value.pwd,
    };

    this.authService.login(dataLogin.username, dataLogin.password).subscribe({
      next: (res) => {
        const iva = res.user.preferences.iva ?? true;
        const data = { ...res.user, login_temp: false, iva };
        //FIXME: revisar si dejar en data o manipular otro nombre
        this.sessionStorage.set(data);
        this.authStateService.setSession(data);
        if (userIdOld !== null) {
          const dataPut = {
            origen: userIdOld,
            destino: data.email,
          };
          this.cartService
            .cartTransfer(dataPut)
            .subscribe((res: ResponseApi) => {
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

    // this.loginService.iniciarSesion(dataLogin).subscribe(
    //   (r: any) => {
    //     if (r.status === 'OK') {
    //       const data = { ...r.data, login_temp: false };

    //       this.localS.set('usuario', data);
    //       this.loginService.notify(data);

    //       if (userIdOld !== null) {
    //         const dataPut = {
    //           origen: userIdOld,
    //           destino: data.email,
    //         };
    //         this.cartService
    //           .cartTransfer(dataPut)
    //           .subscribe((res: ResponseApi) => {
    //             this.cartService.load();
    //           });
    //       } else {
    //         this.cartService.load();
    //       }
    //     } else {
    //       this.toastr.error(`${r.errors[0]}`);
    //     }
    //   },
    //   (e) => {
    //     this.toastr.error(e.error.msg);
    //   }
    // );
  }

  invoice() {
    this.isInvoice = !this.isInvoice;
    this.checkBoxPersona = !this.checkBoxPersona;
    if (this.isInvoice) {
      window.scrollTo({ top: 0 });
      this.formUsuario.get('rut')?.setValue(null);
      this.formUsuario.get('contactRut')?.setValue(null);
      this.formUsuario
        .get('contactRut')
        ?.setValidators([Validators.required, rutValidator]);
      this.formUsuario.get('cargo')?.setValidators([Validators.required]);
      this.formUsuario
        .get('razonsocial')
        ?.setValidators([Validators.required]);
      this.formUsuario.get('giro')?.setValidators([Validators.required]);
    } else {
      this.formUsuario.get('rut')?.setValue(null);
      this.formUsuario.get('contactRut')?.setValue(null);
      this.formUsuario.get('contactRut')?.clearValidators();
      this.formUsuario.get('cargo')?.clearValidators();
      this.formUsuario.get('razonsocial')?.clearValidators();
      this.formUsuario.get('giro')?.clearValidators();
    }

    this.formUsuario.markAsUntouched();
    this.isValidRut = false;
    this.formBlock();
  }

  returnLogin() {
    this.returnLoginEvent.emit(true);
  }

  validateCustomer(e: any) {
    let value = e.target.value;
    if (this.formUsuario.controls['rut'].status === 'VALID') {
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
      this.formUsuario.get('rut')?.disable();
      this.formUsuario.get('contactRut')?.enable();
      this.formUsuario.get('cargo')?.enable();
      this.formUsuario.get('nombre')?.enable();
      this.formUsuario.get('apellido')?.enable();
      this.formUsuario.get('telefono')?.enable();
      this.formUsuario.get('pwd')?.enable();
      this.formUsuario.get('confirmPwd')?.enable();
      this.formUsuario.get('calle')?.enable();
      this.formUsuario.get('comuna')?.enable();
      this.formUsuario.get('numero')?.enable();
      this.formUsuario.get('departamento')?.enable();
      this.formUsuario.get('referencia')?.enable();

      if (this.isInvoice) {
        this.formUsuario.get('razonsocial')?.enable();
        this.formUsuario.get('giro')?.enable();
      }
    } else {
      this.rutDisabled = false;
      this.formUsuario.get('rut')?.enable();
      this.formUsuario.get('contactRut')?.disable();
      this.formUsuario.get('cargo')?.disable();
      this.formUsuario.get('nombre')?.disable();
      this.formUsuario.get('apellido')?.disable();
      this.formUsuario.get('telefono')?.disable();
      this.formUsuario.get('pwd')?.disable();
      this.formUsuario.get('confirmPwd')?.disable();
      this.formUsuario.get('calle')?.disable();
      this.formUsuario.get('numero')?.disable();
      this.formUsuario.get('comuna')?.disable();
      this.formUsuario.get('departamento')?.disable();
      this.formUsuario.get('referencia')?.disable();

      if (this.isInvoice) {
        this.formUsuario.get('razonsocial')?.disable();
        this.formUsuario.get('giro')?.disable();
      }
    }
  }

  setDireccion(data: any[]) {
    this.clearAddress();

    if (this.getAddressData(data[0], 'street_number')) {
      this.disableDireccion = false;

      if (this.getAddressData(data[0], 'locality')) {
        this.formUsuario.controls['comuna'].setValue(
          this.findComuna(this.getAddressData(data[0], 'locality'))
        );
      } else {
        this.formUsuario.controls['comuna'].setValue(
          this.findComuna(
            this.getAddressData(data[0], 'administrative_area_level_3')
          )
        );
      }
      this.formUsuario.controls['calle'].setValue(
        this.getAddressData(data[0], 'route')
      );
      this.formUsuario.controls['numero'].setValue(
        this.getAddressData(data[0], 'street_number')
      );
      this.formUsuario.controls['latitud'].setValue(data[1].lat);
      this.formUsuario.controls['longitud'].setValue(data[1].lng);

      this.obtenerLocalidades({
        id: this.formUsuario.controls['comuna'].value,
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

      const result = this.comunas.find(
        (data) => this.quitarAcentos(data.value) === nombre
      );

      if (result && result.id) {
        this.obtenerLocalidades(result);
        this.findComunaLocalizacion(result.value);
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
        this.formUsuario.controls['localizacion'].setValue(result.localidad);
      }
    }
  }

  clearAddress() {
    this.formUsuario.controls['comuna'].setValue('');
    this.formUsuario.controls['calle'].setValue(null);
    this.formUsuario.controls['numero'].setValue(null);
    this.formUsuario.controls['departamento'].setValue(null);
    this.formUsuario.controls['referencia'].setValue('');
    this.formUsuario.controls['localizacion'].setValue('');
    this.formUsuario.controls['latitud'].setValue('');
    this.formUsuario.controls['longitud'].setValue('');
  }

  clearRut() {
    this.isValidRut = false;
    this.formBlock();
    this.formUsuario.get('rut')?.setValue(null);
    this.formUsuario.get('rut')?.markAsUntouched();
    this.rut = '';
  }

  cargarDireccion() {
    this.direccion = null;
    if (
      this.formUsuario.controls['calle'].value != '' &&
      this.formUsuario.controls['comuna'].value != '' &&
      this.formUsuario.controls['numero'].value != ''
    ) {
      const { calle, numero, comuna, localizacion } = this.formUsuario.value;
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
    this.formUsuario.controls['latitud'].setValue(event.lat);
    this.formUsuario.controls['longitud'].setValue(event.lng);
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formUsuario.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]);
    else
      this.formUsuario.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);

    this.formUsuario.get('telefono')?.updateValueAndValidity();
  }

  registrar() {
    this.checkBoxSuscribir = !this.checkBoxSuscribir;
  }
  acepto() {
    this.checkBoxTerminos = !this.checkBoxTerminos;
  }
}
