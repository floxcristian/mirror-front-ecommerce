import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';
import { DataTableDirective } from 'angular-datatables';
import { SessionService } from '@core/states-v2/session.service';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}
@Component({
  selector: 'app-page-tracking-ov',
  templateUrl: './page-tracking-ov.component.html',
  styleUrls: ['./page-tracking-ov.component.scss'],
})
export class PageTrackingOvComponent implements OnInit {
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  n_Ov = '';
  persons: any = [];
  pagelength = 10;
  loadData = false;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(
    private httpClient: HttpClient,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.resultado_busqueda();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {}

  async resultado_busqueda() {
    this.loadData = true;
    const usuario = this.sessionService.getSession();
    let user: any = {
      rut: usuario.documentId,
    };

    //utilizacion de dtOption para filtrar datos/
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 15, 20],
        [10, 15, 20],
      ],
      serverSide: true,
      responsive: true,
      searching: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
        processing: 'Cargando Ordenes de ventas..',
      },

      ajax: (dataTablesParameters: any, callback) => {
        //datos set de ordenamiento//
        this.loadData = true;
        user.data_sort =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        console.log(
          '🚀 ~ file: page-tracking-ov.component.ts:71 ~ PageTrackingOvComponent ~ resultado_busqueda ~ user.data_sort:',
          user.data_sort
        );
        user.data_order = dataTablesParameters.order[0].dir;
        this.persons = [];
        let params = Object.assign(dataTablesParameters, user);
        console.log(
          '🚀 ~ file: page-tracking-ov.component.ts:81 ~ PageTrackingOvComponent ~ resultado_busqueda ~ dataTablesParameters:',
          dataTablesParameters
        );
        let url = environment.apiOms + 'oms/clienteOv';
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
          .subscribe((resp: any) => {
            this.persons = resp.data;

            this.persons.map((r: any) => {
              r.expanded = false;
            });
            this.loadData = false;
            callback({
              recordsTotal: resp.largo[0].count,
              recordsFiltered: resp.largo[0].count,
              data: [],
            });
          });
      },
      columns: [
        { data: 'OrdenSeguimiento', width: '15%' },
        { data: 'OrdenCompra' },
        { data: 'EstadoActual', width: '15%' },
        { data: 'TiendaDestino' },
        { data: 'ModoEntrega', width: '15%' },
        { data: 'MontoNeto' },
        { data: 'FechaCompromisoCliente' },
      ],
    };
  }

  buscarOv(item: any) {
    if (item.expanded == true) item.expanded = false;
    else item.expanded = true;
  }
}
