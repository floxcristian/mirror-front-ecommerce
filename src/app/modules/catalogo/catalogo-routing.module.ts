// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Pages
import { PageCatalogoComponent } from './pages/page-catalogo/page-catalogo.component';
import { PageVerCatalogoComponent } from './pages/page-ver-catalogo/page-ver-catalogo.component';
import { PageVerCatalogoFlipComponent } from './pages/page-ver-catalogo-flip/page-ver-catalogo-flip.component';
import { PageVerNewsletterComponent } from './pages/page-ver-newsletter/page-ver-newsletter.component';
// Components
import { B2cComponent } from '../../layout/b2c/b2c.component';

const routes: Routes = [
  {
    path: 'catalogos',
    component: B2cComponent,
    data: {
      headerLayout: 'classic',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listado-catalogos',
      },
      {
        path: 'listado-catalogos',
        component: PageCatalogoComponent,
      },
    ],
  },
  {
    path: 'catalogos/ver-catalogo',
    component: PageVerCatalogoComponent,
  },
  {
    path: 'catalogos/ver-catalogo-flip',
    component: PageVerCatalogoFlipComponent,
  },
  {
    path: 'catalogos/news',
    component: PageVerNewsletterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoRoutingModule {}
