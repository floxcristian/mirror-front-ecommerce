// Angular
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Libs
import { ToastrService } from 'ngx-toastr';
// Services
import { AuthApiService } from '@core/services-v2/auth/auth.service';

@Component({
  selector: 'app-recovering',
  templateUrl: './page-recover.component.html',
  styleUrls: ['./page-recover.component.scss'],
})
export class PageRecoveringComponent {
  formRecoverPass!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private readonly authService: AuthApiService
  ) {
    this.buildFormRecoverPass();
  }

  private buildFormRecoverPass(): void {
    this.formRecoverPass = this.fb.group({
      email: ['', Validators.required],
    });
  }

  recoverPass(data: any): void {
    const { email } = data;
    this.authService.sendRecoverPasswordLink(email).subscribe({
      next: () => {
        this.toastr.success(`Link enviado exitosamente.`);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          `Ha ocurrido un error al enviar el link de recuperación de contraseña.`
        );
      },
    });
  }
}
