// Angular
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
// Routing
import { RouterModule } from '@angular/router';
// Components
import { FooterB2cComponent } from './footer-b2c.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { HoldingEpysaComponent } from './components/holding-epysa/holding-epysa.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { ContactanosComponent } from './components/contactenos/contactanos.component';
import { FotterSiteMobileComponent } from './components/fotter-site-mobile/fotter-site-mobile.component';

@NgModule({
  declarations: [
    FooterB2cComponent,
    FotterSiteMobileComponent,
    SobreNosotrosComponent,
    HoldingEpysaComponent,
    MiCuentaComponent,
    ContactanosComponent,
  ],
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  exports: [FooterB2cComponent],
})
export class FooterB2cModule {}
