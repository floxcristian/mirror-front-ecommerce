import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { DataTablesResponse } from '../../../../shared/interfaces/data-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../shared/services/cart.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { Router } from '@angular/router';

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
  usuario!: Usuario;
  orders!: any[];
  urlDonwloadOC = environment.apiShoppingCart + 'getoc?id=';
  title = '';
  viewActive = 'list';
  orderId = null;
  order: any = null;
  userSession!: Usuario;
  loadingPage = false;
  obsRefuse = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private root: RootService,
    private modalService: BsModalService,
    private toast: ToastrService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.usuario = this.root.getDataSesionUsuario();
    if (!this.usuario.hasOwnProperty('username'))
      this.usuario.username = this.usuario.email;
    this.title = 'Solicitudes de compra pendientes de aprobación';
  }

  loadData() {
    const that = this;
    const columns = [
      'modificacion',
      'estado',
      'totalOv',
      'folio',
      'montoOcCliente',
      'usuario',
    ];
    let username: String = 'services';
    let password: String = '0.=j3D2ss1.w29-';
    let authdata = window.btoa(username + ':' + password);
    let head = {
      Authorization: `Basic ${authdata}`,
      'Access-Control-Allow-Headers':
        'Authorization, Access-Control-Allow-Headers',
    };
    let headers = new HttpHeaders(head);

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
        dataTablesParameters.usuario = this.usuario.username;
        dataTablesParameters.tipo = 2; // ov
        dataTablesParameters.estado = ['pendiente', 'rechazado'];
        dataTablesParameters.sortColumn =
          columns[dataTablesParameters.order[0].column];
        dataTablesParameters.sortDir = dataTablesParameters.order[0].dir;

        that.http
          .post<DataTablesResponse>(
            environment.apiShoppingCart + 'listadoPedidos',
            dataTablesParameters,
            { headers: headers }
          )
          .subscribe((resp) => {
            that.orders = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  addCart() {
    alert('Funcionalidad en proceso');
  }

  viewOrderDetail(item: any) {
    this.viewActive = 'detail';
    this.orderId = item._id;
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
      id: this.order?._id,
      usuario: this.order?.usuario,
      tipo: 2,
      formaPago: 'OC',
    };

    this.loadingPage = true;
    this.modalApproveRef.hide();
    this.cart.generaOrdenDeCompra(data).subscribe(
      (r: ResponseApi) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);

          return;
        }
        this.router.navigate([
          '/',
          'carro-compra',
          'comprobante-de-pago',
          r.data.numero,
        ]);
      },
      (e) => {
        this.toast.error('Ha ocurrido  al generar la orden de venta');
      }
    );
  }

  refuseOrder(item: any) {
    this.modalRefuseRef = this.modalService.show(this.modalRefuse);
    this.order = item;
  }

  confirmRefuseOrder() {
    const data = {
      id: this.order._id,
      observacion: this.obsRefuse,
    };
    this.loadingPage = true;
    this.cart.refuseOrder(data).subscribe(
      (r: ResponseApi) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);
          return;
        }
        this.toast.success('Solitud rechazada correctamente');
        this.modalRefuseRef.hide();
        this.loadData();
      },
      (e) => {
        this.toast.error('Ha ocurrido un error al rechazar la orden de venta');
      }
    );
  }
}
