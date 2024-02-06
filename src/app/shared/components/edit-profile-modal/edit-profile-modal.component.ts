// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Services
import { SessionService } from '@core/services-v2/session/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IConfig } from '@core/config/config.interface';
// Libs
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '@core/services-v2/customer.service';
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent {
  @Input() modalEditRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<boolean>();

  formProfile!: FormGroup;
  session: ISession;
  config: IConfig;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.session = this.sessionService.getSession();
    this.buildForm(this.session);
  }

  private buildForm({ firstName, lastName, phone, email }: ISession): void {
    this.formProfile = this.fb.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      email: [email, [Validators.required]],
      phone: [
        phone,
        [Validators.required, Validators.pattern('[1-9][0-9]{0,9}')],
      ],
    });
  }

  updateProfile(): void {
    const { firstName, lastName, email, phone } = this.formProfile.value;

    this.customerService
      .updateProfile({
        documentId: this.session.documentId,
        firstName,
        lastName,
        email,
        phone,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Se actualizo con exito los datos');
          this.sessionStorage.set({
            ...this.session,
            firstName,
            lastName,
            phone,
            email,
          });
          this.respuesta.emit(true);
          this.modalEditRef.hide();
        },
        error: () => {
          this.toastr.error('No se logro actualizar el perfil');
          this.respuesta.emit(false);
        },
      });
  }
}
