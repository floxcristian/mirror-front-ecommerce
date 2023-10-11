import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { DataTablesResponse } from '../../../../shared/interfaces/data-table';
import { ClientsService } from '../../../../shared/services/clients.service';
import { CartService } from '../../../../shared/services/cart.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';

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

  usuario!: Usuario;
  orders!: any[];
  urlDonwloadOC = environment.apiShoppingCart + 'getoc?id=';
  innerWidth: any;
  columns = ['modificacion', 'folio', 'totalOv', 'usuario'];

  constructor(
    private http: HttpClient,
    private root: RootService,
    private toast: ToastrService,
    private clientsService: ClientsService,
    private cartService: CartService,
    private modalService: BsModalService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit(): void {
    this.loadData();
    this.usuario = this.root.getDataSesionUsuario();
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
        dataTablesParameters.usuario = that.usuario.username;
        dataTablesParameters.tipo = 1;
        dataTablesParameters.estado = ['generado'];
        dataTablesParameters.sortColumn =
          that.columns[dataTablesParameters.order[0].column];
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

  convertirACarro(item: any) {
    let _this = this;

    const initialState = {
      title: 'Cargar productos en carro de compras',
      body: `Se cargarán todos los productos de esta cotización en el carro de compras, reemplazando el contenido actual.<br/>
                Podrá retomar su carro actual posteriormente.<br>
                  ¿Desea continuar?`,
      textBtnTrue: 'Confirmar',
      textBtnFalse: 'Cancelar',
      callback: (confirm: boolean) => {
        if (confirm) {
          this.clientsService
            .cotizacionAOV(item.numero, item.usuario)
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
