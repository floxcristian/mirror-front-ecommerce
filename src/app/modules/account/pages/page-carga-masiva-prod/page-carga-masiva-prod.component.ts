import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  calculaIcono,
  filetoBase64,
  isVacio,
} from '../../../../shared/utils/utilidades';
import { CartData } from '../../../../shared/interfaces/cart-item';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { CartService } from '../../../../shared/services/cart.service';
import { v1 as uuidv1 } from 'uuid';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
declare var $: any;

export interface Archivo {
  archivo: File;
  nombre: string;
  icon: string;
  extension: string;
}

@Component({
  selector: 'app-page-carga-masiva-prod',
  templateUrl: './page-carga-masiva-prod.component.html',
  styleUrls: ['./page-carga-masiva-prod.component.scss'],
})
export class PageCargaMasivaProdComponent implements OnInit {
  archivo!: Archivo | undefined;

  userSession!: ISession;
  cartSession!: CartData;

  productosCargados: any[] = [];
  productosNoCargados: any[] = [];
  productosNoDisponibles: any[] = [];
  carroGuardado: any;
  OC: any;
  total = 0;

  procesando = false;
  procesado = false;
  alertClass!: string;
  mensaje!: string;
  isExcel = false;
  totalesDistintos = false;
  idArchivo!: string;

  isVacio = isVacio;

  constructor(
    private cartService: CartService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    // ServicesV2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    this.idArchivo = uuidv1();
  }

  onFileChange(event: any) {
    const files = event.target?.files as FileList;
    if (files?.length) {
      const partes = files[0].name.split('.');
      const extension = partes[partes.length - 1];
      const aux: Archivo = {
        archivo: files[0],
        nombre: files[0].name,
        icon: calculaIcono(extension),
        extension,
      };

      this.archivo = aux;
      $('#' + this.idArchivo).val(null);
    }
  }

  eliminaArchivo() {
    this.archivo = undefined;
    this.isExcel = false;
  }

  async uploadFile() {
    if (this.procesando) {
      return;
    }
    if (!this.extensionValida(this.archivo?.extension)) {
      this.toast.error('Debe seleccionar un archivo Excel o PDF.');
      return;
    }

    this.userSession = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.cartSession = this.localS.get('carroCompraB2B');

    const data = {
      file: this.archivo?.archivo,
      usuario: this.userSession.hasOwnProperty('username')
        ? this.userSession.username
        : this.userSession.email,
      rut: this.userSession.documentId,
      accion: 'guardar',
    };

    this.procesando = true;
    this.procesado = false;
    if (this.isExcel) {
      this.cartService.uploadExcel(data).subscribe(
        async (resp: ResponseApi) => {
          await this.procesaRespuesta(resp);
        },
        (e) => {
          this.alertClass = 'alert alert-danger';
          this.mensaje = 'Ha ocurrido un error al conectarse al servidor';
          this.procesando = false;
          this.procesado = true;
        }
      );
    } else {
      this.cartService.uploadOC(data).subscribe(
        async (resp: ResponseApi) => {
          await this.procesaRespuesta(resp);
        },
        (e) => {
          this.alertClass = 'alert alert-danger';
          this.mensaje = 'Ha ocurrido un error al conectarse al servidor';
          this.procesando = false;
          this.procesado = true;
        }
      );
    }
  }

  extensionValida(extension: any) {
    if (
      extension.toLowerCase() === 'xls' ||
      extension.toLowerCase() === 'xlsx'
    ) {
      this.isExcel = true;
      return true;
    } else if (extension.toLowerCase() === 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  async procesaRespuesta(r: any) {
    if (r.error) {
      this.alertClass = 'alert alert-danger';
      this.mensaje =
        r.errorDetalle === 'Error: limite'
          ? 'Ha llegado al límite de 17 artículos en el carro.'
          : r.msg;
      this.procesando = false;
      this.procesado = true;
      return;
    }

    this.productosCargados = r.data.productos;
    this.productosNoCargados = r['productosNoEncontrados'];
    this.carroGuardado = r['carroGuardado'];
    this.OC = r['OC'];
    this.total = this.productosCargados.reduce(
      (acum: any, prod: any) => acum + prod.precio * prod.cantidad,
      0
    );

    /* Se guarda datos de OC en localStorage junto con PDF */
    if (!this.isExcel) {
      const obj = {
        pdf: await filetoBase64(this.archivo?.archivo),
        nombre: this.archivo?.nombre,
        numero: this.OC.orden_compra,
        total: this.OC.total,
      };
      this.localS.set('ordenCompraCargada', obj);
      if (this.total != this.OC.total) {
        this.totalesDistintos = true;
      }
    }

    /*  Se validan totales */
    /* Se filtran los productos no disponibles */
    this.productosNoDisponibles = this.productosCargados.filter(
      (p) => !p.entregas.despacho && !p.entregas.retiroTienda
    );
    // const aux = this.productosCargados;
    // this.productosNoDisponibles = this.productosCargados.filter((p, i) => {
    //     if (!p.entregas.despacho && !p.entregas.retiroTienda) {
    //         this.productosCargados.splice(i, 1);
    //         return p;
    //     }
    // });

    if (
      this.productosCargados.length > 0 &&
      this.productosNoCargados.length === 0
    ) {
      this.alertClass = 'alert alert-success';
      this.mensaje = 'Se cargaron todos los productos correctamente.';
    }

    if (
      this.productosCargados.length > 0 &&
      this.productosNoCargados.length > 0
    ) {
      this.alertClass = 'alert alert-warning';
      this.mensaje = `Se cargaron ${this.productosCargados.length} de ${
        this.productosCargados.length + this.productosNoCargados.length
      } productos.`;
    }

    if (
      this.productosCargados.length === 0 &&
      this.productosNoCargados.length > 0
    ) {
      this.alertClass = 'alert alert-danger';
      this.mensaje = 'No se cargó ningún producto.';
    }

    this.cartService.load();
    this.procesando = false;
    this.procesado = true;
  }
}
