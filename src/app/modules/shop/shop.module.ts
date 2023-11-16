// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Libs
import { NgSelectModule } from '@ng-select/ng-select';
// Routing
import { ShopRoutingModule } from './shop-routing.module';
// Modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { HeaderModule } from '../header/header.module';
// Pages
import { PageProductComponent } from './pages/page-product/page-product.component';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
// Components
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { DescripcionComponent } from './components/descripcion/descripcion.component';
import { MapaFichasComponent } from './components/despacho/mapa-fichas/mapa-fichas.component';
import { DespachoComponent } from './components/despacho/despacho.component';
import { DetalleTecnicosComponent } from './components/detalle-tecnicos/detalle-tecnicos.component';
import { FechasPromesasComponent } from './components/fechas-promesas/fechas-promesas.component';

//shared
import { ProductComponent } from '../../shared/components/product/product.component';
import { ProductStockComponent } from '../../shared/components/product-stock/product-stock.component';

@NgModule({
  declarations: [
    PageCategoryComponent,
    PageProductComponent,
    ProductComponent,
    ProductStockComponent,
    DescripcionComponent,
    DespachoComponent,
    FechasPromesasComponent,
    MapaFichasComponent,
    DetalleTecnicosComponent,
    ComentariosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlocksModule,
    SharedModule,
    ShopRoutingModule,
    WidgetsModule,
    NgSelectModule,
    HeaderModule,
  ],
})
export class ShopModule {}
