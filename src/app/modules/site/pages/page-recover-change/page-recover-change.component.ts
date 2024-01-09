// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// Libs
import { ToastrService } from 'ngx-toastr';
// Services
import { CustomerService } from '@core/services-v2/customer.service';
import { AuthApiService } from '@core/services-v2/auth/auth.service';

@Component({
  selector: 'app-recovering',
  templateUrl: './page-recover-change.component.html',
  styleUrls: ['./page-recover-change.component.scss'],
})
export class PageRecoveringChangeComponent {
  clientId!: string;
  email!: string | null;
  formChangepass!: FormGroup;
  isValidEmail!: boolean;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly customerService: CustomerService,
    private readonly authService: AuthApiService
  ) {}

  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'];
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.checkIsValidEmail(this.email);
    this.buildForm();
  }

  checkIsValidEmail(email: string | null): void {
    if (!email) return;
    this.customerService.checkEmail(email).subscribe({
      next: ({ exists }) => (this.isValidEmail = exists),
    });
  }

  buildForm(): void {
    this.formChangepass = this.fb.group({
      clientId: [this.clientId],
      pwd1: ['', Validators.required],
      pwd2: ['', Validators.required],
    });
  }

  changePass(data: any): void {
    if (!this.email) return;
    var pwd1 = data.pwd1;
    var pwd2 = data.pwd2;
    if (this.formChangepass.valid) {
      if (pwd1 !== pwd2) {
        this.toastr.warning('Las contraseñas ingresadas deben ser iguales.');
      } else if (pwd1.length < 6) {
        this.toastr.warning(
          'La contraseña debe tener un largo mínimo de 6 caracteres.'
        );
      } else if (!/\d/.test(pwd1)) {
        this.toastr.warning('La contraseña debe contener al menos un número.');
      } else {
        data['password'] = pwd1;
        data['recoverId'] = this.clientId;
        this.authService
          .recoverPassword({
            id: this.clientId,
            email: this.email,
            password: pwd1,
          })
          .subscribe({
            next: () => {
              this.toastr.success(
                `La contraseña ha sido actualizada correctamente.`
              );
              this.router.navigate(['/sitio', 'iniciar-sesion']);
            },
            error: (err) => {
              console.error(err);
              this.toastr.error(
                `Ha ocurrido un error al actualizar la contraseña.`
              );
            },
          });
      }
    } else {
      this.toastr.warning('Ingrese ambas contraseñas');
    }
  }
}
