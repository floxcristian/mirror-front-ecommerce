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
  ChangeDetectorRef,
  OnChanges,
  Output,
  EventEmitter,
  HostListener,
  DestroyRef,
  inject,
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
import { NguCarouselConfig } from '@ngu/carousel';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
// Rxjs
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Constants
import { CarouselConfig, CarouselOptions } from './constants/carousel-config';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { IProductImage } from './models/image.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IDeliverySupply } from '@core/models-v2/cms/special-reponse.interface';
import { IWishlist } from '@core/services-v2/wishlist/models/wishlist-response.interface';
import { IShoppingCartProductOrigin } from '@core/models-v2/cart/shopping-cart.interface';
// Services
import { PhotoSwipeService } from '../../services/photo-swipe.service';
import { RootService } from '../../services/root.service';
import { WishListModalComponent } from '../wish-list-modal/wish-list-modal.component';
import { SessionService } from '@core/services-v2/session/session.service';
import { InventoryService } from '@core/services-v2/inventory.service';
import { WishlistApiService } from '@core/services-v2/wishlist/wishlist-api.service';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { WishlistService } from '@core/services-v2/wishlist/wishlist.service';
import { GalleryUtils } from './services/gallery-utils.service';
import { ProductPriceApiService } from '@core/services-v2/product-price/product-price.service';
import { CartService } from '@core/services-v2/cart.service';
// Modals
import { ModalScalePriceComponent } from '../modal-scale-price/modal-scale-price.component';

export type Layout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChild('featuredCarousel', { read: CarouselComponent, static: false })
  featuredCarousel!: CarouselComponent;
  @ViewChildren('imageElement', { read: ElementRef })
  imageElements!: QueryList<ElementRef>;

  @Input() stock!: boolean;
  @Input() origen!: string[];
  @Input() recommendedProducts!: IArticleResponse[];
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

  @Output() comentarioGuardado: EventEmitter<boolean> = new EventEmitter();
  @Output() leerComentarios: EventEmitter<boolean> = new EventEmitter();
  //codigo de slide vertical
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
  quantityToScalePrice!: number;

  dataProduct!: IArticleResponse;
  private dataLayout: Layout = 'standard';

  showGallery = true;
  showGalleryTimeout!: number;

  quality: any;
  isAvailable!: boolean;
  estado = true; // isDesktop
  products: IArticleResponse[] = [];

  session: ISession;
  isB2B: boolean;
  selectedStore!: ISelectedStore;
  isProductOnList!: boolean;
  productWishlistsIds: string[] = [];
  defaultWishlist!: IWishlist | null;

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

  addingToCart!: boolean;
  addingToWishlist!: boolean;

  puntoQuiebre: number = 576;
  showMobile!: boolean;
  formProductRequest!: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
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
    private cart: CartService,
    private readonly sessionService: SessionService,
    private readonly inventoryService: InventoryService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly wishlistApiService: WishlistApiService,
    private readonly wishlistStorage: WishlistStorageService,
    private readonly wishlistService: WishlistService,
    private readonly productPriceApiService: ProductPriceApiService
  ) {
    this.carouselConfig = CarouselConfig;
    this.carouselOptions = CarouselOptions;
    this.isB2B = this.sessionService.isB2B();
    this.session = this.sessionService.getSession();
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
  }

  onChangeStore(): void {
    this.selectedStore = this.geolocationService.getSelectedStore();
    this.geolocationService.selectedStore$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (selectedStore) => {
          this.estado = true;
          this.selectedStore = selectedStore;
          this.getPopularProducts();
        },
      });
  }

  ngOnInit(): void {
    this.onChangeStore();
    this.setIsMobile();
    window.onresize = () => this.setIsMobile();
    if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
      this.photoSwipe
        .load()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }

    if (!this.sessionService.isB2B()) {
      this.gtmService.pushTag({
        event: 'productView',
        pagePath: window.location.href,
      });
    }
    // Observable cuyo fin es saber cuando se presiona el boton agregar al carro utilizado para los dispositivos moviles.
    this.cart.onAddingmovilButton$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.addToCart();
        },
      });
    this.buildProductRequestForm();
  }

  ngOnChanges(): void {
    if (this.product) {
      this.refreshProductWishlistsIds();
    }
  }

  getPopularProducts(): void {
    this.estado = false;
  }

  private setAvailability(deliverySupply: IDeliverySupply): void {
    const { pickupDate, deliveryDate } = deliverySupply;
    this.isAvailable = !pickupDate && !deliveryDate ? false : true;
  }

  /**
   * Actualiza información de precio del producto.
   * @param quantity
   */
  refreshProductPrice(quantity: number): void {
    this.quantity.setValue(quantity);
    const session = this.sessionService.getSession();
    const selectedStore = this.geolocationService.getSelectedStore();

    this.productPriceApiService
      .getProductPrice({
        quantity,
        documentId: session.documentId,
        sku: this.product.sku,
        branchCode: selectedStore.code,
      })
      .subscribe({
        next: (priceInfo) => {
          this.product.priceInfo = priceInfo;
          const firstFromQuantity = priceInfo.scalePrice[0].fromQuantity;
          this.quantityToScalePrice =
            quantity >= firstFromQuantity ? 0 : firstFromQuantity - quantity;
        },
      });
  }

  addToCart(): void {
    const usuario = this.sessionService.getSession();
    if (!usuario) {
      this.toast.warning(
        'Debe iniciar sesion para poder comprar',
        'Información'
      );
      return;
    }

    if (!this.addingToCart && this.product && this.quantity.value) {
      this.product.origin = {} as IShoppingCartProductOrigin;

      if (this.origen) {
        // Seteamos el origen de donde se hizo click a add cart.
        const origin: IShoppingCartProductOrigin = {
          origin: this.origen[0] || '',
          subOrigin: this.origen[1] || '',
          section: this.origen[2] || '',
          recommended: this.origen[3],
          sheet: false,
          cyber: this.product.cyber || 0,
        };
        this.product.origin = origin;
      }

      this.addingToCart = true;

      this.cart.add(this.product, this.quantity.value).finally(() => {
        this.addingToCart = false;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  /*************************************************
   * Métodos precios escala.
   *************************************************/
  showScalePrices(): void {
    this.modalService.show(ModalScalePriceComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        scalePrices: this.dataProduct.priceInfo.scalePrice,
      },
    });
  }

  /*************************************************
   * Métodos solicitud de producto.
   *************************************************/
  /**
   * Construye el formulario de solicitud de producto.
   */
  private buildProductRequestForm(): void {
    this.formProductRequest = this.fb.group({
      sku: [this.product?.sku],
      customerName: ['', [Validators.required, Validators.maxLength(35)]],
      customerEmail: [
        '',
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
    if (this.session.userRole != 'temp') {
      this.formProductRequest.controls['customerName'].setValue(
        this.session.firstName + ' ' + this.session.lastName
      );
      this.formProductRequest.controls['customerEmail'].setValue(
        this.session.email
      );
      this.formProductRequest.controls['customerPhone'].setValue(
        this.session.phone
      );
    }
  }

  /**
   * Enviar correo electrónico solicitando un producto.
   * @returns
   */
  sendEmail(): void {
    if (!this.formProductRequest.valid) return;

    let valor_formulario = this.formProductRequest.value;
    valor_formulario.sku = this.product?.sku;
    this.inventoryService.requestForStock(valor_formulario).subscribe({
      next: () => {
        this.toast.success(
          'Mensaje enviado con éxito. Te contactaremos a la brevedad'
        );
      },
      error: (err) => {
        console.error(err);
        this.toast.warning('No ha sido posible enviar el mensaje');
      },
    });
  }

  /**
   * Enviar mensaje por whatsapp solicitando producto.
   */
  sendWhatsappMessage(): void {
    const phoneNumber = '56932633571';
    const message = `Hola, necesito el siguiente producto ${
      this.product?.name
    } de SKU: ${this.product!.sku}. Para que me atienda un ejecutivo.`;
    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
    );
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

  /**
   * Ampliar imagen seleccionada.
   * @param event
   * @param image
   * @returns
   */
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
   * Métodos de lista de deseos.
   *************************************************/
  /**
   * Actualizar los ids de las listas que contienen el producto actual.
   * @returns
   */
  private refreshProductWishlistsIds(): void {
    this.productWishlistsIds = [];
    const wishlists = this.wishlistStorage.get();
    if (!wishlists.length) return;
    wishlists.forEach((wishlist) => {
      const isProductOnList = wishlist.articles.find(
        (product) => product.sku === this.product.sku
      );
      this.isProductOnList = isProductOnList ? true : false;
      if (isProductOnList) {
        this.productWishlistsIds.push(wishlist.id);
      }
    });
    this.cd.markForCheck();
  }

  /**
   * Añadir un producto a una lista o eliminar el producto de todas las listas
   * dependiendo si el producto ya se encuentra en una lista.
   */
  addToWishlist(): void {
    if (this.isProductOnList) {
      this.deleteProductFromAllWishlists();
    } else {
      this.addProductToDefaultWishlist();
    }
  }

  /**
   * Eliminar producto de todas las listas de deseos.
   */
  private deleteProductFromAllWishlists(): void {
    this.wishlistApiService
      .deleteProductFromAllWishlists(this.session.documentId, this.product.sku)
      .subscribe({
        next: () => {
          this.isProductOnList = false;
          this.cd.markForCheck();
          this.wishlistService
            .setWishlistsOnStorage(this.session.documentId)
            .subscribe({
              next: () => {
                this.refreshProductWishlistsIds();
                this.toast.success('Se eliminó de todas las listas');
              },
            });
        },
      });
  }

  /**
   * Añadir producto a la lista de deseos por defecto.
   */
  private addProductToDefaultWishlist(): void {
    this.wishlistApiService.getWishlists(this.session.documentId).subscribe({
      next: (wishlists) => {
        if (!wishlists.length) return;
        const defaultWishlist = wishlists.find((wishlist) => wishlist.default);

        this.wishlistApiService
          .addProductsToWishlist({
            documentId: this.session.documentId,
            wishlistId: defaultWishlist?.id || '',
            skus: [this.product.sku],
          })
          .subscribe({
            next: () => {
              this.wishlistService
                .setWishlistsOnStorage(this.session.documentId)
                .subscribe({
                  next: () => {
                    this.refreshProductWishlistsIds();
                    this.toast.success(
                      `Se agregó a la lista ${defaultWishlist?.name}.`
                    );
                    this.cd.markForCheck();
                    this.defaultWishlist = defaultWishlist || null;
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
        productSku: this.product.sku,
        wishlists: [],
        productWishlistsIds: this.productWishlistsIds,
      },
    });
    modal.content?.event.subscribe(() => {
      this.refreshProductWishlistsIds();
      this.cd.markForCheck();
    });
  }

  /**
   * Abrir modal con las listas de deseos.
   */
  addToWishlistOptions(): void {
    this.wishlistApiService.getWishlists(this.session.documentId).subscribe({
      next: (wishlists) => {
        const modal = this.modalService.show(WishListModalComponent, {
          class: 'modal-sm2 modal-dialog-centered',
          initialState: {
            wishlists,
            productSku: this.product.sku,
            productWishlistsIds: this.productWishlistsIds,
          },
        });
        modal.content?.event.subscribe(() => {
          this.refreshProductWishlistsIds();
          this.cd.markForCheck();
        });
      },
    });
  }

  /*************************************************
   * Métodos de responsive.
   *************************************************/
  setIsMobile(): void {
    this.showMobile = window.innerWidth < this.puntoQuiebre;
  }
}
