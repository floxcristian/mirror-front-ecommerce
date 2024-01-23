import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { calculaIcono, isVacio } from '../../../../shared/utils/utilidades';
import { CartData } from '../../../../shared/interfaces/cart-item';
import { v1 as uuidv1 } from 'uuid';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
// Import V2
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { CartService } from '@core/services-v2/cart.service';
import {
  ISavedCart,
  IUploadResponse,
} from '@core/models-v2/responses/file-upload.response';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

// declare var $: any;

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
  isCollapsed = false;
  productosCargados: any[] = [];
  productosNoCargados: any[] = [];
  productosNoDisponibles: any[] = [];
  carroGuardado!: ISavedCart;
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private renderer:Renderer2,
    @Inject(DOCUMENT) private document:Document,
    // ServicesV2
    private readonly sessionService: SessionService,
    private readonly cartService: CartService,
    private readonly geolocationServiceV2: GeolocationServiceV2
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
      if (isPlatformBrowser(this.platformId)) {
        // $('#' + this.idArchivo).val(null);
        const inputElement = this.document.getElementById(this.idArchivo) as HTMLInputElement;
        this.renderer.setProperty(inputElement, 'value', null);
      }
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
    if (!this.isValidExtension(this.archivo!.extension)) {
      this.toast.error('Debe seleccionar un archivo Excel');
      return;
    }

    this.userSession = this.sessionService.getSession();
    this.cartSession = this.localS.get('carroCompraB2B');
    const selectedStore = this.geolocationServiceV2.getSelectedStore();

    const data = {
      username: this.userSession.username ?? this.userSession.email,
      branch: selectedStore.code,
      documentId: this.userSession.documentId,
      action: 'save', // Action (guardar,save or eliminar,delete)
      file: this.archivo?.archivo,
    };

    this.procesando = true;
    this.procesado = false;

    this.cartService.uploadExcel(data).subscribe({
      next: async (resp: IUploadResponse) => {
        await this.procesaRespuesta(resp);
      },
      error: (e) => {
        this.alertClass = 'alert alert-danger';
        this.mensaje = 'Ha ocurrido un error al conectarse al servidor';
        this.procesando = false;
        this.procesado = true;
      },
    });
  }

  isValidExtension(extension: string) {
    return (
      extension.toLowerCase() === 'xls' || extension.toLowerCase() === 'xlsx'
    );
  }

  async procesaRespuesta(response: IUploadResponse) {
    this.productosCargados = response.data.products;
    this.productosNoCargados = response.productsNotFound;
    this.carroGuardado = response.savedCart;

    this.productosNoDisponibles = response.data.products.filter((prod) => {
      return !prod.delivery.homeDelivery && !prod.delivery.pickup;
    });

    this.total = this.productosCargados.reduce(
      (acum: any, prod: any) => acum + prod.price * prod.quantity,
      0
    );

    if (
      this.productosCargados.length > 0 &&
      this.productosNoCargados.length === 0
    ) {
      this.alertClass = 'alert alert-success';
      this.mensaje = 'Se cargaron todos los productos correctamente.';
    } else if (
      this.productosCargados.length > 0 &&
      this.productosNoCargados.length > 0
    ) {
      this.alertClass = 'alert alert-warning';
      this.mensaje = `Se cargaron ${this.productosCargados.length} de ${
        this.productosCargados.length + this.productosNoCargados.length
      } productos.`;
    } else if (
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
