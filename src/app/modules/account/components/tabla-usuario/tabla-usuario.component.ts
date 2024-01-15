import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../service/users.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SubAccountService } from '@core/services-v2/sub-account.service';
import { IEcommerceUser } from '@core/models-v2/auth/user.interface';

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
  @Input() userSession!: ISession;
  dtOptions: DataTables.Settings = {};
  loadingData = false;
  users: IEcommerceUser[] = [];
  editUser = false;
  constructor(
    private toastr: ToastrService,
    private userService: UsersService,
    // Services V2
    private readonly subAccountService: SubAccountService
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
      rut: this.userSession.documentId,
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

        this.subAccountService
          .getSubAccounts({ documentId: user.rut })
          .subscribe({
            next: (resp) => {
              this.users = resp.data;

              this.loadingData = false;

              callback({
                recordsTotal: resp.total,
                recordsFiltered: resp.total,
                data: [],
              });
            },
            error: (err) => {
              console.log(err);
              this.toastr.error('Error de conexión, para obtener usuarios');
              this.loadingData = false;
            },
          });
      },
      columns: [
        { title: 'Usuario', data: 'username', width: '10%' },
        { title: 'Nombre', data: 'firstName', width: '10%' },
        { title: 'Apellido', data: 'lastName', width: '10%' },
        { title: 'Telefono', data: 'phone', width: '10%' },
        { title: 'Email', data: 'email', width: '10%' },
        { title: 'Rol', data: 'userRole', width: '10%' },
        { title: 'Activo', data: 'active', width: '10%' },
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
