// Angular
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
// Services
import { TrackingService } from '../../../../shared/services/tracking.service';
// Libs
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// Components
import { Modal_reciboComponent } from '../../components/modal_recibo/modal_recibo/modal_recibo.component';
import { IProduct, Iorder } from '@core/models-v2/oms/order.interface';

@Component({
  selector: 'app-page-detalle-traking-ov',
  templateUrl: './page-detalle-traking-ov.component.html',
  styleUrls: ['./page-detalle-traking-ov.component.scss'],
})
export class DetalleTrakingOvComponent implements OnInit {
  @Input() Ov: string = '';
  @Input() detalle!: Iorder;
  estadoEnvio: any = [];
  recibo: any;
  productos: any = [];
  DetalleOV: any = {};
  suma: number = 0;

  servicio_despacho: any = [];
  entrega_despacho = {};
  nombre_servicio = '';
  OVEstados: any[] = [];
  loadingShippingAll: boolean;
  EstadoOV: any = [];
  bsModalRef?: BsModalRef;

  constructor(
    private _TrackingService: TrackingService,
    private modalService: BsModalService
  ) {
    this.loadingShippingAll = true;
  }

  async ngOnInit() {
    console.log('algoo...');
    this.buscar_detalle_estado();
  }

  async ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges...');
    this.loadingShippingAll = true;
    this.buscar_detalle_estado();
  }

  async buscar_detalle_estado() {
    // console.log('buscar_detalle_estado...');
    // let consulta: any = await this._TrackingService
    //   .DetalleOV(this.Ov)
    //   .toPromise();
    // this.productos = consulta.data;
    this.suma = 0;
    this.detalle.products.forEach((r: IProduct) => {
      this.suma = this.suma + r.total;
    });
    // FIXME
    this.OVEstados = this.detalle.tracking;
    if (this.OVEstados[0].status === 'received') {
      this.ver_recibo();
    }
  }

  async ver_recibo() {
    const consulta: any = await this._TrackingService
      .recibo(this.Ov)
      .toPromise();
    this.recibo = consulta.data[0];
  }

  OpenModal() {
    this.bsModalRef = this.modalService.show(Modal_reciboComponent, {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        data: this.recibo,
      },
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
