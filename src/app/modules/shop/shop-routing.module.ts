// Angular
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Pages
import { PageCategoryComponent } from './pages/page-category/page-category.component'
import { PageProductComponent } from './pages/page-product/page-product.component'

const routes: Routes = [
  {
    path: '',
    component: PageCategoryComponent,
    data: {
      columns: 3,
      viewMode: 'grid',
      sidebarPosition: 'start',
    },
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
    data: {
      layout: 'standard',
    },
  },
  {
    path: ':busqueda/:metodo/:nombre/:secondCategory',
    component: PageCategoryComponent,
    data: {
      layout: 'standard',
    },
  },
  {
    path: ':busqueda/:metodo/:nombre/:secondCategory/:thirdCategory',
    component: PageCategoryComponent,
    data: {
      layout: 'standard',
    },
  },
  {
    path: ':busqueda',
    component: PageCategoryComponent,
    data: {
      layout: 'standard',
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
