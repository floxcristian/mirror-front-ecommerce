// Angular
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
// Libs
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
// Modules
import { SharedModule } from '../../shared/shared.module'
import { HeaderModule } from '../header/header.module'
// Components
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component'
import { MobileCategoriasComponent } from './components/mobile-categorias/mobile-categorias.component'
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component'
import { MobileHeaderAccountComponent } from './components/mobile-header-account/mobile-header-account.component'
import { MobileLinksComponent } from './components/mobile-links/mobile-links.component'
import { TopbarMobileComponent } from '../header/components/topbar-mobile/topbar-mobile.component'
//B2B
import { MobileHeaderB2bComponent } from './components/mobile-header-b2b/mobile-header-b2b.component'
import { MobileFiltrosComponent } from './components/mobile-header-b2b/components/mobile-filtros/mobile-filtros.component'
import { MobileBarraBusquedaComponent } from './components/mobile-header-b2b/components/mobile-barra-busqueda/mobile-barra-busqueda.component'

@NgModule({
  declarations: [
    MobileHeaderComponent,
    MobileLinksComponent,
    MobileMenuComponent,
    MobileCategoriasComponent,
    MobileHeaderAccountComponent,
    TopbarMobileComponent,
    MobileHeaderB2bComponent,
    MobileFiltrosComponent,
    MobileBarraBusquedaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    MobileHeaderComponent,
    MobileMenuComponent,
    MobileHeaderB2bComponent,
  ],
})
export class MobileModule {}
