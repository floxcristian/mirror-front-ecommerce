// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Libs
//import { LocalStorageModule } from 'angular-2-local-storage'; // No se usa
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Routing
import { AuthRoutingModule } from './auth-routing.module';
// Modules
import { BlocksModule } from '../modules/blocks/blocks.module';
import { HeaderModule } from '../modules/header/header.module';
// import { HeaderB2bModule } from '../modules/account/components/header/header-b2b.module';
import { FooterModule } from '../modules/footer/footer.module';
import { MobileModule } from '../modules/mobile/mobile.module';
import { SharedModule } from '../shared/shared.module';
// import { CatalogoModule } from '../modules/catalogo/catalogo.module';
import { WidgetsModule } from '../modules/widgets/widgets.module';
// Components
import { PageHomeOneComponent } from '../pages/page-home-one/page-home-one.component';
// import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
// import { PageRegistroComponent } from '../pages/page-registro/page-registro.component';
// import { PageSpecialsComponent } from '../pages/page-specials/page-specials.component';
// import { PageMesDelCamioneroComponent } from '../pages/page-mes-del-camionero/page-mes-del-camionero.component';
// import { PageCyberComponent } from './../pages/page-cyber/page-cyber.component';
// import { PageMesAniversarioComponent } from '../pages/page-mes-aniversario/page-mes-aniversario.component';
import { LayoutComponent } from '../layout/layout.component';
import { B2bComponent } from '../layout/b2b/b2b.component';
import { B2cComponent } from '../layout/b2c/b2c.component';
import { VerificarpagoComponent } from './pages/verificarpago/verificarpago.component';
import { PageCiberdayFormComponent } from './pages/page-ciberday-form/page-ciberday-form.component';
import { RegistroOkModalComponent } from '../pages/components/registro-ok-modal/registro-ok-modal.component';
import { RouterModule } from '@angular/router';
import { FooterB2cModule } from '../modules/footer-b2c/footer-b2c.module';
import { PageHomeCmsModule } from '../modules/page-home-cms/page-home-cms.module';

// import { PageDevolucionesComponent } from '../pages/page-devoluciones/page-devoluciones.component';
// import { DevolucionOkModalComponent } from '../pages/components/devolucion-ok-modal/devolucion-ok-modal.component';
// import { PageConcursoGiftcardComponent } from '../pages/page-concurso-giftcard/page-concurso-giftcard.component';
// import { ConcursoGiftcardOkModalComponent } from '../pages/components/concurso-giftcard-ok-modal/concurso-giftcard-ok-modal.component';
// import { PageMesDelCamionero23Component } from '../pages/page-mes-del-camionero23/page-mes-del-camionero23.component';

@NgModule({
  declarations: [
    PageCiberdayFormComponent,
    // pages
    PageHomeOneComponent,
    // PageNotFoundComponent,
    // PageRegistroComponent,
    // PageSpecialsComponent,
    // PageMesDelCamioneroComponent,
    // PageMesAniversarioComponent,
    RegistroOkModalComponent,
    B2bComponent,
    B2cComponent,
    LayoutComponent,
    VerificarpagoComponent,

    // PageCyberComponent,
    // PageDevolucionesComponent,
    // DevolucionOkModalComponent,
    // PageConcursoGiftcardComponent,
    // ConcursoGiftcardOkModalComponent,
    // PageMesDelCamionero23Component
  ],
  imports: [
    AuthRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    /*LocalStorageModule.forRoot({
      prefix: 'ImplementosB2B',
      storageType: 'localStorage',
    }),*/
    // modules (third-party)
    ToastrModule.forRoot(),
    // modules
    BlocksModule,
    HeaderModule,
    // HeaderB2bModule,
    FooterModule,
    FooterB2cModule,
    MobileModule,

    // CatalogoModule,
    WidgetsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule,
    TooltipModule.forRoot(),
    PageHomeCmsModule,
    SharedModule,
  ],
})
export class AuthModule {}
