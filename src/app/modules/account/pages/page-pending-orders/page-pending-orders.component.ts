import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { DataTablesResponse } from '../../../../shared/interfaces/data-table';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-page-pending-orders',
  templateUrl: './page-pending-orders.component.html',
  styleUrls: ['./page-pending-orders.component.scss'],
})
export class PagePendingOrdersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  usuario!: ISession;
  orders!: any[];
  urlDonwloadOC = environment.apiShoppingCart + 'getoc?id=';
  viewActive = 'list';
  orderId = null;
  title: string = '';

  constructor(
    private http: HttpClient,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    if (!this.usuario.hasOwnProperty('username'))
      this.usuario.username = this.usuario.email;
  }

  loadData() {
    const that = this;
    const columns = [
      'modificacion',
      'estado',
      'numero',
      'totalOv',
      'folio',
      'montoOcCliente',
      'usuario',
    ];
    let username: String = 'services';
    let password: String = '0.=j3D2ss1.w29-';
    let authdata = window.btoa(username + ':' + password);
    let head = {
      Authorization: `Basic ${authdata}`,
      'Access-Control-Allow-Headers':
        'Authorization, Access-Control-Allow-Headers',
    };
    let headers = new HttpHeaders(head);
    this.dtOptions = {
      language: {
        // url: 'assets/js/datatable/Spanish.json'
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      order: [[0, 'desc']],
      columnDefs: [{ orderable: false, targets: 7 }],
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.usuario = this.usuario.username;
        dataTablesParameters.estado = ['finalizado', 'generado'];
        dataTablesParameters.sortColumn =
          columns[dataTablesParameters.order[0].column];
        dataTablesParameters.sortDir = dataTablesParameters.order[0].dir;
        dataTablesParameters.tipo = 2;

        that.http
          .post<DataTablesResponse>(
            environment.apiShoppingCart + 'listadoPedidos',
            dataTablesParameters,
            { headers: headers }
          )
          .subscribe((resp) => {
            that.orders = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  viewOrderDetail(item: any) {
    this.viewActive = 'detail';
    this.orderId = item._id;
    this.title = item.numero;
  }

  backToList() {
    this.viewActive = 'list';
  }
}
