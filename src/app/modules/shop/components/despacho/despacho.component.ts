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
import { MpSimuladorHeaderFiltrosMagicos } from './magic-filters/mp-simulador-header.filtros-magicos';
import { LogisticPromiseApiService } from '@core/services-v2/logistic-promise/logistic-promise.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { ModalDeliveryComponent } from './components/modal-delivery/modal-delivery.component';
import { ModalPickupComponent } from './components/modal-pickup/modal-pickup.component';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() product!: IArticle;
  @Input() selectedStore!: ISelectedStore;
  @Input() cantidad: number = 0;

  MODOS = { RETIRO_TIENDA: 'pickup', DESPACHO: 'delivery' };
  filtrosMagicosRetiroTienda: any;
  filtrosRetiroTienda: any = {};
  loadPromesas: boolean = false;
  modalRef!: BsModalRef;
  promesas: any = [];
  modo: string = this.MODOS.DESPACHO;
  stockMax: number = 0;

  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    // V2
    private logisticPromiseService: LogisticPromiseApiService,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
    console.log('[x] product: ', this.product);
    console.log('[x] selectedStore: ', this.selectedStore);
    console.log('[x] cantidad: ', this.cantidad);
  }

  private async generateChangeGeneralData(): Promise<void> {
    let data: any;
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

      if (consulta.data) {
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
    }

    if (data.codTienda) {
      this.promesa(data.codTienda);
    } else this.promesas = [];
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

  onFiltrosCambiadosRetiroTienda(filtros: any): void {
    this.filtrosRetiroTienda = filtros;
    this.generateChangeGeneralData();
  }

  Close(): void {
    this.modalRef.hide();
    this.promesas = [];
  }

  /**
   * Abre modal de despacho, retiro en tienda o retira hoy.
   * @param template
   * @param modo
   */
  openModal(template: TemplateRef<any>, modo: any): void {
    console.log('openForm...');
    this.modo = modo;
    this.filtrosMagicosRetiroTienda = MpSimuladorHeaderFiltrosMagicos(
      this.MODOS.RETIRO_TIENDA,
      this.geolocationApiService,
      this.selectedStore
    );
    this.modalRef = this.modalService.show(template, {
      class: 'modal-despacho modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
    });
  }

  /**
   * Abrir modal con fechas de disponibilidad de despacho a domicilio.
   */
  openDeliveryModal(): void {
    this.modalService.show(ModalDeliveryComponent, {
      class: 'modal-despacho modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        productSku: this.product.sku,
        productQuantity: this.cantidad,
      },
    });
  }

  /**
   * Abrir modal con fechas de disponibilidad de retiro en tienda.
   */
  openPickupModal(): void {
    this.modalService.show(ModalPickupComponent, {
      class: 'modal-despacho modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        selectedStore: this.selectedStore,
        productSku: this.product.sku,
        productQuantity: this.cantidad,
      },
    });
  }
}
