import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { CartRoutingModule } from './page-cart-routing.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { PageCartComponent } from './page/page-cart/page-cart.component';
import { PageCartShippingComponent } from '../cart/page/page-cart-shipping/page-cart-shipping.component';
import { PageCartPaymentMethodComponent } from '../cart/page/page-cart-payment-method/page-cart-payment-method.component';
import { PageCartOvSuccessComponent } from '../cart/page/page-cart-ov-success/page-cart-ov-success.component';
import { DetalleCarroProductosComponent } from './components/detalle-carro-productos/detalle-carro-productos.component';
import { PageCartCoSuccessComponent } from './page/page-cart-co-success/page-cart-co-success.component';
import { PageCartRequestSuccessComponent } from './page/page-cart-request-success/page-cart-request-success.component';
import { ProductsListSummaryCartComponent } from './components/products-list-sumarry-cart/products-list-summary-cart.component';
import { AddAddressComponent } from '../../shared/components/add-address/add-address.component';
import { GuidedStepsComponent } from '../../shared/components/guided-steps/guided-steps.component';
// import { LoginRegisterComponent } from '../../shared/components/login-register/login-register.component'
// import { RegisterAddressComponent } from '../../shared/components/register-address/register-address.component'
// import { RegisterVisitComponent } from '../../shared/components/register-visit/register-visit.component'
// import { RegisterReceptionComponent } from '../../shared/components/register-reception/register-reception.component'
import { PageCartHomeComponent } from './page/page-cart-home/page-cart-home.component';
import { HeaderModule } from '../header/header.module';
import { GrupoDetalleFechasComponent } from './components/grupo-detalle-fechas/grupo-detalle-fechas.component';
import { GrupoDetalleProductosComponent } from './components/grupo-detalle-productos/grupo-detalle-productos.component';
import { GrupoDetalleFechaMobileComponent } from './components/grupo-detalle-fecha-mobile/grupo-detalle-fecha-mobile.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { BancoslistComponent } from './components/bancoslist/bancoslist.component';
import { PageCartChilexpressComponent } from './page/page-cart-chilexpress/page-cart-chilexpress.component';
import { MapChilexpressComponent } from './components/map-chilexpress/map-chilexpress.component';
import { SucursalesComponent } from './components/sucursales/sucursales.component';
import { GrupoChilexpressComponent } from './components/grupo-chilexpress/grupo-chilexpress.component';
import { PageDownloadpdfComponent } from './page/page-downloadpdf/page-downloadpdf.component';
import { FormContactoComponent } from './components/form-contacto/form-contacto.component';
import { ModalConfirmDatesComponent } from './page/page-cart-shipping/components/modal-confirm-dates/modal-confirm-dates.component';
import { AgregarCentroCostoComponent } from './components/agregar-centro-costo/agregar-centro-costo.component';
import { PageOmniCartPaymentMethodComponent } from './page/page-omni-cart-payment-method/page-omni-cart-payment-method.component';
import { ResumenRetiroComponent } from './components/resumen-retiro/resumen-retiro.component';
import { ListaPagoComponent } from './components/lista-pago/lista-pago.component';
import { PageOmniCartOvSuccessComponent } from './page/page-omni-cart-ov-success/page-omni-cart-ov-success.component';
import { CodigoOcComponent } from './components/codigo-oc/codigo-oc.component';
import { PagesCartPaymentOcComponent } from './page/pages-cart-payment-oc/pages-cart-payment-oc.component';
import { DetalleCarroProductosOcComponent } from './components/detalle-carro-productos-oc/detalle-carro-productos-oc.component';
import { CardProductCardComponent } from './components/card-product-card/card-product-card.component';

@NgModule({
  declarations: [
    PageCartComponent,
    PageCartShippingComponent,
    PageCartPaymentMethodComponent,
    // PageCartOvSuccessComponent,
    // DetalleCarroProductosComponent,
    // PageCartCoSuccessComponent,
    // PageCartRequestSuccessComponent,
    // ProductsListSummaryCartComponent,
    // PageOmniCartPaymentMethodComponent,
    // ListaPagoComponent,
    // ResumenRetiroComponent,
    // AddAddressComponent,
    GuidedStepsComponent,
    // LoginRegisterComponent,
    // RegisterAddressComponent,
    // RegisterReceptionComponent,
    // RegisterVisitComponent,
    // PageCartHomeComponent,
    // GrupoDetalleProductosComponent,
    // GrupoDetalleFechasComponent,
    CardProductCardComponent,
    // GrupoDetalleFechaMobileComponent,
    // ModalConfirmComponent,
    BancoslistComponent,
    // PageCartChilexpressComponent,
    // MapChilexpressComponent,
    // SucursalesComponent,
    // GrupoChilexpressComponent,
    // PageDownloadpdfComponent,
    // FormContactoComponent,
    // ModalConfirmDatesComponent,
    AgregarCentroCostoComponent,
    // PageOmniCartOvSuccessComponent,
    CodigoOcComponent,
    // PagesCartPaymentOcComponent,
    // DetalleCarroProductosOcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlocksModule,
    SharedModule,
    CartRoutingModule,
    WidgetsModule,
    NgSelectModule,
    HeaderModule,
  ],
})
export class ShopModule {}
