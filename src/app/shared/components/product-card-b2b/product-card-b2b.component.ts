import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CartService } from '../../services/cart.service';
import {
  Product,
  ProductPrecio,
  ProductOrigen,
} from '../../interfaces/product';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { QuickviewService } from '../../services/quickview.service';
import { RootService } from '../../services/root.service';
import { CurrencyService } from '../../services/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
//import { LocalStorageService } from 'angular-2-local-storage';

import { Usuario } from '../../interfaces/login';
import { GeoLocationService } from '../../services/geo-location.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LogisticsService } from '../../services/logistics.service';
import { isVacio } from '../../utils/utilidades';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  DataWishListModal,
  WishListModalComponent,
} from '../wish-list-modal/wish-list-modal.component';
import { ClientsService } from '../../services/clients.service';
import { ResponseApi } from '../../interfaces/response-api';
import { ArticuloFavorito, Lista } from '../../interfaces/articuloFavorito';
import * as moment from 'moment';
import 'moment/min/locales';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-product-card-b2b',
  templateUrl: './product-card-b2b.component.html',
  styleUrls: ['./product-card-b2b.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardB2bComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  @Input() home: boolean = false;
  @Input() cartClass!: boolean;
  @Input() set product(value: Product) {
    this.productData = value;
    this.productData.nombre = this.root.limpiarNombres(
      this.productData.nombre
    );
    this.cargaPrecio();
    this.quality = this.root.setQuality(this.productData);
    this.root.limpiaAtributos(value);
  }

  @Input() layout:
    | 'grid-sm'
    | 'grid-nl'
    | 'grid-lg'
    | 'list'
    | 'horizontal'
    | null
    | any = null;
  @Input() grid!: any;
  @Input() paramsCategory!: any;
  @Input() origen!: string[];
  @Input() tipoOrigen: string = '';
  addingToCart = false;
  addingToWishlist = false;
  addingToCompare = false;
  showingQuickview = false;
  urlImage = environment.urlFotoOmnichannel;
  productData!: Product & { url?: SafeUrl; gimage?: SafeUrl };
  quality: any = 0;
  precioProducto = 0;
  today = Date.now();

  favorito = false;
  listasEnQueExiste: Lista[] = [];
  listaPredeterminada!: Lista;
  convertir: boolean = false;
  tomorrow = false;
  fecha!: string;
  usuario: Usuario;
  isB2B: boolean;
  isVacio = isVacio;

  IVA = environment.IVA || 0.19;
  exist: boolean = true;
  constructor(
    private cd: ChangeDetectorRef,
    public root: RootService,
    public cart: CartService,
    public wishlist: WishlistService,
    public compare: CompareService,
    public quickview: QuickviewService,
    public currency: CurrencyService,
    private localS: LocalStorageService,
    private geoLocationService: GeoLocationService,
    public sanitizer: DomSanitizer,
    private logistics: LogisticsService,
    private clientsService: ClientsService,
    private toast: ToastrService,
    private modalService: BsModalService
  ) {
    this.usuario = this.root.getDataSesionUsuario();
    this.isB2B = ['supervisor', 'comprador'].includes(
      this.usuario.user_role || ''
    );
  }

  ngOnInit(): void {
    this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck();
    });

    this.refreshListasEnQueExiste();
    this.dias_semana();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargaPrecio() {
    if (this.productData.precioComun === undefined) {
      this.productData.precioComun = this.productData.precio.precioComun;
      this.productData.precio_escala = this.productData.precio.precio_escala;
    }

    this.cd.markForCheck();

    let url: string = this.root.product(
      this.productData.sku,
      this.productData.nombre,
      false
    );
    let gimage: string =
      'https://images.implementos.cl/img/watermarked/' +
      this.productData.sku +
      '-watermarked.jpg';

    this.productData.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.productData.gimage =
      this.sanitizer.bypassSecurityTrustResourceUrl(gimage);

    this.calculaIVA(this.productData);
  }

  calculaIVA(producto: Product) {
    if (!isVacio(this.usuario.iva)) {
      if (!this.usuario.iva) {
        this.productData.precio.precio =
          producto.precio.precio / (1 + this.IVA);
        this.productData.precioComun =
          (producto.precioComun || 0) / (1 + this.IVA);
      }
    }
  }

  addToCart(): void {
    if (this.addingToCart) {
      return;
    }

    this.productData.origen = {} as ProductOrigen;

    if (this.origen) {
      // Seteamos el origen de donde se hizo click a add cart.
      this.productData.origen.origen = this.origen[0] ? this.origen[0] : '';
      this.productData.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
      this.productData.origen.seccion = this.origen[2] ? this.origen[2] : '';
      this.productData.origen.recomendado = this.origen[3]
        ? this.origen[3]
        : '';
      this.productData.origen.ficha = false;
      this.productData.origen.cyber = this.productData.cyber
        ? this.productData.cyber
        : 0;
    }

    this.addingToCart = true;
    this.cart.add(this.productData, 1).subscribe({
      complete: () => {
        this.addingToCart = false;
        this.cd.markForCheck();
      },
    });
  }

  async addToWishlist() {
    if (this.favorito) {
      // saca SKU de todas las listas en que existe
      const resp: ResponseApi = (await this.clientsService
        .deleteTodosArticulosFavoritos(
          this.productData.sku,
          this.usuario.rut || ''
        )
        .toPromise()) as ResponseApi;

      if (!resp.error) {
        this.favorito = false;
        this.cd.markForCheck();
        // se elimina sku de la lista en LocalStorage
        await this.clientsService.cargaFavoritosLocalStorage(
          this.usuario.rut || ''
        );
        this.refreshListasEnQueExiste();
        this.toast.success('Se eliminó de todas las listas');
      }
    } else {
      let listas: Lista[] = [];
      const resp: ResponseApi = (await this.clientsService
        .getListaArticulosFavoritos(this.usuario.rut || '')
        .toPromise()) as ResponseApi;

      if (resp.data.length > 0) {
        if (resp.data[0].listas.length > 0) {
          listas = resp.data[0].listas;

          const listaPredeterminada: Lista = listas.find(
            (l) => l.predeterminada
          ) as Lista;
          // agregamos SKU a lista predeterminada
          const resp1: ResponseApi = (await this.clientsService
            .setArticulosFavoritos(
              this.productData.sku,
              this.usuario.rut || '',
              listaPredeterminada._id
            )
            .toPromise()) as ResponseApi;
          if (!resp1.error) {
            // se agrega sku en la lista del LocalStorage
            await this.clientsService.cargaFavoritosLocalStorage(
              this.usuario.rut || ''
            );

            this.refreshListasEnQueExiste();
            this.toast.success(
              `Se agregó a la lista: ${listaPredeterminada.nombre}`
            );
          }

          this.favorito = true;
          this.cd.markForCheck();
          this.listaPredeterminada = listaPredeterminada;
          return;
        }
      }

      const initialState: DataWishListModal = {
        producto: this.productData,
        listas: [],
        listasEnQueExiste: this.listasEnQueExiste,
      };

      const modal: BsModalRef = this.modalService.show(
        WishListModalComponent,
        {
          initialState,
          class: 'modal-sm2 modal-dialog-centered',
          ignoreBackdropClick: true,
        }
      );
      modal.content.event.subscribe((res: any) => {
        this.refreshListasEnQueExiste();
        this.favorito = res;
        this.cd.markForCheck();
      });
    }
  }

  async addToWishlistOptions() {
    let listas: Lista[] = [];
    const resp: ResponseApi = (await this.clientsService
      .getListaArticulosFavoritos(this.usuario.rut || '')
      .toPromise()) as ResponseApi;
    if (resp.data.length > 0) {
      if (resp.data[0].listas.length > 0) {
        listas = resp.data[0].listas;
      }
    }

    const initialState: DataWishListModal = {
      producto: this.productData,
      listas,
      listasEnQueExiste: this.listasEnQueExiste,
    };
    const modal: BsModalRef = this.modalService.show(WishListModalComponent, {
      initialState,
      class: 'modal-sm2 modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modal.content.event.subscribe((res: any) => {
      this.refreshListasEnQueExiste();
      this.favorito = res;
      this.cd.markForCheck();
    });
  }

  refreshListasEnQueExiste() {
    this.listasEnQueExiste = [];
    const favoritos: ArticuloFavorito = this.localS.get('favoritos') as any;
    if (!isVacio(favoritos)) {
      favoritos.listas.forEach((lista) => {
        if (!isVacio(lista.skus.find((sku) => sku === this.productData.sku))) {
          this.favorito = true;
          this.listasEnQueExiste.push(lista);
        }
      });
    }
  }

  addToCompare(): void {
    if (this.addingToCompare) {
      return;
    }

    this.addingToCompare = true;
    this.compare.add(this.productData).subscribe({
      complete: () => {
        this.addingToCompare = false;
        this.cd.markForCheck();
      },
    });
  }

  showQuickview(): void {
    if (this.showingQuickview) {
      return;
    }

    this.showingQuickview = true;
    this.quickview.show(this.productData).subscribe({
      complete: () => {
        this.showingQuickview = false;
        this.cd.markForCheck();
      },
    });
  }

  dias_semana() {
    // const prueba = '2021-06-26T07:11:57.272Z';
    let actual = moment().format('W');
    let entrega = moment(this.productData.fechaEntrega).format('W');
    let date = this.productData.fechaEntrega;

    if (entrega == actual) {
      let tomorrow = moment().locale('es').add(1, 'd').format('D');
      let diaEntrega = moment(date).locale('es').format('D');

      if (diaEntrega == tomorrow) {
        this.fecha = 'mañana';
        this.tomorrow = true;
      } else {
        this.fecha = moment(date).locale('es').format('dddd');
        this.tomorrow = false;
      }
      this.convertir = true;
    } else {
      this.convertir = false;
      this.tomorrow = false;
    }
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
   * @desc metodo utilizado cuando se hace clic en el card, y antes de redireccionar a la ficha del prod, se guarda el origen en una variable de cart service
   * @params
   * @return
   */
  setOrigenBeforeFicha() {
    this.cart.setOrigenHistory(this.origen);
  }

  ErrorImage(event: any) {
    this.exist = false;
  }
}
