// Angular
import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
// Libs
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// Models
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
// Services
import { MpSimuladorHeaderFiltrosMagicos } from './mp-simulador-header.filtros-magicos';
import { LogisticPromiseService } from '@core/services-v2/logistic-promise.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() product!: IArticle;
  @Input() tiendaActual!: ISelectedStore;
  @Input() cantidad: number = 0;

  tiendaSeleccionada: any = [];

  MODOS = { RETIRO_TIENDA: 'pickup', DESPACHO: 'delivery' };
  filtrosMagicosRetiroTienda: any;
  filtrosMagicosDespacho: any;
  filtrosDespacho: any = null;
  filtrosRetiroTienda: any = {};
  loadPromesas: boolean = false;
  modalRef!: BsModalRef;
  promesas: any = [];
  modo: string = this.MODOS.DESPACHO;
  stockMax: any = 0;

  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    // V2
    private logisticPromiseService: LogisticPromiseService,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
    console.log('[-] product: ', this.product);
    console.log('[-] tiendaActual: ', this.tiendaActual);
    console.log('[-] cantidad: ', this.cantidad);
  }

  private async generateChangeGeneralData(): Promise<void> {
    let data: any;
    console.log(
      '🚀 ~ file: despacho.component.ts:63 ~ DespachoComponent ~ generateChangeGeneralData ~ this.modo:',
      this.modo
    );
    console.log(
      '🚀 ~ file: despacho.component.ts:63 ~ DespachoComponent ~ generateChangeGeneralData ~ this.MODOS.RETIRO_TIENDA:',
      this.MODOS.RETIRO_TIENDA
    );
    if (this.modo === this.MODOS.RETIRO_TIENDA) {
      this.loadPromesas = true;
      data = {
        modo: this.modo,
        codTienda: this.filtrosRetiroTienda.tienda
          ? this.filtrosRetiroTienda.tienda.codigo
          : '',
      };

      let productos = [
        {
          sku: this.product.sku,
          quantity: this.cantidad,
        },
      ];

      if (this.filtrosRetiroTienda.tienda.nombre) {
        if (
          this.filtrosRetiroTienda.tienda.nombre.split('TIENDA ')[1] !==
          undefined
        ) {
          this.filtrosRetiroTienda.tienda.nombre =
            this.filtrosRetiroTienda.tienda.nombre.split('TIENDA ')[1];
        }
      }

      let consulta: any = await this.logisticPromiseService
        .getLogisticPromise(
          this.MODOS.RETIRO_TIENDA,
          this.filtrosRetiroTienda.tienda,
          productos
        )
        .toPromise();

      if (consulta.data != null) {
        let item = consulta.data.bodegas;
        let max = 0;
        consulta.data.bodegasCandidatas.forEach((bodega: any) => {
          if (item[bodega].stock !== undefined) {
            if (max < item[bodega].stock[this.product.sku])
              max = item[bodega].stock[this.product.sku];
            this.stockMax = max;
          }
        });
      }

      this.loadPromesas = false;
    } else if (this.modo === this.MODOS.DESPACHO) {
      data = {
        modo: this.modo,
        codTienda: this.filtrosDespacho.localidad
          ? this.filtrosDespacho.localidad.nombre
          : '',
      };
    }

    if (data.codTienda != '') this.promesa(data.codTienda);
    else this.promesas = [];
  }

  private async promesa(codTienda: any): Promise<void> {
    this.loadPromesas = true;
    this.promesas = [];
    let productos = [
      {
        sku: this.product.sku,
        quantity: this.cantidad,
      },
    ];

    let consulta: any = await this.logisticPromiseService
      .getLogisticPromise(this.modo, codTienda, productos)
      .toPromise();

    if (consulta.data != null)
      this.promesas = consulta.data.respuesta[0].subOrdenes[0].fletes;
    this.loadPromesas = false;
  }

  onFiltrosCambiadosDespacho(filtros: any): void {
    this.filtrosDespacho = filtros;
    if (this.filtrosDespacho.localidad != null) {
      this.generateChangeGeneralData();
    } else this.filtrosDespacho = null;
  }
  /// FIXME: fix, no funciona bien
  openModal(template: TemplateRef<any>, modo: any): void {
    console.log('openForm...');
    this.modo = modo;
    this.filtrosMagicosRetiroTienda = MpSimuladorHeaderFiltrosMagicos(
      this.MODOS.RETIRO_TIENDA,
      this.geolocationApiService,
      this.tiendaActual
    );
    this.filtrosMagicosDespacho = MpSimuladorHeaderFiltrosMagicos(
      this.MODOS.DESPACHO,
      this.geolocationApiService,
      this.tiendaActual
    );
    this.modalRef = this.modalService.show(template, {
      class: 'modal-despacho modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onFiltrosCambiadosRetiroTienda(filtros: any): void {
    this.filtrosRetiroTienda = filtros;
    this.generateChangeGeneralData();
  }

  Close(): void {
    this.modalRef.hide();
    this.promesas = [];
  }
}
