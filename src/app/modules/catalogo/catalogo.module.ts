// Angular
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
// Libs
import { CarouselModule } from 'ngx-bootstrap/carousel'
// Routing
import { CatalogoRoutingModule } from './catalogo-routing.module'
// Modules
import { SharedModule } from '../../shared/shared.module'
import { HeaderModule } from '../header/header.module'
import { MobileModule } from '../mobile/mobile.module'
// Pages
import { PageCatalogoComponent } from './pages/page-catalogo/page-catalogo.component'
import { PageVerCatalogoComponent } from './pages/page-ver-catalogo/page-ver-catalogo.component'
import { PagePimTemplateS } from './components/templates-productos/template-s/page-pim-template-s'
import { PagePimTemplateM } from './components/templates-productos/template-m/page-pim-template-m'
import { PagePimTemplateL } from './components/templates-productos/template-l/page-pim-template-l'
import { PagePimTemplateXL } from './components/templates-productos/template-xl/page-pim-template-xl'
import { PagePimTemplateMobile } from './components/templates-productos/template-mobile/page-pim-template-mobile'
import { PageVerCatalogoFlipComponent } from './pages/page-ver-catalogo-flip/page-ver-catalogo-flip.component'
import { PageVerNewsletterComponent } from './pages/page-ver-newsletter/page-ver-newsletter.component'
// Components
import { TemplatePortadaComponent } from './components/template-portada/template-portada.component'
import { TemplateUnProductoComponent } from './components/template-un-producto/template-un-producto.component'
import { TemplateProductosHorizontalComponent } from './components/template-productos-horizontal/template-productos-horizontal.component'
import { TemplateTablaProductosComponent } from './components/template-tabla-productos/template-tabla-productos.component'
import { TemplateProductosVerticalComponent } from './components/template-productos-vertical/template-productos-vertical.component'
import { IconSvgComponent } from './components/icon-svg/icon-svg.component'
import { HeaderCatalogoComponent } from './components/header-catalogo/header-catalogo.component'
import { FooterCatalogoComponent } from './components/footer-catalogo/footer-catalogo.component'
import { ProductoVerticalComponent } from './components/producto-vertical/producto-vertical.component'
import { TemplateProductosDinamicoComponent } from './components/template-productos-dinamico/template-productos-dinamico.component'
import { ProductosCatalogTvComponent } from './components/productos-catalog-tv/productos-catalog-tv.component'
import { TemplateCardProductoTvComponent } from './components/template-card-producto-tv/template-card-producto-tv.component'
import { TemplateCardVideoTvComponent } from './components/template-card-video-tv/template-card-video-tv.component'
import { TemplateCardImagenesTvComponent } from './components/template-card-imagenes-tv/template-card-imagenes-tv.component'
import { TemplateCardFooterTvComponent } from './components/template-card-footer-tv/template-card-footer-tv.component'
import { TemplateMenuCatalogoComponent } from './components/template-menu-catalogo/template-menu-catalogo.component'

@NgModule({
  declarations: [
    PageCatalogoComponent,
    PageVerCatalogoComponent,
    TemplatePortadaComponent,
    TemplateUnProductoComponent,
    TemplateTablaProductosComponent,
    TemplateProductosHorizontalComponent,
    TemplateProductosVerticalComponent,
    IconSvgComponent,
    HeaderCatalogoComponent,
    FooterCatalogoComponent,
    ProductoVerticalComponent,
    TemplateProductosDinamicoComponent,
    ProductosCatalogTvComponent,
    PagePimTemplateS,
    PagePimTemplateM,
    PagePimTemplateL,
    PagePimTemplateXL,
    PagePimTemplateMobile,
    PageVerCatalogoFlipComponent,
    TemplateCardProductoTvComponent,
    TemplateCardVideoTvComponent,
    TemplateCardImagenesTvComponent,
    TemplateCardFooterTvComponent,
    TemplateMenuCatalogoComponent,
    PageVerNewsletterComponent,
  ],
  imports: [
    CarouselModule.forRoot(),
    CommonModule,
    CatalogoRoutingModule,
    SharedModule,
    HeaderModule,
    MobileModule,
  ],
})
export class CatalogoModule {}
