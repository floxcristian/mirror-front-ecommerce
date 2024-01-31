import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidator } from '../../validations/password';
import { IError } from '@core/models-v2/error/error.interface';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthApiService } from '@core/services-v2/auth/auth.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss'],
})
export class PasswordModalComponent implements OnInit {
  @Input() modalPasswordRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<any>();
  formPassword: FormGroup;
  estadoInput = [
    { tipo: 'password', icono: 'fas fa-eye-slash' },
    { tipo: 'password', icono: 'fas fa-eye-slash' },
    { tipo: 'password', icono: 'fas fa-eye-slash' },
  ];
  verActual = 'password';
  verNuevo = 'password';
  verRepetido = 'password';
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authService: AuthApiService
  ) {
    this.formPassword = this.fb.group(
      {
        password: [, [Validators.required, Validators.minLength(6)]],
        pwd: [, [Validators.required, Validators.minLength(6)]],
        confirmPwd: [, [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: PasswordValidator.validate.bind(this),
      }
    );
  }

  ngOnInit() {}

  async cambiarPassword() {
    let data = this.formPassword.value;

    const user = this.sessionStorage.get();
    const request = {
      documentId: user?.documentId ?? '',
      username: user?.username ?? '',
      currentPassword: data.password,
      newPassword: data.pwd,
    };

    this.authService.updatePassword(request).subscribe({
      next: (_) => {
        this.modalPasswordRef.hide();
        this.toastr.success('Contraseña actualizada con éxito');
      },
      error: (err: IError) => {
        this.toastr.error(err.message);
      },
    });
  }

  cambiarEstado(input: any) {
    input.tipo == 'password'
      ? (input.tipo = 'text')
      : (input.tipo = 'password');
    input.icono == 'fas fa-eye-slash'
      ? (input.icono = 'fas fa-eye')
      : (input.icono = 'fas fa-eye-slash');
  }
}
