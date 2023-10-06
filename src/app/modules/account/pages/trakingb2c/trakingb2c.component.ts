import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TrackingStep } from '../../../../shared/interfaces/tracking';
import { CartService } from '../../../../shared/services/cart.service';
import { TrackingService } from '../../../../shared/services/tracking.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-trakingb2c',
  templateUrl: './trakingb2c.component.html',
  styleUrls: ['./trakingb2c.component.scss'],
})
export class Trakingb2cComponent implements OnInit {
  formBuscar: FormGroup;
  innerWidth: number;
  OVEstados: TrackingStep[] = [];
  @Input() OV: string = '';
  loadingShippingAll: boolean = false;

  EstadoOV: any = [];
  DetalleOV: any = {};
  productos: any = [];
  detalle: any;
  suma = 0;
  constructor(
    private fb: FormBuilder,
    private _TrackingService: TrackingService,
    private toast: ToastrService,
    private cart: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.formBuscar = this.fb.group({
      orden: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    if (this.OV.length > 0) {
      this.buscarOrden(this.OV);
      this.formBuscar.setValue({ orden: this.OV });
    }
  }

  async buscarOrden(value: any) {
    //reiniciando variables
    this.OVEstados = [];
    let OV = '';
    if (value.orden !== undefined) OV = value.orden.trim();
    else OV = value.trim();

    //fin de reinicio

    if (OV.split('OV-').length == 1) {
      OV = `OV-${OV}`;
    }

    if (OV.length > 0) {
      this.OV = OV;
      this.loadingShippingAll = true;
      let consulta: any = await this._TrackingService
        .buscarEstadosOV(OV)
        .toPromise();
      if (consulta != null) {
        this.detalle = consulta;
        this.OVEstados = consulta.estados;
        this.DetalleOV = consulta.ModoEntrega;
        await this.detalles_productos();
        this.loadingShippingAll = false;
      } else {
        this.loadingShippingAll = false;
        this.toast.info(
          'No se ha encontrado datos de seguimiento para el número de orden ingresado.'
        );
      }
    } else {
      this.toast.success('Debe ingresar un número de orden valido.');
    }
  }

  async detalles_productos() {
    let consulta = await this._TrackingService.DetalleOV(this.OV).toPromise();

    this.productos = consulta.data;
    this.suma = 0;
    this.productos.forEach((r: any) => {
      this.suma = this.suma + parseInt(r.total);
    });
  }

  onPageChange(pageNumber: any): void {
    window.scrollTo({ top: 0 });
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    window.scrollTo({ top: 0 });
  }
}
