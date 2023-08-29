// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LayoutComponent } from '../layout/layout.component';
// Routing
// import { CatalogoRoutingModule } from '../modules/catalogo/catalogo-routing.module';
// Pages
// import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { PageHomeOneComponent } from '../pages/page-home-one/page-home-one.component';
// import { PageSpecialsComponent } from '../pages/page-specials/page-specials.component';
// import { PageRegistroComponent } from '../pages/page-registro/page-registro.component';
// import { PageMesDelCamioneroComponent } from '../pages/page-mes-del-camionero/page-mes-del-camionero.component';
// import { PageMesAniversarioComponent } from '../pages/page-mes-aniversario/page-mes-aniversario.component';
// import { PageCyberComponent } from '../pages/page-cyber/page-cyber.component';
// import { VerificarpagoComponent } from './pages/verificarpago/verificarpago.component';
import { PageCiberdayFormComponent } from './pages/page-ciberday-form/page-ciberday-form.component';
import { AuthGuard } from '../core/guards/auth.guard';
// import { PageDevolucionesComponent } from '../pages/page-devoluciones/page-devoluciones.component';
// import { PageConcursoGiftcardComponent } from '../pages/page-concurso-giftcard/page-concurso-giftcard.component';
// import { PageMesDelCamionero23Component } from '../pages/page-mes-del-camionero23/page-mes-del-camionero23.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio',
  },
  // {
  //     path: 'registro',
  //     component: PageRegistroComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     }
  // },
  // {
  //     path: 'mes-del-camionero',
  //     component: PageMesDelCamioneroComponent
  // },
  {
    path: 'implementos-cyberday',
    component: PageCiberdayFormComponent,
  },
  // {
  //     path: 'mes-aniversario',
  //     component: PageMesAniversarioComponent
  // },
  // {
  //     path: 'cyber-implementos',
  //     component: PageCyberComponent
  // },
  // {
  //     path: 'devoluciones',
  //     component: PageDevolucionesComponent
  // },
  // {
  //     path: 'concurso-giftcard',
  //     component: PageConcursoGiftcardComponent
  // },
  // {
  //     path: 'mes-del-camionero-23',
  //     component: PageMesDelCamionero23Component
  // },
  // {
  //     path: 'verificar-pago',
  //     component: VerificarpagoComponent
  // },

  // {
  //     path: 'carro-compra',
  //     component: LayoutComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     },
  //     loadChildren: () => import('../modules/cart/page-cart.module').then(m => m.ShopModule)
  // },
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
      // {
      //     path: 'productos',
      //     loadChildren: () => import('../modules/shop/shop.module').then(m => m.ShopModule)
      // },
      // {
      //     path: 'mi-cuenta',
      //     loadChildren: () => import('../modules/account/account.module').then(m => m.AccountModule)
      // },
      // {
      //     path: 'page-home-cms',
      //     loadChildren: () => import('../modules/page-home-cms/page-home-cms.module').then(m => m.PageHomeCmsModule)
      // },
      // {
      //     path: '**',
      //     component: PageNotFoundComponent
      // }
    ],
  },
  // {
  //     path: 'especial',
  //     component: LayoutComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     },
  //     children: [
  //         {
  //             path: '**',
  //             component: PageSpecialsComponent
  //         }
  //     ]
  // },
  // {
  //     path: 'mi-cuenta',
  //     component: LayoutComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     },
  //     children: [
  //         {
  //             path: '',
  //             canActivate: [AuthGuard],
  //             loadChildren: () => import('../modules/account/account.module').then(m => m.AccountModule)
  //         }
  //     ]
  // },
  // {
  //     path: 'sitio',
  //     component: LayoutComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     },
  //     children: [
  //         {
  //             path: '',
  //             loadChildren: () => import('../modules/site/site.module').then(m => m.SiteModule)
  //         }
  //     ]
  // },
  // {
  //     path: 'tiendas',
  //     redirectTo: 'sitio/tiendas'
  // },
  // {
  //     path: '**',
  //     redirectTo: 'not-found'
  // },

  // {
  //     path: '',
  //     component: LayoutComponent,
  //     data: {
  //         headerLayout: 'classic'
  //     },
  //     children: [
  //         {
  //             path: 'not-found',
  //             component: PageNotFoundComponent
  //         }
  //     ]
  // }
];

@NgModule({
  // imports: [RouterModule.forChild(routes), CatalogoRoutingModule],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
