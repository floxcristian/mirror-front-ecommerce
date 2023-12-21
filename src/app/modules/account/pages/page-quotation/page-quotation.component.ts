import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { DataTablesResponse } from '../../../../shared/interfaces/data-table';
import { ClientsService } from '../../../../shared/services/clients.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { CartService } from '@core/services-v2/cart.service';
import {
  IOrderDetail,
  IOrderDetailResponse,
} from '@core/models-v2/cart/order-details.interface';
import { SHOPPING_CART_STATUS_TYPE } from '@core/enums/shopping-cart-status.enum';

@Component({
  selector: 'app-page-quotation',
  templateUrl: './page-quotation.component.html',
  styleUrls: ['./page-quotation.component.scss'],
})
export class PageQuotationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  modalRef!: BsModalRef;

  usuario!: ISession;
  orders!: IOrderDetail[];
  urlDonwloadOC = environment.apiShoppingCart + 'getoc?id=';
  innerWidth: any;
  columns = ['modificacion', 'folio', 'totalOv', 'usuario'];

  constructor(
    private http: HttpClient,
    private root: RootService,
    private toast: ToastrService,
    private clientsService: ClientsService,
    private modalService: BsModalService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private cartService: CartService,
    private readonly sessionService: SessionService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit(): void {
    this.loadData();
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    if (!this.usuario.hasOwnProperty('username'))
      this.usuario.username = this.usuario.email;
  }

  loadData() {
    const that = this;
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
        // url: 'assets/js/datatable/Spanish.json'
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
      columnDefs:
        this.innerWidth < 450
          ? [{ orderable: false, targets: 0 }]
          : [{ orderable: false, targets: 4 }],
      ajax: (dataTablesParameters: any, callback) => {
        this.cartService
          .getOrderDetails({
            user: that.usuario.username ? that.usuario.username : '',
            salesDocumentType: 1,
            statuses: [
              SHOPPING_CART_STATUS_TYPE.GENERATED,
              SHOPPING_CART_STATUS_TYPE.FINALIZED,
            ],
            sort: `${that.columns[dataTablesParameters.order[0].column]}|${
              dataTablesParameters.order[0].dir
            }`,
          })
          .subscribe((resp: IOrderDetailResponse) => {
            that.orders = resp.data;

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: [],
            });
          });
      },
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  reloadGrilla(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  convertirACarro(item: IOrderDetail) {
    const initialState = {
      title: 'Cargar productos en carro de compras',
      body: `Se cargarán todos los productos de esta cotización en el carro de compras, reemplazando el contenido actual.<br/>
                Podrá retomar su carro actual posteriormente.<br>
                  ¿Desea continuar?`,
      textBtnTrue: 'Confirmar',
      textBtnFalse: 'Cancelar',
      callback: (confirm: boolean) => {
        if (confirm) {
          this.cartService
            .quotationToOpenShoppingCart(item.salesId, item.user)
            .subscribe((res) => {
              this.toast.success(
                'Esta cotización está ahora disponible en su carro de compras.'
              );
              this.reloadGrilla();
              this.cartService.load();
              this.router.navigate(['/carro-compra', 'resumen']);
            });
        } else {
          console.log('cancelar');
        }
      },
    };

    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState,
    });
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
