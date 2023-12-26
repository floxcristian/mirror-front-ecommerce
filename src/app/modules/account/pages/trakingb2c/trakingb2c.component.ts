// Angular
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
// Libs
import { ToastrService } from 'ngx-toastr';
// Services
import { OmsService } from '@core/services-v2/oms.service';
import {
  IOrder,
  IProduct,
  ITracking,
} from '@core/models-v2/oms/order.interface';

@Component({
  selector: 'app-trakingb2c',
  templateUrl: './trakingb2c.component.html',
  styleUrls: ['./trakingb2c.component.scss'],
})
export class Trakingb2cComponent implements OnInit {
  formBuscar: FormGroup;
  innerWidth: number;
  OVEstados: ITracking[] = [];
  @Input() OV: string = '';
  loadingShippingAll: boolean = false;

  DetalleOV: any = {};
  detalle!: IOrder;
  suma = 0;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    //Services v2
    private readonly omsService: OmsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.formBuscar = this.fb.group({
      orden: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.OV.length) {
      this.buscarOrden(this.OV);
      this.formBuscar.setValue({ orden: this.OV });
    }
  }

  async buscarOrden(value: any) {
    this.OVEstados = [];
    let OV = '';
    if (value.orden !== undefined) OV = value.orden.trim();
    else OV = value.trim();

    if (OV.split('OV-').length == 1) {
      OV = `OV-${OV}`;
    }

    if (OV.length > 0) {
      this.OV = OV;
      this.loadingShippingAll = true;

      this.omsService.getOrderDetailAndSummary(this.OV).subscribe({
        next: (res) => {
          this.detalle = res;
          this.OVEstados = res.tracking;
          this.DetalleOV = res.shipping.shippingCode;
          this.suma = 0;
          this.detalle.products.forEach((r: IProduct) => {
            this.suma = this.suma + r.total;
          });
          this.loadingShippingAll = false;
        },
        error: (err) => {
          console.log(err);
          this.loadingShippingAll = false;
          this.toast.info(
            'No se ha encontrado datos de seguimiento para el número de orden ingresado.'
          );
        },
      });
    } else {
      this.toast.success('Debe ingresar un número de orden valido.');
    }
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    window.scrollTo({ top: 0 });
  }
}
