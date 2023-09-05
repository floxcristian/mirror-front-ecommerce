import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../services/clients.service';
import { PasswordValidator } from '../../validations/password';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit {
  @Input() modalPasswordRef!: BsModalRef;
  @Output() public respuesta = new EventEmitter<any>();
  formPassword: FormGroup;
  estadoInput = [
    { tipo: 'password', icono: 'fas fa-eye-slash' },
    { tipo: 'password', icono: 'fas fa-eye-slash' },
    { tipo: 'password', icono: 'fas fa-eye-slash' },

  ]
  verActual = 'password'
  verNuevo = 'password'
  verRepetido = 'password'
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localS: LocalStorageService,
    private clientsService: ClientsService
  ) {

    this.formPassword = this.fb.group({

      password: [, [Validators.required, Validators.minLength(6)]],
      pwd: [, [Validators.required, Validators.minLength(6)]],
      confirmPwd: [, [Validators.required, Validators.minLength(6)]],
    },
      {
        validator: PasswordValidator.validate.bind(this)
      }
    );

  }

  ngOnInit() {
  }
  async cambiarPassword() {
    let data = this.formPassword.value;

    let resp:any = await this.clientsService.changePassword(data);
    if(!resp.error){
        this.modalPasswordRef.hide();
        this.toastr.success(resp.msg);
    }else{
      this.toastr.error(resp.msg);

    }
  }

  cambiarEstado(input:any) {
    input.tipo == 'password' ? input.tipo = 'text' : input.tipo = 'password';
    input.icono == 'fas fa-eye-slash' ? input.icono = 'fas fa-eye' : input.icono = 'fas fa-eye-slash';

  }



}
