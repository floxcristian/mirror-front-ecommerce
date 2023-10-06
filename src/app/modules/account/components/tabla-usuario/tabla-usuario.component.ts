import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../service/users.service';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-tabla-usuario',
  templateUrl: './tabla-usuario.component.html',
  styleUrls: ['./tabla-usuario.component.scss'],
})
export class TablaUsuarioComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  loadingData = false;
  users: any = [];
  editUser = false;
  @Input() userSession: any;
  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.loadData();
    this.userService.loadDataRead$.subscribe((resp) => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    });
  }

  loadData() {
    let user: any = {
      rut: this.userSession.rut,
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

      serverSide: true,
      responsive: true,
      searching: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      },

      ajax: (dataTablesParameters: any, callback) => {
        user.data_sort =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        user.data_order = dataTablesParameters.order[0].dir;
        this.users = [];
        let params = Object.assign(dataTablesParameters, user);
        let url = environment.apiImplementosClientes + `getusuario`;
        let username: String = 'services';
        let password: String = '0.=j3D2ss1.w29-';
        let authdata = window.btoa(username + ':' + password);
        let head = {
          Authorization: `Basic ${authdata}`,
          'Access-Control-Allow-Headers':
            'Authorization, Access-Control-Allow-Headers',
        };
        let headers = new HttpHeaders(head);
        this.httpClient
          .post<DataTablesResponse>(url, params, { headers: headers })
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
        { title: 'Nombre', data: 'first_name', width: '10%' },
        { title: 'Apellido', data: 'last_name', width: '10%' },
        { title: 'Telefono', data: 'phone', width: '10%' },
        { title: 'Email', data: 'email', width: '10%' },
        { title: 'Rol', data: 'user_role', width: '10%' },
        { title: 'Activo', data: '_id', width: '10%' },
        { title: 'Acciones', data: '_id', width: '10%' },
      ],
    };
  }

  Editar(item: any) {
    let json = {
      data: item,
      delete: false,
      edit: true,
      raiz: this.userSession,
    };

    this.userService.activarModal(json);
  }

  Eliminar(item: any) {
    let json = {
      data: item,
      delete: true,
      edit: false,
      raiz: this.userSession,
    };
    this.userService.activarModal(json);
  }
}
