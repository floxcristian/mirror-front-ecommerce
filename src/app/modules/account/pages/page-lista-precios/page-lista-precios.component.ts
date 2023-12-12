import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { environment } from '@env/environment';
import { RootService } from '../../../../shared/services/root.service';
import { SessionService } from '@core/states-v2/session.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}
@Component({
  selector: 'app-page-lista-precios',
  templateUrl: './page-lista-precios.component.html',
  styleUrls: ['./page-lista-precios.component.scss'],
})
export class PageListaPreciosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  innerWidth: number;
  precios!: any[];
  loadingData = true;
  paginaActual = 1;
  totalPaginas!: number;
  preciosPorPagina = 20;
  iva = true;
  categoria = null;

  dtOptions: DataTables.Settings = {};

  showLoading = true;
  IVA = 0.19;

  private localizacion$: Subject<any> = new Subject();
  readonly localizacionObs$: Observable<any> =
    this.localizacion$.asObservable();

  constructor(
    private httpClient: HttpClient,
    public root: RootService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.innerWidth = window.innerWidth;
    // cambio de sucursal
    this.geolocationService.selectedStore$.subscribe({
      next: () => {
        console.log(
          'selectedStore$ desde [PageListaPreciosComponent]===================='
        );
        this.reDraw();
        this.buscarPrecios();
      },
    });
  }

  ngOnInit() {
    if (this.innerWidth >= 1200) {
      this.paginaActual = null || 0;
      this.preciosPorPagina = null || 0;
    }
    this.buscarPrecios();
  }

  reDraw(): void {}

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  izquierda() {
    if (this.showLoading) {
      return;
    }
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.buscarPrecios();
    }
  }

  derecha() {
    if (this.showLoading) {
      return;
    }
    if (this.paginaActual <= this.totalPaginas) {
      this.paginaActual++;
      this.buscarPrecios();
    }
  }

  async buscarPrecios() {
    this.showLoading = true;
    console.log('getSelectedStore desde buscarPrecios');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();

    const user = this.sessionService.getSession();
    let parametros: any = {
      rut: user.documentId,
      sucursal: tiendaSeleccionada.code,
    };

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
        this.loadingData = true;
        parametros.data_sort =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        parametros.data_order = dataTablesParameters.order[0].dir;
        if (this.categoria) {
          parametros.categoria = this.categoria;
        } else parametros.categoria = null;
        let params = Object.assign(dataTablesParameters, parametros);
        let url = environment.apiCustomer + 'listaPreciosPorRut';
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
          .subscribe(async (resp: any) => {
            this.precios = resp.data;
            this.precios = await Promise.all(
              this.precios.map((p) => {
                if (p._id.precio > p.precioMeson) p._id.precio = p.precioMeson;
                p['_id']['precioBruto'] = Math.round(
                  p._id.precio / (1 + this.IVA)
                );
                p['precioMesonBruto'] = Math.round(
                  p.precioMeson / (1 + this.IVA)
                );
                return { ...p };
              })
            );
            this.showLoading = false;
            this.loadingData = false;
            callback({
              recordsTotal: resp.totalRegistros,
              recordsFiltered: resp.totalRegistros,
              data: [],
            });
          });
      },
    };
  }

  busquedaCategoria(event: any) {
    this.categoria = event;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
}
