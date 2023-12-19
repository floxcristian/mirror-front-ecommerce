// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LayoutComponent } from '../layout/layout.component';
// Routing
import { CatalogoRoutingModule } from '../modules/catalogo/catalogo-routing.module';
// Pages
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { PageHomeOneComponent } from '../pages/page-home-one/page-home-one.component';
import { PageSpecialsComponent } from '../pages/page-specials/page-specials.component';

import { AuthGuard } from '../core/guards/auth.guard';
import { PageDevolucionesComponent } from '../pages/page-devoluciones/page-devoluciones.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio',
  },

  {
    path: 'devoluciones',
    component: PageDevolucionesComponent,
  },
  {
    path: 'carro-compra',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    loadChildren: () =>
      import('../modules/cart/page-cart.module').then((m) => m.ShopModule),
  },
  {
    path: 'inicio',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: '',
        component: PageHomeOneComponent,
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('../modules/shop/shop.module').then((m) => m.ShopModule),
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
  {
    path: 'especial',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: '**',
        component: PageSpecialsComponent,
      },
    ],
  },
  {
    path: 'mi-cuenta',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/account/account.module').then(
            (m) => m.AccountModule
          ),
      },
    ],
  },
  {
    path: 'sitio',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../modules/site/site.module').then((m) => m.SiteModule),
      },
    ],
  },
  {
    path: 'tiendas',
    redirectTo: 'sitio/tiendas',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },

  {
    path: '',
    component: LayoutComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: 'not-found',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CatalogoRoutingModule],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
