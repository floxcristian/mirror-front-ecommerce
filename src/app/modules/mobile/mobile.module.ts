import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from '../../shared/shared.module';

// components
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MobileLinksComponent } from './components/mobile-links/mobile-links.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { MobileCategoriasComponent } from './components/mobile-categorias/mobile-categorias.component';
import { MobileHeaderAccountComponent } from './components/mobile-header-account/mobile-header-account.component';
import { TopbarMobileComponent } from '../header/components/topbar-mobile/topbar-mobile.component';
import { MobileHeaderB2bComponent } from './components/mobile-header-b2b/mobile-header-b2b.component';
import { MobileFiltrosComponent } from './components/mobile-header-b2b/components/mobile-filtros/mobile-filtros.component';
import { MobileBarraBusquedaComponent } from './components/mobile-header-b2b/components/mobile-barra-busqueda/mobile-barra-busqueda.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    // components
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
    // modules (angular)
    CommonModule,
    RouterModule,
    // modules
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    // components
    MobileHeaderComponent,
    MobileMenuComponent,
    MobileHeaderB2bComponent,
  ],
})
export class MobileModule {}
