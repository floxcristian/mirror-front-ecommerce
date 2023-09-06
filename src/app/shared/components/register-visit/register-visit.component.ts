import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseApi } from '../../interfaces/response-api';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../services/cart.service';
import { Usuario } from '../../interfaces/login';
import { rutValidator } from '../../../shared/utils/utilidades';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-register-visit',
  templateUrl: './register-visit.component.html',
  styleUrls: ['./register-visit.component.scss']
})
export class RegisterVisitComponent implements OnInit, OnChanges {
  @Output() returnLoginEvent: EventEmitter<any> = new EventEmitter();
  @Input() linkLogin!:any;
  @Input() innerWidth!: number;
  @Input() invitado!: Usuario;
  giros!: any[];
  comunas!: any[];
  slices = 8;
  public formVisita!: FormGroup;
  public passwordFormGroup!: FormGroup;
  public isInvoice = false;
  tipo_fono = '+569';
  loadingForm = false;
  public blockedForm = true;
  public isValidRut = false;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localS: LocalStorageService,
    private router: Router,
    private loginService: LoginService,
    private cartService: CartService
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
        rut: this.invitado.rut || '',
        nombre: this.invitado.first_name,
        apellido: this.invitado.last_name,
        telefono: this.invitado?.phone?.slice(-this.slices),
        email: this.invitado.email
      });
    }
  }

  ngOnInit() {
    this.formBlock(true);
  }

  formDefault() {
    this.formVisita = this.fb.group({
      rut: ['', [Validators.required, Validators.maxLength(10), rutValidator]],
      nombre: [, Validators.required],
      apellido: [, Validators.required],
      telefono: [, [Validators.required]],
      email: [, [Validators.required, Validators.email]]
    });
  }

  loadGiro() {
    this.clientService.buscarGiros().subscribe(
      (r: any) => {
        this.giros = r;
      },
      error => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  async registerUser() {
    const dataSave = { ...this.formVisita.value };

    let resp:any = await this.clientService.ValidarCorreo(String(dataSave.email).toLowerCase());

    if (!resp.error || (resp.error && resp.data == 2)) {
      this.loadingForm = true;

      dataSave.tipoCliente = 1;
      dataSave.telefono = this.tipo_fono + dataSave.telefono;
      const user: Usuario = this.localS.get('usuario');
      let userIdOld = null;
      if (user !== null) {
        userIdOld = user.email;
      }

      let usuarioVisita: Usuario;
      usuarioVisita = await this.setUsuario(dataSave);
      usuarioVisita._id = user._id;

      this.cartService.agregaInvitado(usuarioVisita).subscribe((r: any) => {});

      this.returnLoginEvent.emit(usuarioVisita);
    } else if (resp.error && resp.data != 2) {
      this.toastr.warning('Hemos detectado que el email ingresado esta registrado, por favor inicie sesión para continuar');
    }
  }

  async setUsuario(formulario:any) {
    let usuario = {
      active: true,
      avatar: '',
      rut: formulario.rut,
      company: formulario.nombre + ' ' + formulario.apellido,
      country: 'CL',
      email: String(formulario.email).toLowerCase(),
      first_name: formulario.nombre,
      last_name: formulario.apellido,
      login_temp: true,
      phone: formulario.telefono,
      user_role: 'temp'
    };
    return await usuario;
  }
  login() {
    const user: Usuario = this.localS.get('usuario');

    let userIdOld:any = null;
    if (user !== null) {
      userIdOld = user.email;
    }

    const dataLogin = {
      username: this.formVisita.value.email,
      password: this.formVisita.value.pwd
    };

    this.loginService.iniciarSesion(dataLogin).subscribe(
      (r: any) => {
        if (r.status === 'OK') {
          const data = { ...r.data, login_temp: false };

          this.localS.set('usuario', data);
          this.loginService.notify(data);

          if (userIdOld !== null) {
            const dataPut = {
              origen: userIdOld,
              destino: data.email
            };
            this.cartService.cartTransfer(dataPut).subscribe((res: ResponseApi) => {
              this.cartService.load();
            });
          } else {
            this.cartService.load();
          }
        } else {
          this.toastr.error(`${r.errors[0]}`);
        }
      },
      e => {
        this.toastr.error(e.error.msg);
      }
    );
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

  returnLogin() {
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

  Select_fono(tipo:any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formVisita.controls['telefono'].setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
    else
      this.formVisita.controls['telefono'].setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);

    this.formVisita.get('telefono')?.updateValueAndValidity();
  }

  facturar() {
    this.router.navigate(['/sitio', 'registro-usuario']);
  }
}
