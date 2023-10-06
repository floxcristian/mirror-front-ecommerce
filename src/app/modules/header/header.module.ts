// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Libs
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DataTablesModule } from 'angular-datatables';
// Modules
import { SharedModule } from '../../shared/shared.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { BlocksModule } from '../blocks/blocks.module';
// Components
import { AccountComponent } from './components/account/account.component';

// FIXME: revisar
import { DepartmentsComponent } from './components/departments/departments.component';
// FIXME: No tiene logica...
import { MegamenuComponent } from './components/megamenu/megamenu.component';
// FIXME: No se invoca
import { LinksComponent } from './components/links/links.component';

import { DropcartComponent } from './components/dropcart/dropcart.component';
import { HeaderComponent } from './header.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuCategoriasB2cComponent } from './components/menu-categorias-b2c/menu-categorias-b2c.component';
import { Nivel2Component } from './components/menu-categorias-b2c/components/nivel2/nivel2.component';
import { Nivel3Component } from './components/menu-categorias-b2c/components/nivel3/nivel3.component';
import { MenuCategoriaB2cMobileComponent } from './components/menu-categorias-b2c/menu-categoria-b2c-mobile/menu-categoria-b2c-mobile.component';
import { MobileSearchComponent } from './components/mobile-search/mobile-search.component';
import { ModalStoresComponent } from './components/modal-stores/modal-stores.component';
import { SearchComponent } from './components/search/search.component';
import { TopbarComponent } from './components/topbar/topbar.component';

//B2B
import { SearchVinB2bComponent } from './components/search-vin-b2b/search-vin-b2b.component';
import { BusquedasRecientesModalComponent } from './components/search-vin-b2b/components/barra-busqueda/components/busquedas-recientes-modal/busquedas-recientes-modal.component';
import { BarraBusquedaComponent } from './components/search-vin-b2b/components/barra-busqueda/barra-busqueda.component';
import { DireccionDespachoComponent } from './components/search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { FiltrosComponent } from './components/search-vin-b2b/components/filtros/filtros.component';

@NgModule({
  declarations: [
    // components
    DepartmentsComponent,
    DropcartComponent,
    HeaderComponent,
    LinksComponent,
    MegamenuComponent,
    MenuComponent,
    SearchComponent,
    TopbarComponent,
    ModalStoresComponent,
    AccountComponent,
    SearchVinB2bComponent,
    FiltrosComponent,
    MobileSearchComponent,
    DireccionDespachoComponent,
    BarraBusquedaComponent,
    BusquedasRecientesModalComponent,
    MenuCategoriasB2cComponent,
    MenuCategoriaB2cMobileComponent,
    Nivel2Component,
    Nivel3Component,
  ],
  imports: [
    // modules (angular)
    CommonModule,
    RouterModule,
    // modules
    SharedModule,
    FormsModule,
    BlocksModule,
    WidgetsModule,
    NgSelectModule,
    DataTablesModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
  ],
  exports: [
    // components
    HeaderComponent,
    MenuComponent,
    MegamenuComponent,
    ModalStoresComponent,
    SearchVinB2bComponent,
    MobileSearchComponent,
    TopbarComponent,
    SearchComponent,
    DropcartComponent,
    FiltrosComponent,
    MenuCategoriasB2cComponent,
    MenuCategoriaB2cMobileComponent,
  ],
})
export class HeaderModule {}
