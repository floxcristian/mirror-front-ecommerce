// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Guards
import { GraciasPorTuCompraGuard } from './guards/gracias-por-tu-compra/gracias-por-tu-compra.guard';
// Pages
import { PageCartComponent } from '../cart/page/page-cart/page-cart.component';
import { PageCartShippingComponent } from '../cart/page/page-cart-shipping/page-cart-shipping.component';
import { PageCartPaymentMethodComponent } from '../cart/page/page-cart-payment-method/page-cart-payment-method.component';
import { PageCartOvSuccessComponent } from '../cart/page/page-cart-ov-success/page-cart-ov-success.component';
import { PageCartCoSuccessComponent } from './page/page-cart-co-success/page-cart-co-success.component';
import { PageCartRequestSuccessComponent } from './page/page-cart-request-success/page-cart-request-success.component';
import { PageDownloadpdfComponent } from './page/page-downloadpdf/page-downloadpdf.component';
import { PageOmniCartPaymentMethodComponent } from './page/page-omni-cart-payment-method/page-omni-cart-payment-method.component';
import { PagesCartPaymentOcComponent } from './page/pages-cart-payment-oc/pages-cart-payment-oc.component';
import { PageOmniCartOvSuccessComponent } from './page/page-omni-cart-ov-success/page-omni-cart-ov-success.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'resumen',
  },
  {
    path: 'resumen',
    component: PageCartComponent,
  },
  {
    path: 'metodo-de-envio',
    component: PageCartShippingComponent,
  },
  {
    path: 'forma-de-pago',
    component: PageCartPaymentMethodComponent,
  },
  {
    path: 'omni-forma-de-pago',
    component: PageOmniCartPaymentMethodComponent,
  },
  {
    path: 'comprobante-de-pago',
    component: PageCartOvSuccessComponent,
  },
  {
    path: 'comprobante-de-pago/:numeroOv',
    component: PageCartOvSuccessComponent,
  },
  {
    path: 'comprobante-de-cotizacion/:numero',
    component: PageCartCoSuccessComponent,
  },
  {
    path: 'comprobante-de-solicitud',
    component: PageCartRequestSuccessComponent,
  },
  {
    path: 'downloadpdf',
    component: PageDownloadpdfComponent,
  },
  {
    path: 'gracias-por-tu-compra',
    canActivate: [GraciasPorTuCompraGuard],
    component: PageCartOvSuccessComponent,
  },
  {
    path: 'omni-gracias-por-tu-compra',
    canActivate: [GraciasPorTuCompraGuard],
    component: PageOmniCartOvSuccessComponent,
  },
  {
    path: 'confirmar-orden-oc',
    component: PagesCartPaymentOcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
