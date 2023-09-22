import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  TemplateRef,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import {
  Product,
  AtributosEspeciales,
  ProductOrigen,
} from '../../interfaces/product';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { isPlatformBrowser } from '@angular/common';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { PhotoSwipeService } from '../../services/photo-swipe.service';
import { DirectionService } from '../../services/direction.service';
import { Subscription } from 'rxjs';

import { RootService } from '../../services/root.service';
import { ToastrService } from 'ngx-toastr';
import { QuickviewService } from '../../services/quickview.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '../../services/products.service';
import { ResponseApi } from '../../../shared/interfaces/response-api';

import { ActivatedRoute, Router } from '@angular/router';
import { GeoLocationService } from '../../services/geo-location.service';
import { GeoLocation } from '../../interfaces/geo-location';
import { Usuario } from '../../interfaces/login';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ArticuloFavorito, Lista } from '../../interfaces/articuloFavorito';
import { ClientsService } from '../../services/clients.service';
import {
  DataWishListModal,
  WishListModalComponent,
} from '../wish-list-modal/wish-list-modal.component';
import { isVacio } from '../../utils/utilidades';
import { environment } from '../../../../environments/environment';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { PromesaService } from '../../../modules/shop/services/promesa.service';
import { AvisoStockComponent } from '../aviso-stock/aviso-stock.component';
import { CapitalizeFirstPipe } from '../../pipes/capitalize.pipe';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
declare let dataLayer: any;
interface ProductImage {
  id: string;
  url: string;
  active: boolean;
  video?: boolean;
  urlThumbs?: string;
}

export type Layout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  //codigo de slide vertical
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  innerWidth: number;
  @ViewChild('myCarousel', { static: false }) myCarousel!: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
    slide: 1,
    interval: { timing: 4000, initialDelay: 1000 },
    load: 3,
    loop: true,
    vertical: {
      enabled: true,
      height: 380,
    },
    point: {
      visible: true,
      hideOnSingleSlide: true,
    },
  };

  carouselItems: any[any] = [1, 2, 3];
  mainItems: any[] = [...this.carouselItems];
  cantidadFaltantePrecioEscala!: number;

  private dataProduct!: Product & { url?: SafeUrl; gimage?: SafeUrl };
  private dataLayout: Layout = 'standard';

  showGallery = true;
  showGalleryTimeout!: number;
  atributosEspeciales!: AtributosEspeciales[];
  imageFichaCargada = false;
  quality: any;
  disponibilidad = false;
  estado = true;
  products: Product[] = [];
  videos!: any[];
  sinStockSuficienteDespacho!: boolean;
  sinStockSuficienteTiendaActual!: boolean;
  sinStockOtrasTiendas!: boolean;
  sinStockProgramados!: boolean;

  // Promesas
  addButtonMovilPromise!: Subscription;
  geoLocationServicePromise: Subscription;

  routerPromise: Subscription;
  photoSwipePromise!: Subscription;
  addcartPromise!: Subscription;
  comparePromise!: Subscription;
  wishlistPromise!: Subscription;

  favorito = false;
  listasEnQueExiste: Lista[] = [];
  listaPredeterminada!: Lista | undefined;

  usuario: Usuario;
  isB2B: boolean;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;

  /* PROVISORIO */
  skusChevron = ['CHVLMT0003', 'CHVLMT0001', 'CHVLMT0004'];
  isChevron!: boolean;
  /*****************/

  @ViewChild('featuredCarousel', { read: CarouselComponent, static: false })
  featuredCarousel!: CarouselComponent;
  // @ViewChild('thumbnailsCarousel', { read: CarouselComponent, static: false }) thumbnailsCarousel: CarouselComponent;
  @ViewChildren('imageElement', { read: ElementRef })
  imageElements!: QueryList<ElementRef>;
  @ViewChild('modalStock', { read: TemplateRef, static: false })
  modalTemplateStock!: TemplateRef<any>;
  @ViewChild('modalEscala', { static: false }) modalEscala!: TemplateRef<any>;
  modalEscalaRef!: BsModalRef;
  modalRefStock!: BsModalRef;
  @Input() stock!: boolean;
  @Input() origen!: string[];
  @Input() recommendedProducts!: Array<any>;
  preciosEscalas: any[] = [];
  @Output() comentarioGuardado: EventEmitter<boolean> = new EventEmitter();
  @Output() leerComentarios: EventEmitter<boolean> = new EventEmitter();
  @Input() set layout(value: Layout) {
    this.dataLayout = value;

    if (isPlatformBrowser(this.platformId)) {
      // this dirty hack is needed to re-initialize the gallery after changing the layout
      clearTimeout(this.showGalleryTimeout);
      this.showGallery = false;
      this.showGalleryTimeout = window.setTimeout(() => {
        this.showGallery = true;
      }, 0);
    }
  }
  get layout(): Layout {
    return this.dataLayout;
  }

  @Input() set product(value: Product | undefined) {
    if (typeof value === 'undefined') {
      return;
    }
    /** PROVISORIO */
    this.isChevron = this.skusChevron.includes(value.sku);
    /***************/
    this.getPopularProducts(value.sku);
    this.getDisponibilidad(value.sku);
    this.comprobarStock(value.sku, this.tiendaActual, value);
    this.quantity.setValue(1);
    this.imageFichaCargada = false;
    this.images = [];
    this.videos = [];

    if (value) {
      this.dataProduct = value;
      this.dataProduct.nombre = this.dataProduct.nombre.replace(/("|')/g, '');
      this.formatImageSlider(value);
    }
    this.quality = this.root.setQuality(value);
    this.root.limpiaAtributos(value);

    for (const i in this.dataProduct.atributos) {
      if (this.dataProduct.atributos[i].nombre == 'VIDEO') {
        this.videos.push({
          ...this.dataProduct.atributos[i],
          thumb:
            'https://i.ytimg.com/vi/' +
            this.dataProduct.atributos[i].valor.split('/embed')[1] +
            '/1.jpg',
        });
      }
    }

    const url: string = this.root.product(
      this.dataProduct.sku,
      this.dataProduct.nombre,
      false
    );
    const gimage: string =
      'https://images.implementos.cl/img/watermarked/' +
      this.dataProduct.sku +
      '-watermarked.jpg';

    this.dataProduct.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.dataProduct.gimage =
      this.sanitizer.bypassSecurityTrustResourceUrl(gimage);

    // filtramos los atributos
    this.atributosEspeciales = [
      {
        texto: 'Garantia del producto',
        icono: 'fas fa-book',
        url: '#',
      },
      {
        texto: 'Certificado del producto',
        icono: 'far fa-file-pdf',
        url: '#',
      },
    ];
  }

  get product(): Product {
    return this.dataProduct;
  }

  images: ProductImage[] = [];
  imagesThumbs: ProductImage[] = [];

  carouselOptions: Partial<OwlCarouselOConfig> = {
    autoplay: false,
    dots: true,
    loop: true,
    responsive: {
      0: { items: 1 },
    },
    rtl: this.direction.isRTL(),
  };

  quantity: FormControl = new FormControl(1);

  addingToCart = false;
  addingToWishlist = false;
  addingToCompare = false;
  stockProgramado = false;
  disponibilidadSku: any;
  headerLayout!: string;

  today = Date.now();
  stockMax = 0;
  tiendaActual: any;
  stockTiendaActual: any = 0;
  MODOS = { RETIRO_TIENDA: 'retiroTienda', DESPACHO: 'domicilio' };
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cart: CartService,
    private wishlist: WishlistService,
    private compare: CompareService,
    private photoSwipe: PhotoSwipeService,
    private direction: DirectionService,
    public root: RootService,
    public toast: ToastrService,
    private quickService: QuickviewService,
    private modalService: BsModalService,
    private productsService: ProductsService,
    public router: Router,
    public route: ActivatedRoute,
    public geoLocationService: GeoLocationService,
    private promesaService: PromesaService,
    private capitalize: CapitalizeFirstPipe,
    private localS: LocalStorageService,
    public sanitizer: DomSanitizer,
    private clientsService: ClientsService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = this.root.getDataSesionUsuario();
    this.isB2B =
      this.usuario.user_role === 'supervisor' ||
      this.usuario.user_role === 'comprador';
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    // cambio de sucursal
    this.geoLocationServicePromise =
      this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
        this.estado = true;
        this.tiendaActual = this.geoLocationService.getTiendaSeleccionada();
        this.Actualizar();
        this.getPopularProducts(this.dataProduct.sku);
        this.comprobarStock(
          this.dataProduct.sku,
          this.tiendaActual,
          this.dataProduct
        );
      });
    this.routerPromise = this.route.data.subscribe(
      (data) => (this.headerLayout = data['headerLayout'])
    );
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
  }

  async ngOnInit() {
    this.tiendaActual = this.geoLocationService.getTiendaSeleccionada();
    if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
      this.photoSwipePromise = this.photoSwipe.load().subscribe();
    }
    if (
      this.usuario.user_role !== 'supervisor' &&
      this.usuario.user_role !== 'comprador'
    ) {
      dataLayer.push({
        event: 'productView',
        pagePath: window.location.href,
      });
    }
    // Observable cuyo fin es saber cuando se presiona el boton agregar al carro utilizado para los dispositivos moviles.
    this.addButtonMovilPromise = this.cart.onAddingmovilButton$.subscribe(
      () => {
        this.addToCart();
      }
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!isVacio(this.product)) {
      await this.obtienePrecioEscala();
      this.refreshListasEnQueExiste();
    }
  }

  ngOnDestroy() {
    // dejamos de observar la observable cuando nos salimos de la pagina del producto.
    this.addButtonMovilPromise ? this.addButtonMovilPromise.unsubscribe() : '';
    this.geoLocationServicePromise
      ? this.geoLocationServicePromise.unsubscribe()
      : '';
    this.routerPromise ? this.routerPromise.unsubscribe() : '';
    this.photoSwipePromise ? this.photoSwipePromise.unsubscribe() : '';
    this.addcartPromise ? this.addcartPromise.unsubscribe() : '';
    this.comparePromise ? this.comparePromise.unsubscribe() : '';
    this.wishlistPromise ? this.wishlistPromise.unsubscribe() : '';
  }

  async Actualizar() {
    await this.obtienePrecioEscala();
  }
  carouselTileLoad(data: any) {
    const arr = this.carouselItems;
    this.carouselItems = [...this.carouselItems, ...this.mainItems];
  }

  getPopularProducts(sku: any) {
    const params: any = {
      sku,
    };
    const usuario = this.root.getDataSesionUsuario();
    if (usuario.rut) {
      params['rut'] = usuario.rut;
    }

    this.estado = false;
  }
  cargaPrecio(producto: any) {
    this.cart.cargarPrecioEnProducto(producto);
  }

  getDisponibilidad(sku: any) {
    this.productsService.getdisponibilidadSku(sku).subscribe((r: any) => {
      this.disponibilidadSku = r;
      if (
        !this.disponibilidadSku.despacho &&
        !this.disponibilidadSku.retiroTienda
      ) {
        this.disponibilidad = false;
      } else {
        this.disponibilidad = true;
      }
    });
  }

  setActiveImage(image: ProductImage): void {
    //console.log(image);
    this.images.forEach(
      (eachImage) => (eachImage.active = eachImage === image)
    );
  }

  featuredCarouselTranslated(event: SlidesOutputData): void {
    if (event.slides?.length) {
      const activeImageId = event.slides[0].id;
      this.images.forEach(
        (eachImage) => (eachImage.active = eachImage.id === activeImageId)
      );
    }
  }

  /**
   * @author Cristobal Burgos 09-02-2021
   * @description Comprueba que el stock ingresado por el usuario sea menor , igual o mayor al stock disponible
   * para asi mostrar ir validando que pueda ingresar la cantidad seleccioanda a su carro o mostrar un mensaje y desactivar
   * los checks de conflictos de entrega
   * DESPACHO -> se considera el CD que tenga más Stock
   * RETIRO EN OTRAS TIENDAS -> se considera la tienda con mas stock excluyendo los CDs
   * RETIRO EN LA TIENDA SELECCIONADA -> Se considera el stock de la tienda que tiene seleccionada en el nav.
   * @param sku
   * @param tienda
   */
  async comprobarStock(sku: any, tienda: any, product: any): Promise<void> {
    this.stockProgramado = true;
    this.stockTiendaActual = 0;
    return;
  }

  async updateCart(cantidad: any) {
    this.quantity.setValue(cantidad);
    const usuario: Usuario = this.localS.get('usuario');
    let rut: string | undefined = '0';

    if (usuario != null) {
      rut = usuario.rut;
    }

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    this.comprobarStock(this.product.sku, tiendaSeleccionada, this.product);

    const parametrosPrecios = {
      sku: this.product.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut,
      cantidad,
    };

    const datos: any = await this.cart
      .getPriceProduct(parametrosPrecios)
      .toPromise();
    this.cantidadFaltantePrecioEscala = 0;
    if (datos['precio_escala']) {
      this.product.precioComun = !isVacio(usuario.iva)
        ? usuario.iva
          ? datos['precioComun']
          : datos['precioComun'] / (1 + this.IVA)
        : datos['precioComun'];
      this.product.precio.precio = !isVacio(usuario.iva)
        ? usuario.iva
          ? datos['precio'].precio
          : datos['precio'].precio / (1 + this.IVA)
        : datos['precio'].precio;

      // pinta de rojo los precios escala
      this.preciosEscalas = this.preciosEscalas.map((p, i) => {
        if (i === 1) {
          this.cantidadFaltantePrecioEscala =
            p.desde - (cantidad ? parseInt(cantidad) : 0);
        }
        if (p.precio === this.product.precio.precio) {
          p.marcado = true;
        } else {
          p.marcado = false;
        }
        return p;
      });
    }
  }
  addToCart(): void {
    const usuario = this.root.getDataSesionUsuario();

    if (usuario == null) {
      this.toast.warning(
        'Debe iniciar sesion para poder comprar',
        'Información'
      );
      return;
    }

    if (!this.addingToCart && this.product && this.quantity.value > 0) {
      this.product.origen = {} as ProductOrigen;

      if (this.origen) {
        this.product.origen.origen = this.origen[0] ? this.origen[0] : '';
        this.product.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
        this.product.origen.seccion = this.origen[2] ? this.origen[2] : '';
        this.product.origen.recomendado = this.origen[3] ? this.origen[3] : '';
        this.product.origen.ficha = true;
        this.product.origen.cyber = this.product.cyber ? this.product.cyber : 0;
      }

      this.addingToCart = true;

      this.addcartPromise = this.cart
        .add(this.product, this.quantity.value)
        .subscribe(
          (r) => {},
          (e) => {
            this.toast.warning(
              'Ha ocurrido un error en el proceso',
              'Información'
            );
            this.addingToCart = false;
          },
          () => {
            this.addingToCart = false;
          }
        );
    }
  }

  async addToWishlist() {
    if (this.favorito) {
      // saca SKU de todas las listas en que existe
      const resp: ResponseApi = (await this.clientsService
        .deleteTodosArticulosFavoritos(this.product.sku, this.usuario.rut || '')
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

      if (resp.data.length) {
        if (resp.data[0].listas.length > 0) {
          listas = resp.data[0].listas;

          const listaPredeterminada: Lista | undefined = listas.find(
            (l) => l.predeterminada
          );
          // agregamos SKU a lista predeterminada
          const resp1: ResponseApi = (await this.clientsService
            .setArticulosFavoritos(
              this.product.sku,
              this.usuario.rut || '',
              listaPredeterminada?._id || ''
            )
            .toPromise()) as ResponseApi;
          if (!resp1.error) {
            // se agrega sku en la lista del LocalStorage
            await this.clientsService.cargaFavoritosLocalStorage(
              this.usuario.rut || ''
            );

            this.refreshListasEnQueExiste();
            this.toast.success(
              `Se agregó a la lista: ${listaPredeterminada?.nombre}`
            );
          }

          this.favorito = true;
          this.cd.markForCheck();
          this.listaPredeterminada = listaPredeterminada;
          return;
        }
      }

      const initialState: DataWishListModal = {
        producto: this.product,
        listas: [],
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
  }

  async addToWishlistOptions() {
    let listas: Lista[] = [];
    const resp: ResponseApi = (await this.clientsService
      .getListaArticulosFavoritos(this.usuario.rut || '')
      .toPromise()) as ResponseApi;
    if (resp.data.length) {
      if (resp.data[0].listas.length) {
        listas = resp.data[0].listas;
      }
    }

    const initialState: DataWishListModal = {
      producto: this.product,
      listas,
      listasEnQueExiste: this.listasEnQueExiste,
    };
    const modal: BsModalRef = this.modalService.show(WishListModalComponent, {
      initialState,
      class: 'modal-sm2 modal-dialog-centered',
    });
    modal.content.event.subscribe((res: any) => {
      this.refreshListasEnQueExiste();
      this.favorito = res;
      this.cd.markForCheck();
    });
  }

  refreshListasEnQueExiste() {
    this.listasEnQueExiste = [];
    const favoritos: ArticuloFavorito = this.localS.get('favoritos');
    if (!isVacio(favoritos)) {
      favoritos.listas.forEach((lista) => {
        if (!isVacio(lista.skus.find((sku) => sku === this.product.sku))) {
          this.favorito = true;
          this.listasEnQueExiste.push(lista);
        }
      });
    }
    this.cd.markForCheck();
  }

  addToCompare(): void {
    if (!this.addingToCompare && this.product) {
      this.addingToCompare = true;

      this.comparePromise = this.compare
        .add(this.product)
        .subscribe({ complete: () => (this.addingToCompare = false) });
    }
  }

  openPhotoSwipe(event: MouseEvent, image: ProductImage): void {
    if (this.layout !== 'quickview') {
      event.preventDefault();

      const images = this.images.map((eachImage) => {
        return {
          src: eachImage.url,
          msrc: eachImage.url,
          w: 700,
          h: 700,
        };
      });
      const options = {
        getThumbBoundsFn: (index: any) => {
          const imageElement =
            this.imageElements.toArray()[index].nativeElement;
          const pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          const rect = imageElement.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        index: this.images.indexOf(image),
        bgOpacity: 0.9,
        history: false,
      };

      this.photoSwipe.open(images, options).subscribe((galleryRef) => {
        galleryRef.listen('beforeChange', () => {
          this.featuredCarousel.to(
            this.images[galleryRef.getCurrentIndex()].id
          );
        });
      });
    }
  }

  onLoadImage() {
    this.imageFichaCargada = true;
  }

  formatImageSlider(product: any) {
    let index = 0;
    let image1000 = null;
    let image150 = null;
    if (typeof product.images === 'undefined') {
      return;
    }
    if (product.images.length <= 0) {
      image1000 = '../../../assets/images/products/no-image-listado-2.jpg';
      image150 = '../../../assets/images/products/no-image-listado-2.jpg';
      const image = {
        id: product.sku.toString() + '_' + index++,
        url: this.root.returnUrlNoImagen(),
        active: index === 1 ? true : false,
      };

      this.images.push(image);
    } else {
      // image1000='../../../assets/images/products/no-image-listado-2.jpg';
      //image150='../../../assets/images/products/no-image-listado-2.jpg';
      if (
        product.images[0]['1000'].length == 0 ||
        product.images[0]['150'].length == 0
      ) {
        image1000 = '../../../assets/images/products/no-image-listado-2.jpg';
        image150 = '../../../assets/images/products/no-image-listado-2.jpg';
        const image = {
          id: product.sku.toString() + '_' + index++,
          url: this.root.returnUrlNoImagen(),
          active: index === 1 ? true : false,
        };

        this.images.push(image);
      } else {
        image1000 = product.images[0]['1000'];
        image150 = product.images[0]['150'];

        this.images = [];
        this.imagesThumbs = [];

        let key = 0;
        for (const item of image1000) {
          const image = {
            id: product.sku.toString() + '_' + index++,
            url: item,
            urlThumbs: image150[key],
            active: index === 1 ? true : false,
            video: false,
          };

          this.images.push(image);
          key++;
        }
        let thumbVideo = '';
        let urlVideo = '';
        for (const i in product.atributos) {
          if (product.atributos[i].nombre == 'VIDEO') {
            (thumbVideo =
              'https://i.ytimg.com/vi' +
              product.atributos[i].valor.split('/embed')[1] +
              '/1.jpg'),
              (urlVideo = product.atributos[i].valor);

            const image = {
              id: product.sku.toString() + '_' + index++,
              url: urlVideo,
              urlThumbs: thumbVideo,
              active: index === 1 ? true : false,
              video: true,
            };
            this.images.push(image);
            key++;
          }
        }
      }
    }

    this.carouselItems = this.images;
    this.mainItems = [...this.carouselItems];
  }

  showStock() {
    this.modalRefStock = this.modalService.show(
      this.modalTemplateStock,
      Object.assign({}, { class: 'modal-xl' })
    );
  }

  async obtienePrecioEscala() {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    const params = {
      sucursal: tiendaSeleccionada?.codigo,
      sku: this.product.sku,
      rut: this.usuario.rut,
    };
    const resp: any = await this.cart.getPriceScale(params).toPromise();
    this.preciosEscalas = resp.data.map((p: any) => {
      return { ...p, marcado: false };
    });

    if (!isVacio(this.product.precio)) {
      this.preciosEscalas.unshift({
        desde: 0,
        hasta: 0,
        precio: this.product.precio.precio,
        marcado: true,
      });
    }
  }

  verPreciosEscala() {
    this.modalEscalaRef = this.modalService.show(this.modalEscala, {
      class: 'modal-dialog-centered',
    });
  }

  OpenAvisoStock() {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const modalAviso = this.modalService.show(AvisoStockComponent, {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        sku: this.product.sku,
        producto: this.product,
        sucursal: tiendaSeleccionada?.codigo,
        usuario: this.usuario,
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
}
