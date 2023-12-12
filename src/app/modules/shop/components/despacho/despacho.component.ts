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
// Services
import { PromesaService } from '../../services/promesa.service';
import { MpSimuladorHeaderFiltrosMagicos } from './mp-simulador-header.filtros-magicos';
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() product!: IArticle;
  @Input() tiendaActual: any = [];
  @Input() cantidad: number = 0;

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
  stockMax: any = 0;
  localidad: any = [];

  constructor(
    private promesaService: PromesaService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
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
          image: this.product.images['150'],
          nombre: this.product.name,
          cantidad: this.cantidad,
          // peso: this.product.peso,
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
        image: this.product.images['150'],
        nombre: this.product.name,
        cantidad: this.cantidad,
        // peso: this.product.peso,
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

  Close(): void {
    this.modalRef.hide();
    this.promesas = [];
  }
}
