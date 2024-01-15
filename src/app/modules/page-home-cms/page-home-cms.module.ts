// Angular
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
// Libs
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
// Routing
import { PageHomeCmsRoutesModule } from './page-home-cms.routing';
// Modules
import { SharedModule } from '../../shared/shared.module';
// Components
import { PageHomeTemplateComponent } from './components/page-home-template/page-home-template.component';
import { ProductPageHomeComponent } from './components/product-page-home/product-page-home.component';
import { PageHomeComponent } from './page/page-home/page-home.component';
import { CajaConceptoComponent } from './components/caja-concepto/caja-concepto.component';
import { ConceptoComponent } from './components/concepto/concepto.component';
import { BannerComponent } from './components/banner/banner.component';
import { BlogComponent } from './components/blog/blog.component';
import { Lista_productoComponent } from './components/lista_producto/lista_producto.component';
import { SlideMundoComponent } from './components/slide-mundo/slide-mundo.component';
import { VerMasProductoComponent } from './components/ver-mas-producto/ver-mas-producto.component';
import { ConceptoMobileComponent } from './components/concepto/mobile/concepto-mobile/concepto-mobile.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PageHomeCmsRoutesModule,
    NgbModule,
    CarouselModule,
    NgOptimizedImage,
  ],
  declarations: [
    SlideMundoComponent,
    PageHomeComponent,
    PageHomeTemplateComponent,
    CajaConceptoComponent,
    ConceptoMobileComponent,
    ProductPageHomeComponent,
    ConceptoComponent,
    BlogComponent,
    Lista_productoComponent,
    VerMasProductoComponent,
    BannerComponent,
  ],
  exports: [
    SlideMundoComponent,
    PageHomeComponent,
    PageHomeTemplateComponent,
    CajaConceptoComponent,
    ConceptoMobileComponent,
    ProductPageHomeComponent,
    ConceptoComponent,
    BlogComponent,
    Lista_productoComponent,
    BannerComponent,
  ],
})
export class PageHomeCmsModule {}
