import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//import { Ng2Rut, RutValidator } from 'ng2-rut';
//import { AgmCoreModule } from '@agm/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
//import { InlineSVGModule } from 'ng-inline-svg';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';

// directives
import { ClickDirective } from './directives/click.directive';
import {
  CollapseContentDirective,
  CollapseDirective,
  CollapseItemDirective,
} from './directives/collapse.directive';
import { DepartmentsAreaDirective } from './directives/departments-area.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { FakeSlidesDirective } from './directives/fake-slides.directive';
import { OwlPreventClickDirective } from './directives/owl-prevent-click.directive';
import { DragDropDirective } from './directives/drag-drop.directive';
import { PhoneCharDirective } from './directives/phone-char.directive';
import { LettersCharDirective } from './directives/letters-char.directive';
import { DisableControlDirective } from './directives/disable-control.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { RutCharsDirective } from './directives/rut-chars.directive';
import { LazyImgDirective } from './directives/lazy-img.directive';

// pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { CapitalizeFirstPipe } from './pipes/capitalize.pipe';
import { TitleCasePipe } from './pipes/title-case.pipe';

// components
import { AlertComponent } from './components/alert/alert.component';
import { IconComponent } from './components/icon/icon.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
//import { PaginationComponent } from './components/pagination/pagination.component';
import { ProductCardB2bComponent } from './components/product-card-b2b/product-card-b2b.component';
//import { ProductFeatureSpecialComponent } from './components/product-feature-special/product-feature-special.component';
import { ProductsViewComponent } from '../modules/shop/components/products-view/products-view.component';
//import { ProductSliderComponent } from './components/product-slider/product-slider.component';
//import { FiltersProductsComponent } from './components/filters-products/filters-products.component';
import { AlertCartComponent } from './components/alert-cart/alert-cart.component';
import { AlertCartMinComponent } from './components/alert-cart-min/alert-cart-min.component';
//import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { ProductSlideshowComponent } from './components/product-slideshow/product-slideshow.component';
import { MapComponent } from './components/map/map.component';
import { UpdateAddressModalComponent } from './components/update-address-modal/update-address-modal.component';
import { LoginComponent } from '../modules/header/components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
//import { WidgetProductsComponent } from '../modules/widgets/widget-products/widget-products.component';
//import { LoadingComponent } from './components/loading/loading.component';
import { AddcartButtonComponent } from './components/addcart-button/addcart-button.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
//import { VideoComponent } from './components/video/video.component';
import { ModalComponent } from './components/modal/modal.component';
import { TablaProductoComponent } from './components/tabla-producto/tabla-producto.component';
import { AddFlotaModalComponent } from './components/add-flota-modal/add-flota-modal.component';
import { ProductCardB2cComponent } from './components/product-card-b2c/product-card-b2c.component';
import { UpdateFlotaModalComponent } from './components/update-flota-modal/update-flota-modal.component';
import { PorductoTrComponent } from './components/tabla-producto/porducto-tr/producto-tr.component';
import { InputNumberProductComponent } from './components/input-number-product/input-number-product.component';
import { NgChartsModule, ThemeService } from 'ng2-charts';
import { WishListModalComponent } from './components/wish-list-modal/wish-list-modal.component';
import { ProductListCardComponent } from './components/product-list-card/product-list-card.component';
import { EditarListaProductosComponent } from './components/editar-lista-productos/editar-lista-productos.component';
import { AgregarListaProductosMasivaModalComponent } from './components/agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { ProductListModalComponent } from './components/product-list-card/components/product-list-modal/product-list-modal.component';
// import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularEmailAutocompleteComponent } from './components/angular-email-autocomplete/angular-email-autocomplete.component';
import { MonedaPipe } from './pipes/moneda.pipe';
import { FiltroMagicoModule } from './components/filtro-magico/filtro-magico.module';
import { ProductoSelectBusquedaComponent } from './components/producto-select-busqueda/producto-select-busqueda.component';
import { AgregarListaProductosUnitariaModalComponent } from './components/agregar-lista-productos-unitaria-modal/agregar-lista-productos-unitaria-modal.component';
import { MenuCategoriaComponent } from './components/menu-categoria/menu-categoria.component';

import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent,
} from '@ngu/carousel';
import { ShareButtonComponent } from './components/share-button/share-button.component';
import { ProductRatingComponent } from './components/product-rating/product-rating.component';
import { AddCommentModalComponent } from './components/add-comment-modal/add-comment-modal.component';
import { StarSelectComponent } from './components/add-comment-modal/components/star-select/star-select.component';
import { LoadingElementComponent } from './components/loading-element/loading-element.component';
import { ProductCardB2cFichaComponent } from './components/product-card-b2c-ficha/product-card-b2c-ficha.component';
import { AddContactModalComponent } from './components/add-contact-modal/add-contact-modal.component';
import { UpdateContactModalComponent } from './components/update-contact-modal/update-contact-modal.component';
// import { Productb2bComponent } from './components/productb2b/productb2b.component';
import { AvisoStockComponent } from './components/aviso-stock/aviso-stock.component';
import { CountdownTimerModule } from './../../../projects/countdown-timer/src/lib/countdown-timer.module';
import { ProductCardB2cCmsComponent } from './components/product-card-b2c-cms/product-card-b2c-cms.component';
import { ButtonsSlideshowComponent } from './components/buttons-slideshow/buttons-slideshow.component';
import { ButtonComponent } from './components/buttons-slideshow/components/button/button.component';
// Bootstrap
import { NgbNavModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductSlideshowSpecialsComponent } from '../pages/product-slideshow-specials/product-slideshow-specials.component';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };

const BOOSTRAP_MODULES = [NgbPopoverModule, NgbNavModule];
const NGU_CAROUSEL_MODULES = [
  NguCarousel,
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent,
];

@NgModule({
  declarations: [
    // directives
    ClickDirective,
    CollapseContentDirective,
    CollapseDirective,
    CollapseItemDirective,
    DepartmentsAreaDirective,
    DropdownDirective,
    FakeSlidesDirective,
    OwlPreventClickDirective,
    DragDropDirective,
    PhoneCharDirective,
    LettersCharDirective,
    OnlyNumbersDirective,
    DisableControlDirective,
    RutCharsDirective,
    LazyImgDirective,
    AvisoStockComponent,
    // pipe
    CurrencyFormatPipe,
    SlugifyPipe,
    TitleCasePipe,
    CapitalizeFirstPipe,

    // components
    AlertComponent,
    IconComponent,
    InputNumberComponent,
    LoadingBarComponent,
    PageHeaderComponent,
    // PaginationComponent,
    ProductCardB2bComponent,
    // ProductFeatureSpecialComponent,
    LoadingElementComponent,
    // ProductSliderComponent,
    // FiltersProductsComponent,
    AlertCartComponent,
    AlertCartMinComponent,
    // ViewPdfComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    // WidgetProductsComponent,
    ProductSlideshowComponent,
    ProductSlideshowSpecialsComponent,
    ProductsViewComponent,
    // LoadingComponent,
    AddcartButtonComponent,
    ConfirmModalComponent,
    SafeHtmlPipe,
    ReplacePipe,
    ScrollTopComponent,
    // VideoComponent,
    ModalComponent,
    TablaProductoComponent,
    AddFlotaModalComponent,
    ProductCardB2cComponent,
    UpdateFlotaModalComponent,
    PorductoTrComponent,
    InputNumberProductComponent,
    WishListModalComponent,
    ProductListCardComponent,
    EditarListaProductosComponent,
    AgregarListaProductosMasivaModalComponent,
    ProductListModalComponent,
    AngularEmailAutocompleteComponent,
    MonedaPipe,
    ProductoSelectBusquedaComponent,
    AgregarListaProductosUnitariaModalComponent,
    MenuCategoriaComponent,
    ShareButtonComponent,
    ProductRatingComponent,
    AddCommentModalComponent,
    StarSelectComponent,
    ProductCardB2cFichaComponent,
    UpdateAddressModalComponent,
    AddContactModalComponent,
    UpdateContactModalComponent,
    // Productb2bComponent,
    ProductCardB2cCmsComponent,
    ButtonsSlideshowComponent,
    ButtonComponent,
  ],
  imports: [
    // modules (angular)
    CommonModule,
    NgSelectModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ...BOOSTRAP_MODULES,
    // modules (third-party)
    CarouselModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    // InlineSVGModule.forRoot(),
    NgxPaginationModule,
    // PerfectScrollbarModule,
    CountdownTimerModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyD_HuwF5F8X8fOSR_1Ai_hFT115caUq4vI',
    //   libraries: ['places']
    // }),
    // Ng2Rut,
    ...NGU_CAROUSEL_MODULES,
    NgChartsModule,
    FiltroMagicoModule,
    InfiniteScrollModule,
  ],
  exports: [
    // modules (third-party)
    CollapseModule,
    ModalModule,
    TabsModule,
    //Ng2Rut,

    NgChartsModule,
    InfiniteScrollModule,

    // directives
    ClickDirective,
    CollapseContentDirective,
    CollapseDirective,
    CollapseItemDirective,
    DepartmentsAreaDirective,
    DropdownDirective,
    FakeSlidesDirective,
    OwlPreventClickDirective,
    LazyImgDirective,

    // pipes
    CurrencyFormatPipe,
    SlugifyPipe,
    DecimalPipe,
    TitleCasePipe,
    CapitalizeFirstPipe,
    SafeHtmlPipe,
    ReplacePipe,

    // components
    AlertComponent,
    IconComponent,
    InputNumberComponent,
    LoadingBarComponent,
    PageHeaderComponent,
    // PaginationComponent,
    ProductCardB2bComponent,
    ProductCardB2cComponent,
    LoadingElementComponent,
    // ProductSliderComponent,
    // FiltersProductsComponent,
    AlertCartComponent,
    AlertCartMinComponent,
    // ProductFeatureSpecialComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    // WidgetProductsComponent,
    ProductSlideshowComponent,
    ProductSlideshowSpecialsComponent,
    ProductsViewComponent,
    // LoadingComponent,
    AddcartButtonComponent,
    ConfirmModalComponent,
    // VideoComponent,
    // ViewPdfComponent,
    AngularEmailAutocompleteComponent,
    ProductoSelectBusquedaComponent,
    ProductCardB2cCmsComponent,
    ShareButtonComponent,
    ProductRatingComponent,
    ProductCardB2cFichaComponent,
    UpdateAddressModalComponent,
    AddContactModalComponent,
    UpdateContactModalComponent,
    ButtonsSlideshowComponent,
    ButtonComponent,

    // a evaluar
    CountdownTimerModule,
    NgSelectModule,
    CarouselModule,
    // PerfectScrollbarModule,
    FiltroMagicoModule,
    MenuCategoriaComponent,
    ...NGU_CAROUSEL_MODULES,
  ],
  providers: [
    /*{
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },*/
    SlugifyPipe,
    DecimalPipe,
    CapitalizeFirstPipe,
    DatePipe,
    CurrencyFormatPipe,
    //RutValidator,
    //ThemeService
  ],
})
export class SharedModule {}
