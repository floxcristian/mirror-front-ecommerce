// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Routing
import { SiteRoutingModule } from './site-routing.module';
// Modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
// Pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageContactUsComponent } from './pages/page-contact-us/page-contact-us.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { PagePolicyComponent } from './pages/page-policy/page-policy.component';
import { PageStoresComponent } from './pages/page-stores/page-stores.component';
import { PageSelectCatalogComponent } from './pages/page-select-catalog/page-select-catalog.component';
import { PageRecoveringComponent } from './pages/page-recover/page-recover.component';
import { PageRecoveringChangeComponent } from './pages/page-recover-change/page-recover-change.component';
import { PageBlogComponent } from './pages/page-blog/page-blog.component';
import { PagePoliticasImplementosComponent } from './pages/page-politicas-implementos/page-politicas-implementos.component';
import { PageBasesConcursoComponent } from './pages/page-bases-concurso/page-bases-concurso.component';
import { PageRegistroUsuarioB2BComponent } from './pages/page-registro-usuario-b2b/page-registro-usuario-b2b.component';
import { PageRegistroUsuarioComponent } from './pages/page-registro-usuario/page-registro-usuario.component';
// Components
import { ColapseComponent } from './components/colapse/colapse.component';
import { PageInicioSesionComponent } from './pages/page-inicio-sesion/page-inicio-sesion.component';
import { DetailNewsComponent } from './components/detail-news/detail-news.component';
import { HeaderBlogComponent } from './components/header-blog/header-blog.component';
import { Registerb2bComponent } from '../../shared/components/register-b2b/register-b2b.component';

@NgModule({
  declarations: [
    PageAboutUsComponent,
    PageContactUsComponent,
    PageTermsComponent,
    PagePolicyComponent,
    PageStoresComponent,
    PageSelectCatalogComponent,
    PageRecoveringComponent,
    PageRecoveringChangeComponent,
    ColapseComponent,
    PageBlogComponent,
    PageInicioSesionComponent,
    DetailNewsComponent,
    HeaderBlogComponent,
    PageRegistroUsuarioComponent,
    PageRegistroUsuarioB2BComponent,
    Registerb2bComponent,
    PageBasesConcursoComponent,
    PagePoliticasImplementosComponent,
  ],
  imports: [
    CommonModule,
    BlocksModule,
    SharedModule,
    SiteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
  ],
})
export class SiteModule {}
