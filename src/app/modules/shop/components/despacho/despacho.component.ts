// Angular
import { Component, OnInit, Input } from '@angular/core';
// Libs
import { BsModalService } from 'ngx-bootstrap/modal';
// Models
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
// Modals
import { ModalDeliveryComponent } from './components/modal-delivery/modal-delivery.component';
import { ModalPickupComponent } from './components/modal-pickup/modal-pickup.component';
import { ModalPickupTodayComponent } from './components/modal-pickup-today/modal-pickup-today.component';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() product!: IArticle;
  @Input() selectedStore!: ISelectedStore;
  @Input() cantidad: number = 0;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

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

  /**
   * Abrir modal con fechas de disponibilidad de retiro en tienda para hoy.
   */
  openPickupTodayModal(): void {
    this.modalService.show(ModalPickupTodayComponent, {
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
