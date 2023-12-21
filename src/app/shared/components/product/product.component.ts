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
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
// Libs
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
// Rxjs
import { Subscription } from 'rxjs';
// Envs
import { environment } from '@env/environment';
// Constants
import { CarouselConfig, CarouselOptions } from './constants/carousel-config';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { IProductImage } from './models/image.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IScalePriceItem } from './models/scale-price-item.interface';
import { IWishlist } from '@core/services-v2/whishlist/models/whishlist-response.interface';
// Services
import { CartService } from '../../services/cart.service';
import { PhotoSwipeService } from '../../services/photo-swipe.service';
import { RootService } from '../../services/root.service';
import { WishListModalComponent } from '../wish-list-modal/wish-list-modal.component';
import { isVacio } from '../../utils/utilidades';
import { SessionService } from '@core/states-v2/session.service';
import { InventoryService } from '@core/services-v2/inventory.service';
import { WishlistApiService } from '@core/services-v2/whishlist/whishlist-api.service';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { GalleryUtils } from './services/gallery-utils.service';
// Modals
import { ModalScalePriceComponent } from '../modal-scale-price/modal-scale-price.component';
import { WishlistService } from '@core/services-v2/whishlist/wishlist.service';
import { IDeliverySupply } from '@core/models-v2/cms/special-reponse.interface';

export type Layout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('myCarousel', { static: false }) myCarousel!: NguCarousel<any>;
  @Input() stock!: boolean;
  @Input() origen!: string[];
  @Input() set product(value: IArticleResponse) {
    if (!value) return;
    // Eliminar?
    this.getPopularProducts();
    this.setAvailability(value.deliverySupply);
    this.quantity.setValue(1);

    this.dataProduct = value;
    console.log('[-] producto: ', value);
    // this.dataProduct.name = this.dataProduct.name.replace(/("|')/g, '');
    this.images = GalleryUtils.formatImageSlider(value);
    this.quality = this.root.setQuality(value);
    this.root.limpiaAtributos(value);

    /*const url: string = this.root.product(
      this.dataProduct.sku,
      this.dataProduct.name,
      false
    );
    this.dataProduct.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);*/
  }
  @Input() recommendedProducts!: Array<any>;
  @Output() comentarioGuardado: EventEmitter<boolean> = new EventEmitter();
  @Output() leerComentarios: EventEmitter<boolean> = new EventEmitter();
  //codigo de slide vertical
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  innerWidth: number;

  /*************************************
   * Variables de carousel.
   ************************************/
  carouselConfig: NguCarouselConfig;
  carouselOptions: Partial<OwlCarouselOConfig>;

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
  listasEnQueExiste: IWishlist[] = [];
  listaPredeterminada: IWishlist | null = null;

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

  get product() {
    return this.dataProduct;
  }

  quantity: FormControl = new FormControl(1);

  addingToCart = false;
  addingToWishlist = false;
  disponibilidadSku: any;
  headerLayout!: string;

  today = Date.now();
  stockMax = 0;
  selectedStore!: ISelectedStore;
  MODOS = { RETIRO_TIENDA: 'retiroTienda', DESPACHO: 'domicilio' };
  puntoQuiebre: number = 576;
  showMobile: boolean = false;
  formAvisoStock!: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cart: CartService,
    private photoSwipe: PhotoSwipeService,
    public root: RootService,
    public toast: ToastrService,
    private modalService: BsModalService,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly inventoryService: InventoryService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly wishlistApiService: WishlistApiService,
    private readonly wishlistStorage: WishlistStorageService,
    private readonly wishlistService: WishlistService
  ) {
    this.carouselConfig = CarouselConfig;
    this.carouselOptions = CarouselOptions;
    this.isB2B = this.sessionService.isB2B();
    this.usuario = this.sessionService.getSession();
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.routerPromise = this.route.data.subscribe((data) => {
      this.headerLayout = data['headerLayout'];
    });
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
  }

  onChangeStore(): void {
    this.selectedStore = this.geolocationService.getSelectedStore();
    this.geoLocationServicePromise =
      this.geolocationService.selectedStore$.subscribe({
        next: (selectedStore) => {
          this.estado = true;
          this.selectedStore = selectedStore;
          this.obtienePrecioEscala();
          this.getPopularProducts();
        },
      });
  }

  ngOnInit(): void {
    this.onChangeStore();
    this.isMobile();
    window.onresize = () => this.isMobile();
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
    this.buildRequestProductForm();
  }

  async ngOnChanges() {
    if (this.product) {
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

  getPopularProducts(): void {
    this.estado = false;
  }

  private setAvailability(deliverySupply: IDeliverySupply): void {
    const { pickupDate, deliveryDate } = deliverySupply;
    this.isAvailable = !pickupDate && !deliveryDate ? false : true;
  }

  async updateCart(cantidad: any) {
    this.quantity.setValue(cantidad);
    const session = this.sessionService.getSession();
    const selectedStore = this.geolocationService.getSelectedStore();

    const datos: any = await this.cart
      .getPriceProduct({
        sku: this.product!.sku,
        sucursal: selectedStore.code,
        rut: session.documentId,
        cantidad,
      })
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
      this.product!.priceInfo.commonPrice = !isVacio(session!.preferences.iva)
        ? session.preferences.iva
          ? datos['precioComun']
          : datos['precioComun'] / (1 + this.IVA)
        : datos['precioComun'];

      this.product!.priceInfo.price = !isVacio(session?.preferences.iva)
        ? session.preferences.iva
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  /*************************************************
   * Métodos precios escala.
   *************************************************/
  verPreciosEscala(): void {
    // TODO: mostrar precios escala locales:
    this.modalService.show(ModalScalePriceComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        scalePrices: this.preciosEscalas,
      },
    });
  }

  // FIXME: ya no se debe llamar endpoint.
  async obtienePrecioEscala() {
    const selectedStore = this.geolocationService.getSelectedStore();
    const resp: any = await this.cart
      .getPriceScale({
        sucursal: selectedStore.code,
        sku: this.product!.sku,
        rut: this.usuario.documentId,
      })
      .toPromise();
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

  /*************************************************
   * Métodos solicitud de producto.
   *************************************************/
  /**
   * Construye el formulario de solicitud de producto.
   */
  private buildRequestProductForm(): void {
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
   * Métodos para la galería de imágenes.
   *************************************************/
  /**
   * Setear imagen activa y fijar su posición en el carrousel.
   * @param imageId
   */
  setActiveImage(imageId: string): void {
    this.featuredCarousel.to(imageId);
    GalleryUtils.formatActiveImage(this.images, imageId);
  }

  featuredCarouselTranslated(event: SlidesOutputData): void {
    if (!event.slides?.length) return;
    const activeImageId = event.slides[0].id;
    GalleryUtils.formatActiveImage(this.images, activeImageId);
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

  /*************************************************
   * Métodos lista de deseos.
   *************************************************/
  private refreshListasEnQueExiste(): void {
    this.listasEnQueExiste = [];
    const wishlists = this.wishlistStorage.get();
    if (wishlists.length) {
      wishlists.forEach((wishlist) => {
        const isProductOnList = wishlist.articles.find(
          (product) => product.sku === this.product.sku
        );
        if (isProductOnList) {
          this.favorito = true;
          this.listasEnQueExiste.push(wishlist);
        }
      });
    }
    this.cd.markForCheck();
  }

  async addToWishlist(): Promise<void> {
    if (this.favorito) {
      this.wishlistApiService
        .deleteProductFromAllWishlists(
          this.usuario.documentId,
          this.product.sku
        )
        .subscribe({
          next: () => {
            this.favorito = false;
            this.cd.markForCheck();
            this.wishlistService
              .setWishlistOnStorage(this.usuario.documentId)
              .subscribe({
                next: () => {
                  this.refreshListasEnQueExiste();
                  this.toast.success('Se eliminó de todas las listas');
                },
              });
          },
        });
    } else {
      let listas: IWishlist[] = [];
      this.wishlistApiService.getWishlists(this.usuario.documentId).subscribe({
        next: (wishlists) => {
          listas = wishlists;
          if (!wishlists.length) return;
          const listaPredeterminada = listas.find((l) => l.default);

          this.wishlistApiService
            .addProductsToWishlist({
              documentId: this.usuario.documentId,
              wishlistId: listaPredeterminada?.id || '',
              skus: [this.product.sku],
            })
            .subscribe({
              next: () => {
                this.wishlistService
                  .setWishlistOnStorage(this.usuario.documentId)
                  .subscribe({
                    next: () => {
                      this.refreshListasEnQueExiste();
                      this.toast.success(
                        `Se agregó a la lista ${listaPredeterminada?.name}.`
                      );
                      this.favorito = true;
                      this.cd.markForCheck();
                      this.listaPredeterminada = listaPredeterminada || null;
                    },
                  });
              },
            });
        },
      });

      const modal = this.modalService.show(WishListModalComponent, {
        class: 'modal-sm2 modal-dialog-centered',
        ignoreBackdropClick: true,
        initialState: {
          producto: this.product!,
          listas: [],
          listasEnQueExiste: this.listasEnQueExiste,
        },
      });
      modal.content?.event.subscribe((res: any) => {
        this.refreshListasEnQueExiste();
        this.favorito = res;
        this.cd.markForCheck();
      });
    }
  }

  /**
   * Abrir modal con las listas de deseos.
   */
  async addToWishlistOptions() {
    this.wishlistApiService.getWishlists(this.usuario.documentId).subscribe({
      next: (whishlists) => {
        const modal = this.modalService.show(WishListModalComponent, {
          class: 'modal-sm2 modal-dialog-centered',
          initialState: {
            producto: this.product!,
            listas: whishlists,
            listasEnQueExiste: this.listasEnQueExiste,
          },
        });
        modal.content?.event.subscribe((res: any) => {
          this.refreshListasEnQueExiste();
          this.favorito = res;
          this.cd.markForCheck();
        });
      },
    });
  }

  /*************************************************
   * Métodos de responsive.
   *************************************************/
  isMobile(): void {
    this.showMobile = window.innerWidth < this.puntoQuiebre;
  }
}
