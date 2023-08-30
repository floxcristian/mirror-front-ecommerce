import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';
import { WidgetsModule } from '../widgets/widgets.module';

// pages

import { PageProductComponent } from './pages/page-product/page-product.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageCategoryComponent } from './pages/page-category/page-category.component';

// Ficha Producto

//import { ProductComponent } from '../../shared/components/product/product.component';
import { ProductStockComponent } from '../../shared/components/product-stock/product-stock.component';
import { ProductTabsComponent } from './components/product-tabs/product-tabs.component';
//import { ProductLineBossComponent } from '../../shared/components/product-line-boss/product-line-boss.component';

//import { QuickviewComponent } from '../../shared/components/quickview/quickview.component';
//import { RatingComponent } from '../../shared/components/rating/rating.component';
import { HeaderModule } from '../header/header.module';
import { DescripcionComponent } from './components/descripcion/descripcion.component';
import { DespachoComponent } from './components/despacho/despacho.component';
import { FechasPromesasComponent } from './components/fechas-promesas/fechas-promesas.component';

import { MapaFichasComponent } from './components/despacho/mapa-fichas/mapa-fichas.component';
import { DetalleTecnicosComponent } from './components/detalle-tecnicos/detalle-tecnicos.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [
    /*PageCategoryComponent,
    PageProductComponent,*/
    //ProductComponent,
    ProductStockComponent,
    ProductTabsComponent,
    /*ProductLineBossComponent,

    // Evaluar si se van a ocupar sino eliminar
    QuickviewComponent,
    RatingComponent,*/
    DescripcionComponent,
    /*DespachoComponent,*/
    FechasPromesasComponent,
    /*
    MapaFichasComponent,
*/
    DetalleTecnicosComponent,
    ComentariosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    /*BlocksModule,*/
    SharedModule,
    ShopRoutingModule,
    //WidgetsModule,
    NgSelectModule,
    /*FooterModule,
    HeaderModule,*/
  ],
})
export class ShopModule {}
