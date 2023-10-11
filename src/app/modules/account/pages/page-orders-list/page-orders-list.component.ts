import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { isPlatformBrowser } from '@angular/common';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-page-orders-list',
  templateUrl: './page-orders-list.component.html',
  styleUrls: ['./page-orders-list.component.scss'],
})
export class PageOrdersListComponent implements OnInit {
  usuario: Usuario;
  loadingData = true;
  rows: any[] = [];
  datatableElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  innerWidth: any;

  constructor(
    private root: RootService,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.usuario = this.root.getDataSesionUsuario();
    this.loadingData = false;
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.construir_tabla();
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  async construir_tabla() {
    let user: any = {
      rut: this.usuario.rut,
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 50, 100],
        [10, 50, 100],
      ],
      serverSide: true,

      responsive: true,
      searching: true,
      order: [[3, 'desc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
        processing: 'Cargando Ordenes de ventas..',
      },

      ajax: (dataTablesParameters: any, callback: any) => {
        //datos set de ordenamiento//
        this.loadingData = true;

        user.data_sort =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        user.data_order = dataTablesParameters.order[0].dir;
        this.rows = [];
        let params = Object.assign(dataTablesParameters, user);
        let url = environment.apiCustomer + 'ventas';
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
            this.rows = resp.data;

            this.loadingData = false;
            callback({
              recordsTotal: resp.totalRegistros[0].count,
              recordsFiltered: resp.totalRegistros[0].count,
              data: [],
            });
          });
      },
      columns: [
        { data: 'ordenVenta', width: '15%' },
        { data: 'ordenCompra' },
        { data: 'documento', width: '15%' },
        { data: 'fecha' },
        { data: 'sucursal' },
        { data: 'vendedor' },
        { data: 'neto' },
        { data: 'iva' },
        { data: 'total' },
      ],
    };
  }
}
