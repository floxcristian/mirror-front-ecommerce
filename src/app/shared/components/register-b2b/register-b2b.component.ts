import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { LogisticsService } from '../../services/logistics.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseApi } from '../../interfaces/response-api';
import { rutValidator } from '../../utils/utilidades';

@Component({
  selector: 'app-register-b2b',
  templateUrl: './register-b2b.component.html',
  styleUrls: ['./register-b2b.component.scss']
})
export class Registerb2bComponent implements OnInit {
  @Output() returnLoginEvent: EventEmitter<any> = new EventEmitter();
  @Input() linkLogin!:any;
  @Input() innerWidth!: number;
  giros!: any[];
  comunas!: any[];
  tipo_fono = '+569';
  public formUsuario!: FormGroup;
  public isInvoice = true;
  public mensajeExito = false;
  loadingForm = false;
  public blockedForm = true;
  public isValidRut = false;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private logisticsService: LogisticsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.loadGiro();
    this.loadComunas();
    this.formDefault();
    this.formBlock(true);
  }

  formDefault() {
    this.formUsuario = this.fb.group({
      rut: [, [Validators.required, rutValidator]],
      nombre: [, Validators.required],
      apellido: [, Validators.required],
      telefono: [, [Validators.required]],
      email: [, [Validators.required, Validators.email]],
      calle: [, Validators.required],
      numero: [, Validators.required],
      comuna: [, Validators.required],
      razonsocial: [],
      giro: [],
      departamento: []
    });

    this.Select_fono(this.tipo_fono);
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

  loadComunas() {
    this.logisticsService.obtieneComunas().subscribe(
      (r: any) => {
        this.comunas = r.data.map((record:any) => {
          const v = record.comuna + '@' + record.provincia + '@' + record.region;
          return { id: v, value: record.comuna };
        });
      },
      error => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  registerUser() {
    const dataSave = { ...this.formUsuario.value };
    this.loadingForm = true;

    dataSave.password = 'qwert1234';
    dataSave.telefono = this.tipo_fono + dataSave.telefono;
    // formateamos rut
    const rut = dataSave.rut;
    dataSave.rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length, rut.length - 1);
    dataSave.tipoCliente = 3;

    // Se setea correo en minuscula
    dataSave.email = String(dataSave.email).toLowerCase();
    this.formUsuario.controls['email'].setValue(dataSave.email);

    this.clientService.registerb2b(dataSave).subscribe(
      (r: ResponseApi) => {
        this.loadingForm = false;

        if (r.error) {
          this.toastr.error(r.msg);
          return;
        }
        this.toastr.success('Se ha registrado existosamente, puede continuar con el proceso de compra');
        this.mensajeExito = true;
      },
      error => {
        this.toastr.error('Error de conexión con el servidor');
      }
    );
  }

  validateCustomer(e:any) {
    let value = e.target.value;
    if (this.formUsuario.controls['rut'].status === 'VALID') {
      value = value.replace(/\./g, '');
      this.clientService.validateCustomerb2b(value).subscribe(
        (r: ResponseApi) => {
          if (r.error === false) {
            if (r.data) {
              this.isValidRut = false;
              this.formBlock();
              this.toastr.warning('El RUT ingresado ya se encuentra registrado en nuestros sistemas ');
            } else {
              this.isValidRut = true;
              this.formBlock();
            }
          }
        },
        error => {
          this.toastr.error('Error de conexión con el servidor');
        }
      );
    } else {
      this.isValidRut = false;
      this.formBlock();
    }
  }

  formBlock(force = false) {
    if (force) {
      this.isValidRut = true;
    }

    if (this.isValidRut) {
      this.formUsuario.get('nombre')?.enable();
      this.formUsuario.get('apellido')?.enable();
      this.formUsuario.get('telefono')?.enable();
      this.formUsuario.get('email')?.enable();
      this.formUsuario.get('calle')?.enable();
      this.formUsuario.get('numero')?.enable();
      this.formUsuario.get('comuna')?.enable();
      this.formUsuario.get('razonsocial')?.enable();
      this.formUsuario.get('giro')?.enable();
    } else {
      this.formUsuario.get('nombre')?.disable();
      this.formUsuario.get('apellido')?.disable();
      this.formUsuario.get('telefono')?.disable();
      this.formUsuario.get('email')?.disable();
      this.formUsuario.get('calle')?.disable();
      this.formUsuario.get('numero')?.disable();
      this.formUsuario.get('comuna')?.disable();
      this.formUsuario.get('razonsocial')?.disable();
      this.formUsuario.get('giro')?.disable();
    }
  }

  Select_fono(tipo:any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formUsuario.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)
      ]);
    else
      this.formUsuario.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)
      ]);

    this.formUsuario.get('telefono')?.updateValueAndValidity();
  }
}
