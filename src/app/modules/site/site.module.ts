import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';


// modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';

// pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageComponentsComponent } from './pages/page-components/page-components.component';
import { PageContactUsAltComponent } from './pages/page-contact-us-alt/page-contact-us-alt.component';
import { PageContactUsComponent } from './pages/page-contact-us/page-contact-us.component';
import { PageFaqComponent } from './pages/page-faq/page-faq.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { PagePolicyComponent } from './pages/page-policy/page-policy.component';
import { PageStoresComponent } from './pages/page-stores/page-stores.component';
import { PageSelectCatalogComponent } from './pages/page-select-catalog/page-select-catalog.component';
import { PageRecoveringComponent } from './pages/page-recover/page-recover.component';
import { PageRecoveringChangeComponent } from './pages/page-recover-change/page-recover-change.component';
import { PageTypographyComponent } from './pages/page-typography/page-typography.component';
import { ColapseComponent } from './components/colapse/colapse.component';
import { PageBlogComponent } from './pages/page-blog/page-blog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageInicioSesionComponent } from './pages/page-inicio-sesion/page-inicio-sesion.component';
import { DetailNewsComponent } from './components/detail-news/detail-news.component';
import { HeaderBlogComponent } from './components/header-blog/header-blog.component';
import { FooterBlogComponent } from './components/footer-blog/footer-blog.component';
import { PageRegistroUsuarioComponent } from './pages/page-registro-usuario/page-registro-usuario.component';
import { PageRegistroUsuarioB2BComponent } from './pages/page-registro-usuario-b2b/page-registro-usuario-b2b.component';
import { Registerb2bComponent } from '../../shared/components/register-b2b/register-b2b.component';
import { PageBasesConcursoComponent } from './pages/page-bases-concurso/page-bases-concurso.component';
import { PagePoliticasImplementosComponent } from './pages/page-politicas-implementos/page-politicas-implementos.component';



@NgModule({
    declarations: [
        // pages
        PageAboutUsComponent,
        PageComponentsComponent,
        PageContactUsAltComponent,
        PageContactUsComponent,
        PageFaqComponent,
        PageTermsComponent,
        PagePolicyComponent,
        PageStoresComponent,
        PageSelectCatalogComponent,
        PageRecoveringComponent,
        PageRecoveringChangeComponent,
        PageTypographyComponent,
        ColapseComponent,
        PageBlogComponent,
        PageInicioSesionComponent,
        DetailNewsComponent,
        HeaderBlogComponent,
        FooterBlogComponent,
        PageRegistroUsuarioComponent,
        PageRegistroUsuarioB2BComponent,
        Registerb2bComponent,
        PageBasesConcursoComponent,
        PagePoliticasImplementosComponent,
    ],
    imports: [
        // modules (angular)
        CommonModule,
        // modules
        BlocksModule,
        SharedModule,
        SiteRoutingModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class SiteModule { }
