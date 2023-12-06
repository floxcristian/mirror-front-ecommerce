// Angular
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
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
// Libs
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';

import { CartService } from '../../services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { PhotoSwipeService } from '../../services/photo-swipe.service';
import { DirectionService } from '../../services/direction.service';
import { Subscription } from 'rxjs';

import { RootService } from '../../services/root.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ResponseApi } from '../../../shared/interfaces/response-api';

import { GeoLocationService } from '../../services/geo-location.service';
import { GeoLocation } from '../../interfaces/geo-location';

import { ArticuloFavorito, Lista } from '../../interfaces/articuloFavorito';
import { ClientsService } from '../../services/clients.service';
import {
  DataWishListModal,
  WishListModalComponent,
} from '../wish-list-modal/wish-list-modal.component';
import { isVacio } from '../../utils/utilidades';
import { environment } from '@env/environment';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import {
  Attribute,
  IArticleResponse,
} from '@core/models-v2/article/article-response.interface';
import { IProductImage } from './image.interface';
import { InventoryService } from '@core/services-v2/inventory.service';
// Modals
import { ModalScalePriceComponent } from '../modal-scale-price/modal-scale-price.component';
import { IScalePriceItem } from './scale-price-item.interface';

export type Layout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('myCarousel', { static: false }) myCarousel!: NguCarousel<any>;
  //codigo de slide vertical
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  innerWidth: number;

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

  /**
   * Items para la imagen activa.
   */
  images: IProductImage[] = [];
  cantidadFaltantePrecioEscala!: number;

  private dataProduct!: IArticleResponse;
  private dataLayout: Layout = 'standard';

  showGallery = true;
  showGalleryTimeout!: number;

  quality: any;
  isAvailable!: boolean;
  estado = true; // isDesktop
  products: IArticleResponse[] = [];

  // Observables
  addButtonMovilPromise!: Subscription;
  geoLocationServicePromise!: Subscription;
  routerPromise: Subscription;
  photoSwipePromise!: Subscription;
  addcartPromise!: Subscription;
  wishlistPromise!: Subscription;

  favorito = false;
  listasEnQueExiste: Lista[] = [];
  listaPredeterminada!: Lista | undefined;

  usuario: ISession;
  isB2B: boolean;
  IVA = environment.IVA;
  isVacio = isVacio;

  @ViewChild('featuredCarousel', { read: CarouselComponent, static: false })
  featuredCarousel!: CarouselComponent;
  @ViewChildren('imageElement', { read: ElementRef })
  imageElements!: QueryList<ElementRef>;
  // Others
  preciosEscalas: IScalePriceItem[] = [];
  @Output() comentarioGuardado: EventEmitter<boolean> = new EventEmitter();
  @Output() leerComentarios: EventEmitter<boolean> = new EventEmitter();
  @Input() stock!: boolean;
  @Input() origen!: string[];
  @Input() recommendedProducts!: Array<any>;
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

  @Input() set product(value: IArticleResponse) {
    if (!value) return;
    // Eliminar?
    this.getPopularProducts();
    this.setAvailability(value);
    this.quantity.setValue(1);

    this.dataProduct = value;
    // this.dataProduct.name = this.dataProduct.name.replace(/("|')/g, '');
    this.formatImageSlider(value);
    this.quality = this.root.setQuality(value);
    this.root.limpiaAtributos(value);

    /*const url: string = this.root.product(
      this.dataProduct.sku,
      this.dataProduct.name,
      false
    );
    this.dataProduct.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);*/
  }

  get layout(): Layout {
    return this.dataLayout;
  }

  get product() {
    return this.dataProduct;
  }

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
  disponibilidadSku: any;
  headerLayout!: string;

  today = Date.now();
  stockMax = 0;
  tiendaActual: any;
  MODOS = { RETIRO_TIENDA: 'retiroTienda', DESPACHO: 'domicilio' };
  puntoQuiebre: number = 576;
  showMobile: boolean = false;
  formAvisoStock!: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cart: CartService,
    private photoSwipe: PhotoSwipeService,
    private direction: DirectionService,
    public root: RootService,
    public toast: ToastrService,
    private modalService: BsModalService,
    public router: Router,
    public route: ActivatedRoute,
    public geoLocationService: GeoLocationService,
    private localS: LocalStorageService,
    public sanitizer: DomSanitizer,
    private clientsService: ClientsService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly inventoryService: InventoryService
  ) {
    this.isB2B = this.sessionService.isB2B();
    this.usuario = this.sessionService.getSession();
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.onChangeStore();
    this.routerPromise = this.route.data.subscribe(
      (data) => (this.headerLayout = data['headerLayout'])
    );
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
  }

  onChangeStore(): void {
    this.geoLocationServicePromise =
      this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
        console.log('localizacionObs(true)...');
        this.estado = true;
        this.tiendaActual = this.geoLocationService.getTiendaSeleccionada();
        this.Actualizar();
        this.getPopularProducts();
      });
  }

  ngOnInit(): void {
    console.log('product2x: ', this.product);
    this.isMobile();
    window.onresize = () => {
      this.isMobile();
    };
    this.tiendaActual = this.geoLocationService.getTiendaSeleccionada();
    if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
      this.photoSwipePromise = this.photoSwipe.load().subscribe();
    }

    if (!this.sessionService.isB2B()) {
      this.gtmService.pushTag({
        event: 'productView',
        pagePath: window.location.href,
      });
    }
    // Observable cuyo fin es saber cuando se presiona el boton agregar al carro utilizado para los dispositivos moviles.
    this.addButtonMovilPromise = this.cart.onAddingmovilButton$.subscribe(
      () => {
        // this.addToCart();
      }
    );
    this.iniciarFormulario();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!isVacio(this.product)) {
      await this.obtienePrecioEscala();
      this.refreshListasEnQueExiste();
    }
  }

  ngOnDestroy(): void {
    // dejamos de observar la observable cuando nos salimos de la pagina del producto.
    this.addButtonMovilPromise ? this.addButtonMovilPromise.unsubscribe() : '';
    this.geoLocationServicePromise
      ? this.geoLocationServicePromise.unsubscribe()
      : '';
    this.routerPromise ? this.routerPromise.unsubscribe() : '';
    this.photoSwipePromise ? this.photoSwipePromise.unsubscribe() : '';
    this.addcartPromise ? this.addcartPromise.unsubscribe() : '';
    this.wishlistPromise ? this.wishlistPromise.unsubscribe() : '';
  }

  iniciarFormulario() {
    this.formAvisoStock = this.fb.group({
      sku: [this.product?.sku],
      customerName: [, [Validators.required, Validators.maxLength(35)]],
      customerEmail: [
        ,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/
          ),
        ],
      ],
      customerPhone: ['', [Validators.required, Validators.maxLength(14)]],
    });
    if (this.usuario.userRole != 'temp') {
      this.formAvisoStock.controls['customerName'].setValue(
        this.usuario.firstName + ' ' + this.usuario.lastName
      );
      this.formAvisoStock.controls['customerEmail'].setValue(
        this.usuario.email
      );
      this.formAvisoStock.controls['customerPhone'].setValue(
        this.usuario.phone
      );
    }
  }

  isMobile() {
    this.showMobile = window.innerWidth < this.puntoQuiebre;
  }

  async Actualizar() {
    await this.obtienePrecioEscala();
  }

  getPopularProducts(): void {
    console.log('getPopularProducts(false)...');
    this.estado = false;
  }

  //revisar **
  cargaPrecio(producto: any) {
    this.cart.cargarPrecioEnProducto(producto);
  }

  setAvailability(product: IArticleResponse): void {
    const { pickupDate, deliveryDate } = product.deliverySupply;
    this.isAvailable = !pickupDate && !deliveryDate ? false : true;
  }

  async updateCart(cantidad: any) {
    this.quantity.setValue(cantidad);
    const usuario = this.sessionService.getSession();

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const parametrosPrecios = {
      sku: this.product!.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut: usuario.documentId,
      cantidad,
    };

    const datos: any = await this.cart
      .getPriceProduct(parametrosPrecios)
      .toPromise();
    this.cantidadFaltantePrecioEscala = 0;
    if (datos['precio_escala']) {
      // this.product.precioComun = !isVacio(usuario?.preferences.iva)
      //   ? usuario?.preferences.iva
      //     ? datos['precioComun']
      //     : datos['precioComun'] / (1 + this.IVA)
      //   : datos['precioComun'];
      // this.product.precio.precio = !isVacio(usuario?.preferences.iva)
      //   ? usuario?.preferences.iva
      //     ? datos['precio'].precio
      //     : datos['precio'].precio / (1 + this.IVA)
      //   : datos['precio'].precio;
      this.product!.priceInfo.commonPrice = !isVacio(usuario!.preferences.iva)
        ? usuario.preferences.iva
          ? datos['precioComun']
          : datos['precioComun'] / (1 + this.IVA)
        : datos['precioComun'];

      this.product!.priceInfo.price = !isVacio(usuario?.preferences.iva)
        ? usuario.preferences.iva
          ? datos['precio'].precio
          : datos['precio'].precio / (1 + this.IVA)
        : datos['precio'].precio;

      // pinta de rojo los precios escala
      this.preciosEscalas = this.preciosEscalas.map((p, i) => {
        if (i === 1) {
          this.cantidadFaltantePrecioEscala =
            p.desde - (cantidad ? parseInt(cantidad) : 0);
        }
        if (p.precio === this.product!.priceInfo.price) {
          p.marcado = true;
        } else {
          p.marcado = false;
        }
        return p;
      });
    }
  }

  // addToCart(): void {
  //   const usuario = this.sessionService.getSession();
  //   if (!usuario) {
  //     this.toast.warning(
  //       'Debe iniciar sesion para poder comprar',
  //       'Información'
  //     );
  //     return;
  //   }

  //   if (!this.addingToCart && this.product && this.quantity.value > 0) {
  //     this.product.origin = {} as ProductOrigen;

  //     if (this.origen) {
  //       this.product.origen.origen = this.origen[0] ? this.origen[0] : '';
  //       this.product.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
  //       this.product.origen.seccion = this.origen[2] ? this.origen[2] : '';
  //       this.product.origen.recomendado = this.origen[3] ? this.origen[3] : '';
  //       this.product.origen.ficha = true;
  //       this.product.origen.cyber = this.product.cyber
  //         ? this.product.cyber
  //         : 0;
  //     }

  //     this.addingToCart = true;

  //     this.addcartPromise = this.cart
  //       .add(this.product, this.quantity.value)
  //       .subscribe(
  //         (r) => {},
  //         (e) => {
  //           this.toast.warning(
  //             'Ha ocurrido un error en el proceso',
  //             'Información'
  //           );
  //           this.addingToCart = false;
  //         },
  //         () => {
  //           this.addingToCart = false;
  //         }
  //       );
  //   }
  // }

  // FIXME: ya no se debe llamar endpoint.
  async obtienePrecioEscala() {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    const params = {
      sucursal: tiendaSeleccionada?.codigo,
      sku: this.product!.sku,
      rut: this.usuario.documentId,
    };
    const resp: any = await this.cart.getPriceScale(params).toPromise();
    this.preciosEscalas = resp.data.map((p: any) => {
      return { ...p, marcado: false };
    });

    // if (!isVacio(this.product!.price)) {
    this.preciosEscalas.unshift({
      desde: 0,
      hasta: 0,
      precio: this.product?.priceInfo.price || 0,
      marcado: true,
    });
    // }
  }

  verPreciosEscala(): void {
    // TODO: mostrar precios escala locales:
    console.log('precios escalax: ');
    this.modalService.show(ModalScalePriceComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        scalePrices: this.preciosEscalas,
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  enviarCorreo() {
    if (this.formAvisoStock.valid) {
      let valor_formulario = this.formAvisoStock.value;
      valor_formulario.sku = this.product?.sku;
      this.inventoryService.requestForStock(valor_formulario).subscribe({
        next: () => {
          this.toast.success(
            'Mensaje enviado con éxito. Te contactaremos a la brevedad'
          );
        },
        error: (err) => {
          console.log(err);
          this.toast.warning('No ha sido posible enviar el mensaje');
        },
      });
    }
  }

  enviarWhatsapp(): void {
    const phoneNumber = '56932633571';
    let url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=`;
    let mensaje = `Hola, necesito el siguiente producto ${
      this.product?.name
    } de SKU: ${this.product!.sku}. Para que me atienda un ejecutivo.`;
    window.open(url + mensaje);
  }

  /*************************************************
   * Métodos lista de favoritos.
   *************************************************/
  async addToWishlist(): Promise<void> {
    if (this.favorito) {
      // saca SKU de todas las listas en que existe
      const resp: ResponseApi = (await this.clientsService
        .deleteTodosArticulosFavoritos(
          this.product!.sku,
          this.usuario.documentId || ''
        )
        .toPromise()) as ResponseApi;

      if (!resp.error) {
        this.favorito = false;
        this.cd.markForCheck();
        // se elimina sku de la lista en LocalStorage
        await this.clientsService.cargaFavoritosLocalStorage(
          this.usuario.documentId || ''
        );
        this.refreshListasEnQueExiste();
        this.toast.success('Se eliminó de todas las listas');
      }
    } else {
      let listas: Lista[] = [];
      const resp: ResponseApi = (await this.clientsService
        .getListaArticulosFavoritos(this.usuario.documentId || '')
        .toPromise()) as ResponseApi;

      if (resp.data.length) {
        if (resp.data[0].listas.length) {
          listas = resp.data[0].listas;

          const listaPredeterminada: Lista | undefined = listas.find(
            (l) => l.predeterminada
          );
          // agregamos SKU a lista predeterminada
          const resp1: ResponseApi = (await this.clientsService
            .setArticulosFavoritos(
              this.product!.sku,
              this.usuario.documentId || '',
              listaPredeterminada?._id || ''
            )
            .toPromise()) as ResponseApi;
          if (!resp1.error) {
            // se agrega sku en la lista del LocalStorage
            await this.clientsService.cargaFavoritosLocalStorage(
              this.usuario.documentId || ''
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
        producto: this.product!,
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
      .getListaArticulosFavoritos(this.usuario.documentId)
      .toPromise()) as ResponseApi;
    if (resp.data.length) {
      if (resp.data[0].listas.length) {
        listas = resp.data[0].listas;
      }
    }

    const initialState: DataWishListModal = {
      producto: this.product!,
      listas,
      listasEnQueExiste: this.listasEnQueExiste,
    };
    const modal: BsModalRef = this.modalService.show(WishListModalComponent, {
      class: 'modal-sm2 modal-dialog-centered',
      initialState,
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
        if (!isVacio(lista.skus.find((sku) => sku === this.product!.sku))) {
          this.favorito = true;
          this.listasEnQueExiste.push(lista);
        }
      });
    }
    this.cd.markForCheck();
  }

  /*************************************************
   * Métodos para la galería de imágenes.
   *************************************************/
  private formatThumbVideo(attribute: Attribute): string {
    const thumbImage = attribute.value.split('/embed')[1];
    return `https://i.ytimg.com/vi${thumbImage}/1.jpg`;
  }

  setActiveImage(imageId: string): void {
    this.images.forEach((itemImage) => {
      itemImage.active = itemImage.id === imageId;
    });
  }

  featuredCarouselTranslated(event: SlidesOutputData): void {
    if (!event.slides?.length) return;
    const activeImageId = event.slides[0].id;
    this.setActiveImage(activeImageId);
  }

  openPhotoSwipe(event: MouseEvent, image: IProductImage): void {
    if (this.layout === 'quickview') return;
    event.preventDefault();

    const options = {
      getThumbBoundsFn: (index: any) => {
        const imageElement = this.imageElements.toArray()[index].nativeElement;
        const pageYScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        const rect = imageElement.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      },
      index: this.images.indexOf(image),
      bgOpacity: 0.9,
      history: false,
    };

    const images = this.images.map((eachImage) => ({
      src: eachImage.url,
      msrc: eachImage.url,
      w: 700,
      h: 700,
    }));
    this.photoSwipe.open(images, options).subscribe((galleryRef) => {
      galleryRef.listen('beforeChange', () => {
        this.featuredCarousel.to(this.images[galleryRef.getCurrentIndex()].id);
      });
    });
  }

  // sku, images, attributes.
  private formatImageSlider(product: IArticleResponse): void {
    if (
      !product.images.length ||
      !product.images[0]['1000'].length ||
      !product.images[0]['150'].length
    ) {
      const image: IProductImage = {
        id: `${product.sku}_0`,
        url: this.root.returnUrlNoImagen(),
        active: true,
      };
      this.images = [image];
    } else {
      const image1000 = product.images[0]['1000'];
      const image150 = product.images[0]['150'];

      this.images = image1000.map((item, index) => ({
        id: `${product.sku}_${index}`,
        url: item,
        urlThumbs: image150[index],
        active: index === 0,
        video: false,
      }));

      // Formateando los thumbs de video.
      const videos = product.attributes.filter(
        (item) => item.name === 'VIDEO'
      );
      const videoImages = videos.map((item, index) => ({
        id: `${product.sku}_${this.images.length + index}`,
        url: item.value,
        urlThumbs: this.formatThumbVideo(item),
        active: index === 0,
        video: true,
      }));
      this.images.push(...videoImages);
    }
  }
}
