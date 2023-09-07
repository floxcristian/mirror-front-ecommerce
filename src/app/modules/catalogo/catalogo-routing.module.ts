import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCatalogoComponent } from './pages/page-catalogo/page-catalogo.component';
import { PageVerCatalogoComponent } from './pages/page-ver-catalogo/page-ver-catalogo.component';
import { B2cComponent } from '../../layout/b2c/b2c.component';
import { PageEsperaCdComponent } from './pages/page-espera-cd/page-espera-cd.component';
import { PageVerCatalogoFlipComponent } from './pages/page-ver-catalogo-flip/page-ver-catalogo-flip.component';
import { PageCatalogoTvDinamicComponent } from './pages/page-catalogo-tv-dinamic/page-catalogo-tv-dinamic.component';
import { PageVerNewsletterComponent } from './pages/page-ver-newsletter/page-ver-newsletter.component';

const routes: Routes = [
  {
    path: 'catalogos',
    component: B2cComponent,
    data: {
      headerLayout: 'classic'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listado-catalogos'
      },
      {
        path: 'listado-catalogos',
        component: PageCatalogoComponent
      }
    ]
  },
  {
    path: 'catalogos/ver-catalogo',
    component: PageVerCatalogoComponent
  },
  {
    path: 'catalogos/ver-catalogo-flip',
    component: PageVerCatalogoFlipComponent
  },
  {
    path: 'catalogos/catalogo-tv',
    component: PageCatalogoTvDinamicComponent
  },
  {
    path: 'catalogos/catalogo-tv/:tipo',
    component: PageCatalogoTvDinamicComponent
  },
  {
    path: 'catalogos/espera-cd',
    component: PageEsperaCdComponent
  },
  {
    path: 'catalogos/espera-cd/:tipo',
    component: PageEsperaCdComponent
  },
  {
    path: 'catalogos/news',
    component: PageVerNewsletterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule {}
