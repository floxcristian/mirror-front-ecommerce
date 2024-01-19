// Angular
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Libs
import { ToastrService } from 'ngx-toastr';
// Models
import { ICity } from '@core/services-v2/geolocation/models/city.interface';
import { IBusinessLine } from '@core/services-v2/customer-business-line/business-line.interface';
import { IPhoneCodes } from '@core/config/config.interface';
// Services
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { CustomerBusinessLineApiService } from '@core/services-v2/customer-business-line/customer-business-line.api.service';
import { ConfigService } from '@core/config/config.service';
import { CustomerApiService } from '@core/services-v2/customer/customer-api.service';
import { DocumentValidator } from '@core/validators/document-form.validator';

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
  phoneCodes: IPhoneCodes;
  documentName: string;
  isLoading!: boolean;

  private isValidDocumentId!: boolean;
  isSuccessfullyRegistered!: boolean;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private readonly geolocationApiService: GeolocationApiService,
    private readonly customerBusinessLineApiService: CustomerBusinessLineApiService,
    private readonly configService: ConfigService,
    private readonly customerApiService: CustomerApiService
  ) {
    const { document, phoneCodes } = this.configService.getConfig();
    this.documentName = document.name;
    this.phoneCodes = phoneCodes;
    this.phoneCode = this.phoneCodes.mobile.code;
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
      documentId: [
        '',
        [Validators.required, DocumentValidator.isValidDocumentId],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      addressNumber: ['', Validators.required],
      city: [null, Validators.required],
      businessName: [null, Validators.required],
      businessLine: [null, Validators.required],
      departmentOrHouse: [null],
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
    this.isLoading = true;

    const {
      firstName,
      lastName,
      businessLine,
      businessName,
      phone,
      email,
      documentId,
      city,
      street,
      addressNumber,
      departmentOrHouse,
    } = this.userForm.value;

    this.customerApiService
      .registerUserB2B({
        email,
        firstName,
        lastName,
        city,
        street,
        addressNumber,
        departmentOrHouse,
        businessLine,
        businessName,
        documentId,
        phone: `${this.phoneCode}${phone}`,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccessfullyRegistered = true;
          this.toastr.success(
            `Se ha registrado existosamente, puede continuar con el proceso de compra.`
          );
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.toastr.error(`Ha ocurrido un error al registrar el usuario.`);
        },
      });
  }

  /**
   * Verifica si el documento ingresado ya existe.
   * @param event
   */
  checkIfDocumentIdExists(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (this.userForm.controls['documentId'].status === 'VALID') {
      const documentId = input.value.replace(/\./g, '');
      this.customerApiService.checkIfUserExists(documentId).subscribe({
        next: (res) => {
          if (res.exists) {
            this.toastr.warning(
              `El número de documento ingresado ya se encuentra registrado en nuestros sistemas.`
            );
          }
          this.isValidDocumentId = res.exists ? false : true;
          this.formBlock();
        },
      });
    } else {
      this.isValidDocumentId = false;
      this.formBlock();
    }
  }

  private formBlock(force = false): void {
    if (force) {
      this.isValidDocumentId = true;
    }

    if (this.isValidDocumentId) {
      this.userForm.get('firstName')?.enable();
      this.userForm.get('lastName')?.enable();
      this.userForm.get('phone')?.enable();
      this.userForm.get('email')?.enable();
      this.userForm.get('street')?.enable();
      this.userForm.get('addressNumber')?.enable();
      this.userForm.get('city')?.enable();
      this.userForm.get('departmentOrHouse')?.enable();
      this.userForm.get('businessName')?.enable();
      this.userForm.get('businessLine')?.enable();
    } else {
      this.userForm.get('firstName')?.disable();
      this.userForm.get('lastName')?.disable();
      this.userForm.get('phone')?.disable();
      this.userForm.get('email')?.disable();
      this.userForm.get('street')?.disable();
      this.userForm.get('addressNumber')?.disable();
      this.userForm.get('city')?.disable();
      this.userForm.get('departmentOrHouse')?.disable();
      this.userForm.get('businessName')?.disable();
      this.userForm.get('businessLine')?.disable();
    }
  }

  /**
   * Cambiar código teléfonico y setear validación del input telefónico.
   * @param phoneCode
   */
  changePhoneCode(phoneCode: string): void {
    this.phoneCode = phoneCode;

    if (this.phoneCode === this.phoneCodes.mobile.code)
      this.userForm.controls['phone'].setValidators([
        Validators.required,
        Validators.minLength(this.phoneCodes.mobile.lengthRule),
        Validators.maxLength(this.phoneCodes.mobile.lengthRule),
      ]);
    else
      this.userForm.controls['phone'].setValidators([
        Validators.required,
        Validators.minLength(this.phoneCodes.landline.lengthRule),
        Validators.maxLength(this.phoneCodes.landline.lengthRule),
      ]);

    this.userForm.get('phone')?.updateValueAndValidity();
  }
}
