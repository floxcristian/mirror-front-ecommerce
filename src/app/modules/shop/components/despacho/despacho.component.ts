import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { PromesaService } from '../../services/promesa.service';
import { MpSimuladorHeaderFiltrosMagicos } from './mp-simulador-header.filtros-magicos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() product!: any;
  @Input() tiendaActual: any = [];
  tiendaSeleccionada: any = [];
  stock: any = 0;
  stock_bodega: any = 0;
  MODOS = { RETIRO_TIENDA: 'retiroTienda', DESPACHO: 'domicilio' };
  filtrosMagicosRetiroTienda: any;
  filtrosMagicosDespacho: any;
  filtrosDespacho: any = null;
  filtrosRetiroTienda: any = {};
  loadPromesas: boolean = false;
  encontrado: boolean = false;
  modalRef!: BsModalRef;
  consulta: any = [];
  promesas: any = [];
  modo: string = this.MODOS.DESPACHO;

  @Input() sinStockSuficienteDespacho: Boolean = false;
  @Input() sinStockSuficienteTiendaActual: Boolean = false;
  @Input() stockProgramado: Boolean = false;
  stockMax: any = 0;
  @Input() cantidad: any = 0;

  constructor(
    private productsService: ProductsService,
    private promesaService: PromesaService,
    private modalService: BsModalService,
    private geoLocationService: GeoLocationService,
    private cd: ChangeDetectorRef
  ) {}
  localidad: any = [];
  async ngOnInit() {
    await this.sinStockSuficienteTiendaActual;
    await this.sinStockSuficienteDespacho;
    await this.stockProgramado;

    this.cd.detectChanges();
  }

  async generateChangeGeneralData() {
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
          image: this.product.images['0']['150']['0'],
          nombre: this.product.nombre,
          cantidad: this.cantidad,
          peso: this.product.peso,
          esVentaVerde: false,
          proveedor: null,
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
      let consulta: any = await this.promesaService
        .getpromesa(
          this.MODOS.RETIRO_TIENDA,
          this.filtrosRetiroTienda.tienda.nombre,
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

  onFiltrosCambiadosDespacho(filtros: any) {
    this.filtrosDespacho = filtros;
    if (this.filtrosDespacho.localidad != null) {
      this.generateChangeGeneralData();
    } else this.filtrosDespacho = null;
  }

  openForm(template: TemplateRef<any>, modo: any) {
    this.modo = modo;
    this.filtrosMagicosRetiroTienda = MpSimuladorHeaderFiltrosMagicos(
      this.MODOS.RETIRO_TIENDA,
      this.promesaService,
      this.tiendaActual
    );
    this.filtrosMagicosDespacho = MpSimuladorHeaderFiltrosMagicos(
      this.MODOS.DESPACHO,
      this.promesaService,
      this.tiendaActual
    );
    this.modalRef = this.modalService.show(template, {
      class: 'modal-despacho modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
    });
  }

  async promesa(codTienda: any) {
    this.loadPromesas = true;
    this.promesas = [];
    let productos = [
      {
        sku: this.product.sku,
        image: this.product.images['0']['150']['0'],
        nombre: this.product.nombre,
        cantidad: this.cantidad,
        peso: this.product.peso,
        esVentaVerde: false,
        proveedor: null,
      },
    ];

    let consulta: any = await this.promesaService
      .getpromesa(this.modo, codTienda, productos)
      .toPromise();
    if (consulta.data != null)
      this.promesas = consulta.data.respuesta[0].subOrdenes[0].fletes;
    this.loadPromesas = false;
  }

  onFiltrosCambiadosRetiroTienda(filtros: any) {
    this.filtrosRetiroTienda = filtros;
    this.encontrado = false;
    this.generateChangeGeneralData();
  }

  cambiarTienda(tiendaTemporal: any) {
    const tienda = tiendaTemporal;
    const coord = {
      lat: tiendaTemporal.lat,
      lon: tiendaTemporal.lon,
    };

    return this.geoLocationService.cambiarTiendaCliente(coord, tienda);
  }

  Close() {
    this.modalRef.hide();
    this.promesas = [];
  }
}
