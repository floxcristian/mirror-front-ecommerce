import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modaluser',
  templateUrl: './modaluser.component.html',
  styleUrls: ['./modaluser.component.scss'],
})
export class ModaluserComponent implements OnInit {
  formUsuario!: FormGroup;
  editUser: Boolean = false;
  users: any = null;
  user_raiz: any = [];
  modalRef!: BsModalRef;
  @ViewChild('template_usuario', { static: false })
  modalUsuario!: TemplateRef<any>;
  @ViewChild('template_crearusuario', { static: false })
  modalCrearUsuario!: TemplateRef<any>;
  @ViewChild('template_eliminarusuario', { static: false })
  modalEliminarUsuario!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.formUser();
    this.userService.templateRead$.subscribe((r: any) => {
      this.users = r.data;
      this.users.user_role = 'comprador';
      this.user_raiz = r.raiz;
      this.editUser = r.edit;

      if (r.edit) this.openModalEditar();
      else if (!r.edit && !r.delete) {
        this.openModalCrear();
      } else if (r.delete) {
        this.openModalDelete();
      }
      this.formEditar();
    });
  }

  formUser() {
    this.formUsuario = this.fb.group({
      active: [false, Validators.required],
      username: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      method_payment: ['OC', Validators.required],
      user_role: 'comprador',
    });

    this.editUser = false;
  }

  formEditar() {
    this.formUsuario.controls['active'].setValue(this.users.active);
    this.formUsuario.controls['username'].setValue(this.users.username);
    this.formUsuario.controls['first_name'].setValue(this.users.first_name);
    this.formUsuario.controls['last_name'].setValue(this.users.last_name);
    this.formUsuario.controls['email'].setValue(this.users.email);
    this.formUsuario.controls['phone'].setValue(this.users.phone);
    this.formUsuario.controls['password'].setValue(this.users.password);
    this.formUsuario.controls['user_role'].setValue(this.users.user_role);
  }

  openModalCrear() {
    this.formUsuario.controls['active'].setValue(true);
    this.modalRef = this.modalService.show(this.modalCrearUsuario, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  openModalEditar() {
    console.log(this.users.active);
    this.modalRef = this.modalService.show(this.modalUsuario, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  openModalDelete() {
    this.modalRef = this.modalService.show(this.modalEliminarUsuario, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  Close() {
    this.modalRef.hide();
  }

  async onSubmit(data: any) {
    let id = this.users._id;
    data.company = this.user_raiz.company;
    data.rut = this.user_raiz.rut;
    data.giro = this.user_raiz.giro;
    data.tipo_usuario = 1;
    if (this.editUser) {
      await this.userService.Update(id, data).toPromise();
      this.modalRef.hide();
      this.userService.LoadData();
    } else if (!this.editUser) {
      await this.userService.insertar(data).toPromise();
      this.modalRef.hide();
      this.userService.LoadData();
    }
  }

  async Eliminar(data: any) {
    await this.userService.Eliminar(data._id).toPromise();
    this.modalRef.hide();
    this.userService.LoadData();
  }
}
