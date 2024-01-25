// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Pages
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PageProductComponent } from './pages/page-product/page-product.component';

const routes: Routes = [
  {
    path: '',
    component: PageCategoryComponent,
  },
  {
    path: 'ficha/:id',
    component: PageProductComponent,
    data: {
      layout: 'standard',
    },
  },
  {
    path: 'ficha/:id/:firstCategory',
    component: PageProductComponent,
    data: {
      layout: 'standard',
    },
  },

  {
    path: 'ficha/:id/:firstCategory/:secondCategory',
    component: PageProductComponent,
    data: {
      layout: 'standard',
    },
  },
  {
    path: 'ficha/:id/:firstCategory/:secondCategory/:thirdCategory',
    component: PageProductComponent,
    data: {
      layout: 'standard',
    },
  },
  {
    path: ':busqueda/:metodo/:nombre',
    component: PageCategoryComponent,
  },
  {
    path: ':busqueda/:metodo/:nombre/:secondCategory',
    component: PageCategoryComponent,
  },
  {
    path: ':busqueda/:metodo/:nombre/:secondCategory/:thirdCategory',
    component: PageCategoryComponent,
  },
  {
    path: ':busqueda',
    component: PageCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
