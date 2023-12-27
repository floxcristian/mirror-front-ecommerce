// Angular
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Libs
import { ToastrService } from 'ngx-toastr';
// Models
import { ICity } from '@core/services-v2/geolocation/models/city.interface';
import { IBusinessLine } from '@core/services-v2/customer-business-line/business-line.interface';
// Services
import { ClientsService } from '../../services/clients.service';
import { rutValidator } from '../../utils/utilidades';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { CustomerBusinessLineApiService } from '@core/services-v2/customer-business-line/customer-business-line.api.service';

@Component({
  selector: 'app-register-b2b',
  templateUrl: './register-b2b.component.html',
  styleUrls: ['./register-b2b.component.scss'],
})
export class Registerb2bComponent implements OnInit {
  @Input() innerWidth!: number;
  cities!: ICity[];
  businessLines!: IBusinessLine[];
  userForm!: FormGroup;
  phoneCode: string;

  mensajeExito = false;
  loadingForm = false;
  isValidRut = false;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private readonly geolocationApiService: GeolocationApiService,
    private readonly customerBusinessLineApiService: CustomerBusinessLineApiService
  ) {
    this.phoneCode = '+569';
  }

  ngOnInit(): void {
    this.getBusinessLines();
    this.getCities();
    this.buildUserForm();
    this.formBlock(true);
  }

  /**
   * Construir formulario para crear usuario B2B.
   */
  private buildUserForm(): void {
    this.userForm = this.fb.group({
      documentId: ['', [Validators.required, rutValidator]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      comuna: ['', Validators.required],
      razonsocial: [],
      giro: [],
      departamento: [],
    });
    this.changePhoneCode(this.phoneCode);
  }

  /**
   * Obtener giros.
   */
  private getBusinessLines(): void {
    this.customerBusinessLineApiService.getBusinessLines().subscribe({
      next: (businessLines) => (this.businessLines = businessLines),
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

  /**
   * Registrar usuario B2B.
   */
  registerUser(): void {
    const dataSave = { ...this.userForm.value };
    this.loadingForm = true;

    dataSave.password = 'qwert1234';
    dataSave.telefono = this.phoneCode + dataSave.telefono;
    // formateamos rut
    const rut = dataSave.rut;
    dataSave.rut =
      rut.substring(0, rut.length - 1) +
      '-' +
      rut.substring(rut.length, rut.length - 1);
    dataSave.tipoCliente = 3;

    // Se setea correo en minuscula
    dataSave.email = String(dataSave.email).toLowerCase();
    this.userForm.controls['email'].setValue(dataSave.email);

    this.clientService.registerb2b(dataSave).subscribe(
      (r: any) => {
        this.loadingForm = false;

        if (r.error) {
          this.toastr.error(r.msg);
          return;
        }
        this.toastr.success(
          'Se ha registrado existosamente, puede continuar con el proceso de compra'
        );
        this.mensajeExito = true;
      },
      (error) => {
        this.toastr.error('Error de conexión con el servidor');
      }
    );
  }

  validateCustomer(e: any): void {
    let value = e.target.value;
    if (this.userForm.controls['documentId'].status === 'VALID') {
      value = value.replace(/\./g, '');
      this.clientService.validateCustomerb2b(value).subscribe(
        (r: any) => {
          if (r.error === false) {
            if (r.data) {
              this.isValidRut = false;
              this.formBlock();
              this.toastr.warning(
                'El número de documento ingresado ya se encuentra registrado en nuestros sistemas.'
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

  private formBlock(force = false): void {
    if (force) {
      this.isValidRut = true;
    }

    if (this.isValidRut) {
      this.userForm.get('nombre')?.enable();
      this.userForm.get('apellido')?.enable();
      this.userForm.get('telefono')?.enable();
      this.userForm.get('email')?.enable();
      this.userForm.get('calle')?.enable();
      this.userForm.get('numero')?.enable();
      this.userForm.get('comuna')?.enable();
      this.userForm.get('razonsocial')?.enable();
      this.userForm.get('giro')?.enable();
    } else {
      this.userForm.get('nombre')?.disable();
      this.userForm.get('apellido')?.disable();
      this.userForm.get('telefono')?.disable();
      this.userForm.get('email')?.disable();
      this.userForm.get('calle')?.disable();
      this.userForm.get('numero')?.disable();
      this.userForm.get('comuna')?.disable();
      this.userForm.get('razonsocial')?.disable();
      this.userForm.get('giro')?.disable();
    }
  }

  /**
   * Cambiar código teléfonico y setear validación del input telefónico.
   * @param phoneCode
   */
  changePhoneCode(phoneCode: string): void {
    this.phoneCode = phoneCode;

    if (this.phoneCode === '+569')
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
}
