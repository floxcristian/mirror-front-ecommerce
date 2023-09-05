import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// modules
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';

// components
import { LayoutComponent } from './components/layout/layout.component';

// pages
import { PageAddressesListComponent } from './pages/page-addresses-list/page-addresses-list.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageOrdersListComponent } from './pages/page-orders-list/page-orders-list.component';
import { PageInvoicesListComponent } from './pages/page-invoices-list/page-invoices-list.component';
import { PageOvsListComponent } from './pages/page-ovs-list/page-ovs-list.component';
import { PageUsuariosComponent } from './pages/page-usuarios/page-usuarios.component';
import { PageProductsCategoriesComponent } from './pages/page-products-categories/page-products-categories.component';
import { PageNewProductsComponent } from './pages/page-new-products/page-new-products.component';
import { PageSlidesComponent } from './pages/page-slides/page-slides.component';
import { PagePasswordComponent } from './pages/page-password/page-password.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { OrderApprovalComponent } from './components/order-approval/order-approval.component';
import { PagePendingOrdersComponent } from './pages/page-pending-orders/page-pending-orders.component';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PageQuotationComponent } from './pages/page-quotation/page-quotation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseRequestComponent } from './pages/purchase-request/purchase-request.component';
import { PagePaymentPortalComponent } from './pages/page-payment-portal/page-payment-portal.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PageTrackingComponent } from './pages/page-tracking/page-tracking.component';
import { PageSaveCartComponent } from './pages/page-save-cart/page-save-cart.component';
import { AddressModalComponent } from '../../shared/components/address-modal/address-modal.component';
import { CardDashboardChartComponent } from '../../shared/components/card-dashboard-chart/card-dashboard-chart.component';
import { CardDashboardComponent } from '../../shared/components/card-dashboard/card-dashboard.component';
import { EditProfileModalComponent } from '../../shared/components/edit-profile-modal/edit-profile-modal.component';
import { OrderDetailsComponent } from '../../shared/components/order-details/order-details.component';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
import { TrackingStepsComponent } from '../../shared/components/tracking-steps/tracking-steps.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PageCajaConceptoComponent } from './pages/page-caja-concepto/page-caja-concepto.component';
import { PageCajaConceptoDemoComponent } from './pages/page-caja-concepto/page-caja-concepto-demo/page-caja-concepto-demo.component';
import { PageCargaMasivaProdComponent } from './pages/page-carga-masiva-prod/page-carga-masiva-prod.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DetalleTrakingOvComponent } from './pages/page-detalle-traking-ov/page-detalle-traking-ov.component';
import { PageListaPreciosComponent } from './pages/page-lista-precios/page-lista-precios.component';
import { PageFlotaComponent } from './pages/page-flota/page-flota.component';
import { AddFlotaModalComponent } from '../../shared/components/add-flota-modal/add-flota-modal.component';
import { UpdateFlotaModalComponent } from '../../shared/components/update-flota-modal/update-flota-modal.component';
import { CardDashboardNoChartComponent } from '../../shared/components/card-dashboard-no-chart/card-dashboard-no-chart.component';
import { CardDashboardLineChartComponent } from '../../shared/components/card-dashboard-line-chart/card-dashboard-line-chart.component';
import { CardDashboardHorizontalBarChartComponent } from '../../shared/components/card-dashboard-horizontal-bar-chart/card-dashboard-horizontal-bar-chart.component';
import { PageTrackingOvComponent } from './pages/page-tracking-ov/page-tracking-ov.component';
import { PageListasDeProductosComponent } from './pages/page-listas-de-productos/page-listas-de-productos.component';
import { EditarListaProductosComponent } from '../../shared/components/editar-lista-productos/editar-lista-productos.component';
import { AgregarListaProductosMasivaModalComponent } from '../../shared/components/agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { PageCentrosCostoComponent } from './pages/page-centros-costo/page-centros-costo.component';
import { AddCentroCostoModalComponent } from './pages/page-centros-costo/components/add-centro-costo-modal/add-centro-costo-modal.component';
import { EditCentroCostoModalComponent } from './pages/page-centros-costo/components/edit-centro-costo-modal/edit-centro-costo-modal.component';
import { Trakingb2cComponent } from './pages/trakingb2c/trakingb2c.component';
import { AgregarListaProductosUnitariaModalComponent } from '../../shared/components/agregar-lista-productos-unitaria-modal/agregar-lista-productos-unitaria-modal.component';
import { PageGestionUsuarioComponent } from './pages/page-gestion-usuario/page-gestion-usuario.component';
import { TablaUsuarioComponent } from './components/tabla-usuario/tabla-usuario.component';
import { ModaluserComponent } from './components/modaluser/modaluser.component';
import { FiltroCategoriasComponent } from './components/filtro-categorias/filtro-categorias.component';
import { Modal_reciboComponent } from './components/modal_recibo/modal_recibo/modal_recibo.component';
import { PageComprasComponent } from './pages/page-compras/page-compras.component';
import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido.component';
import { PaginationModule, PaginationConfig } from 'ngx-bootstrap/pagination';
@NgModule({
  declarations: [
    // components
    LayoutComponent,
    // pages
    PageAddressesListComponent,
    PageDashboardComponent,
    PageLoginComponent,
    PageOrdersListComponent,
    PageInvoicesListComponent,
    PageOvsListComponent,
    PageUsuariosComponent,
    PageProductsCategoriesComponent,
    PageNewProductsComponent,
    PageSlidesComponent,
    PagePasswordComponent,
    PageProfileComponent,
    EditProfileComponent,
    OrderApprovalComponent,
    PagePendingOrdersComponent,
    PageQuotationComponent,
    PurchaseRequestComponent,
    PagePaymentPortalComponent,
    PageTrackingComponent,
    PageSaveCartComponent,
    AddressModalComponent,
    CardDashboardChartComponent,
    CardDashboardNoChartComponent,
    CardDashboardComponent,
    EditProfileModalComponent,
    OrderDetailsComponent,
    PasswordModalComponent,
    TrackingStepsComponent,
    PageCajaConceptoComponent,
    PageCajaConceptoDemoComponent,
    PageCargaMasivaProdComponent,
    DetalleTrakingOvComponent,
    PageListaPreciosComponent,
    PageFlotaComponent,
    CardDashboardLineChartComponent,
    CardDashboardHorizontalBarChartComponent,
    PageTrackingOvComponent,
    PageListasDeProductosComponent,
    PageCentrosCostoComponent,
    AddCentroCostoModalComponent,
    EditCentroCostoModalComponent,
    Trakingb2cComponent,
    PageGestionUsuarioComponent,
    TablaUsuarioComponent,
    Modal_reciboComponent,
    ModaluserComponent,
    DetallePedidoComponent,
    PageComprasComponent,
    FiltroCategoriasComponent,
  ],
  imports: [
    CommonModule,
    // modules
    AccountRoutingModule,
    SharedModule,
    DataTablesModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    DragDropModule,
  ],
  providers: [PaginationConfig],
})
export class AccountModule {}
