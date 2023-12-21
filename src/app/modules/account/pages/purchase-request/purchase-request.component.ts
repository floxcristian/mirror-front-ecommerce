import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { environment } from '@env/environment';
import { Usuario } from '../../../../shared/interfaces/login';
import { DataTablesResponse } from '../../../../shared/interfaces/data-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { Router } from '@angular/router';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { CartService } from '@core/services-v2/cart.service';
import { IOrderDetail } from '@core/models-v2/cart/order-details.interface';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],
})
export class PurchaseRequestComponent implements OnInit {
  @ViewChild('modalApprove', { static: false })
  modalApprove!: TemplateRef<any>;
  modalApproveRef!: BsModalRef;

  @ViewChild('modalRefuse', { static: false }) modalRefuse!: TemplateRef<any>;
  modalRefuseRef!: BsModalRef;

  dtOptions: DataTables.Settings = {};
  usuario!: ISession;
  orders!: IOrderDetail[];
  urlDonwloadOC = environment.apiShoppingCart + 'getoc?id=';
  title = '';
  viewActive = 'list';
  orderId:string = '';
  order!: IOrderDetail;
  userSession!: Usuario;
  loadingPage = false;
  obsRefuse = '';

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toast: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly cartService:CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.usuario = this.sessionService.getSession();
    if (!this.usuario.hasOwnProperty('username'))
      this.usuario.username = this.usuario.email;
    this.title = 'Solicitudes de compra pendientes de aprobación';
  }

  loadData() {
    const columns = [
      'updatedAt',
      'status',
      'total',
      'purchaseOrder.number',
      'purchaseOrder.amount',
      'user',
    ];
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      columnDefs: [{ orderable: false, targets: 6 }],
      ajax: (dataTablesParameters: any, callback) => {
        let page_actual = dataTablesParameters.start === 0 ? 1 : (dataTablesParameters.start/dataTablesParameters.length)+1
        let sort_column = columns[dataTablesParameters.order[0].column];
        let sort_asc_desc = dataTablesParameters.order[0].dir === 'asc' ? 1 : -1
        let sort_real = sort_column+'|'+sort_asc_desc
        let params2 = {
          user:this.usuario.username || '',
          salesDocumentType:2,
          search:dataTablesParameters.search.value,
          // statuses:['pending', 'rejected'],
          statuses:['finalized', 'generated'],
          page:page_actual,
          limit:dataTablesParameters.length,
          sort:sort_real
        }

        this.cartService.getOrderDetails(params2).subscribe({
          next:(res)=>{
            this.orders = res.data
            callback({
              recordsTotal: res.total,
              recordsFiltered: res.total,
              data: [],
            });
          },
          error:(err)=>{
            console.log(err)
          }
        })
      },
    };
  }

  addCart() {
    alert('Funcionalidad en proceso');
  }

  viewOrderDetail(item: IOrderDetail) {
    this.viewActive = 'detail';
    this.orderId = item.id;
    this.order = item;
  }

  backToList() {
    this.viewActive = 'list';
  }

  approveOrder(item: any) {
    this.modalApproveRef = this.modalService.show(this.modalApprove);
    this.order = item;
  }

  confirmApproveOrder() {
    const data: any = {
      id: this.order?.id,
      usuario: this.order?.user,
      tipo: 2,
      formaPago: 'OC',
      web: 1,
      proveedorPago: 'Orden de compra',
    };

    this.loadingPage = true;
    this.modalApproveRef.hide();
    // this.cart.generaOrdenDeCompra(data).subscribe(
    //   (r: ResponseApi) => {
    //     this.loadingPage = false;

    //     if (r.error) {
    //       this.toast.error(r.msg);

    //       return;
    //     }
    //     if (!r.error) {
    //       let params = {
    //         site_id: 'OC',
    //         external_reference: this.order._id,
    //         status: 'approved',
    //       };

    //       this.cart.load();
    //       this.router.navigate(
    //         ['/', 'carro-compra', 'gracias-por-tu-compra'],
    //         { queryParams: { ...params } }
    //       );
    //     }
    //   },
    //   (e) => {
    //     this.toast.error('Ha ocurrido  al generar la orden de venta');
    //   }
    // );
  }

  refuseOrder(item: any) {
    this.modalRefuseRef = this.modalService.show(this.modalRefuse);
    this.order = item;
  }

  confirmRefuseOrder() {
    const data = {
      id: this.order.id,
      observacion: this.obsRefuse,
    };
    this.loadingPage = true;
    // this.cart.refuseOrder(data).subscribe(
    //   (r: ResponseApi) => {
    //     this.loadingPage = false;

    //     if (r.error) {
    //       this.toast.error(r.msg);
    //       return;
    //     }
    //     this.toast.success('Solitud rechazada correctamente');
    //     this.modalRefuseRef.hide();
    //     this.loadData();
    //   },
    //   (e) => {
    //     this.toast.error('Ha ocurrido un error al rechazar la orden de venta');
    //   }
    // );
  }
}
