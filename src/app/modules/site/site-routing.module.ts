// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageContactUsComponent } from './pages/page-contact-us/page-contact-us.component';
import { PageContactUsAltComponent } from './pages/page-contact-us-alt/page-contact-us-alt.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { PagePolicyComponent } from './pages/page-policy/page-policy.component';
import { PageStoresComponent } from './pages/page-stores/page-stores.component';
import { PageSelectCatalogComponent } from './pages/page-select-catalog/page-select-catalog.component';
import { PageRecoveringComponent } from './pages/page-recover/page-recover.component';
import { PageRecoveringChangeComponent } from './pages/page-recover-change/page-recover-change.component';
import { PageFaqComponent } from './pages/page-faq/page-faq.component';
import { PageComponentsComponent } from './pages/page-components/page-components.component';
import { PageTypographyComponent } from './pages/page-typography/page-typography.component';
import { PageBlogComponent } from './pages/page-blog/page-blog.component';
import { PageInicioSesionComponent } from './pages/page-inicio-sesion/page-inicio-sesion.component';
import { PageRegistroUsuarioComponent } from './pages/page-registro-usuario/page-registro-usuario.component';
import { PageBasesConcursoComponent } from './pages/page-bases-concurso/page-bases-concurso.component';
import { PageRegistroUsuarioB2BComponent } from './pages/page-registro-usuario-b2b/page-registro-usuario-b2b.component';
import { PagePoliticasImplementosComponent } from './pages/page-politicas-implementos/page-politicas-implementos.component';
import { DetailNewsComponent } from './components/detail-news/detail-news.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'acerca-de-nosotros',
  },
  {
    path: 'acerca-de-nosotros',
    component: PageAboutUsComponent,
  },
  {
    path: 'contacto',
    component: PageContactUsComponent,
  },
  {
    path: 'contact-us-alt',
    component: PageContactUsAltComponent,
  },
  {
    path: 'termino-y-condiciones',
    component: PageTermsComponent,
  },
  {
    path: 'politicas-de-privacidad',
    component: PagePolicyComponent,
  },
  {
    path: 'politicas/:tipo',
    component: PagePoliticasImplementosComponent,
  },

  {
    path: 'tiendas',
    component: PageStoresComponent,
  },
  {
    path: 'catalogos-zonas',
    component: PageSelectCatalogComponent,
  },
  {
    path: 'recover',
    component: PageRecoveringComponent,
  },
  {
    path: 'change/:id',
    component: PageRecoveringChangeComponent,
  },
  {
    path: 'faq',
    component: PageFaqComponent,
  },
  {
    path: 'components',
    component: PageComponentsComponent,
  },
  {
    path: 'typography',
    component: PageTypographyComponent,
  },
  {
    path: 'blog',
    component: PageBlogComponent,
  },
  {
    path: 'iniciar-sesion',
    component: PageInicioSesionComponent,
  },
  {
    path: 'registro-usuario',
    component: PageRegistroUsuarioComponent,
  },
  {
    path: 'registro-usuario-b2b',
    component: PageRegistroUsuarioB2BComponent,
  },
  {
    path: 'detail-news/:id',
    component: DetailNewsComponent,
  },
  {
    path: 'bases-concurso',
    component: PageBasesConcursoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutingModule {}
