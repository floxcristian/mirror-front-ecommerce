import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Usuario } from '../../../../shared/interfaces/login';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { rutValidator } from '../../../../shared/utils/utilidades';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-page-usuarios',
  templateUrl: './page-usuarios.component.html',
  styleUrls: ['./page-usuarios.component.scss'],
})
export class PageUsuariosComponent implements OnInit {
  prueba = [];
  usuario: ISession;
  selectedUsuario!: Usuario | null;
  loadingData = true;
  users: any[] = [];
  modalRef!: BsModalRef;
  formUsuario!: FormGroup;
  editUser = false;
  dtOptions: DataTables.Settings = {};
  isDtInitialized: boolean = false;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  isValidRut!: boolean;

  constructor(
    private toastr: ToastrService,
    private clients: ClientsService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.usuario = this.sessionService.getSession();
    this.loadingData = true;
  }

  ngOnInit() {
    this.formUser();
    this.loadData();
  }

  loadData() {
    let user: any = {};
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      responsive: true,
      searching: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
        processing: 'Cargando Ordenes de ventas..',
      },

      ajax: (dataTablesParameters: any, callback) => {
        this.loadingData = true;
        user.data_sort =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        user.data_order = dataTablesParameters.order[0].dir;
        this.users = [];
        let params = Object.assign(dataTablesParameters, user);
        let username: String = 'services';
        let password: String = '0.=j3D2ss1.w29-';
        let authdata = window.btoa(username + ':' + password);
        let head = {
          Authorization: `Basic ${authdata}`,
          'Access-Control-Allow-Headers':
            'Authorization, Access-Control-Allow-Headers',
        };
        let headers = new HttpHeaders(head);
        console.log('params: ');
        this.httpClient
          .post<DataTablesResponse>(`${environment.apiCMS}users`, params, {
            headers,
          })
          .subscribe(
            (resp: any) => {
              this.users = resp.data;
              this.loadingData = false;
              callback({
                recordsTotal: resp.largo[0].count,
                recordsFiltered: resp.largo[0].count,
                data: [],
              });
            },
            (error) => {
              console.log(error);
              this.toastr.error('Error de conexión, para obtener usuarios');
              this.loadingData = false;
            }
          );
      },
      columns: [
        { title: 'Usuario', data: 'username', width: '10%' },
        { title: 'Empresa', data: 'company', width: '10%' },
        { title: 'Rut', data: 'rut', width: '10%' },
        { title: 'Nombre', data: 'first_name', width: '10%' },
        { title: 'Apellido', data: 'last_name', width: '10%' },
        { title: 'Rol', data: 'user_role', width: '10%' },
        { title: 'Activo', data: '_id', width: '10%' },
        { title: '', data: '_id', width: '10%' },
      ],
    };
  }

  validateCustomer(e: any) {
    let value = e.target.value;
    if (this.formUsuario.controls['rut'].status === 'VALID') {
      this.isValidRut = false;
    }
  }

  formUser() {
    this.formUsuario = this.fb.group({
      _id: [],
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
      first_name: '',
      last_name: '',
      company: '',
      rut: [, [Validators.required, rutValidator]],
      method_payment: ['OC', Validators.required],
      user_role: '',
    });
    this.selectedUsuario = null;
    this.editUser = false;
  }

  openUserForm(template: TemplateRef<any>, edit: any) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
    this.editUser = edit;
  }

  selectUser(user: any) {
    this.editUser = true;
    this.selectedUsuario = user;
    this.formUsuario.patchValue(user);
  }

  reloadWindow(): void {
    window.location.reload();
  }

  onSubmit(data: any) {
    let rutAux = this.formUsuario.controls['rut'].value;
    let existe = this.formUsuario.controls['rut'].value
      ? rutAux.indexOf('-')
      : null;

    if (existe == -1) {
      let dv = rutAux.substring(rutAux.length - 1, rutAux.length);
      rutAux = rutAux.substring(0, rutAux.length - 1);
      data.rut = `${rutAux}-${dv}`;
    }

    if (this.formUsuario.valid) {
      if (this.selectedUsuario) {
        data['id'] = data['_id'];

        this.clients.updateUsuario(data).subscribe(
          () => {
            this.toastr.success('Usuario actualizado exitosamente');
            this.modalRef.hide();
            this.formUser();

            this.loadData();
          },
          (error) => {
            this.toastr.error('Error de conexión, para crear usuarios');
            this.loadingData = false;
          }
        );
      } else {
        this.clients.crearUsuario(data).subscribe(
          () => {
            this.toastr.success('Usuario creado exitosamente');
            this.modalRef.hide();
            this.formUser();

            this.loadData();
          },
          (error) => {
            this.toastr.error('Error de conexión, para crear usuarios');
            this.loadingData = false;
          }
        );
      }
    }
  }
  closeModal() {
    this.modalRef.hide();
    this.formUsuario.reset();
  }

  changeMe(event: any) {}
}
