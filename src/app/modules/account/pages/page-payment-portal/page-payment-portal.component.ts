import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ClientsService } from '../../../../shared/services/clients.service';
import { RootService } from '../../../../shared/services/root.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-payment-portal',
  templateUrl: './page-payment-portal.component.html',
  styleUrls: ['./page-payment-portal.component.scss'],
})
export class PagePaymentPortalComponent implements OnInit {
  @ViewChild('modalPaymentMethods', { static: false })
  modalPaymentMethods!: TemplateRef<any>;

  modalPaymentMethodsRef!: BsModalRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  user!: Usuario;
  customerDebt: any;
  loading = true;
  documentToPay: any[] = [];
  documentsSelected: any[] = [];
  total = 0;
  totalExpired = 0;
  totalDocuments = 0;
  totalToPay = 0;
  paymentBtns = [
    {
      id: 'bsantander',
      title: 'Banco Satander',
      image: 'assets/images/logo bancos/Logotipo_del_Banco_Santander.jpg',
      selected: false,
      disabled: false,
    },
    {
      id: 'bchile',
      title: 'Banco Chile',
      image: 'assets/images/logo bancos/bancochile.jpg',
      selected: false,
      disabled: false,
    },
    {
      id: 'bbci',
      title: 'Banco BCI',
      image: 'assets/images/logo bancos/bci.jpg',
      selected: false,
      disabled: false,
    },
  ];

  paymentSelected = '';
  loadingPayment = false;
  paymentMsgSuccess = false;
  innerWidth: any;

  constructor(
    private clientsService: ClientsService,
    private root: RootService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.user = this.root.getDataSesionUsuario();
    this.getData();
    this.dtOptions = this.root.simpleDtOptions;
  }
  getData() {
    const data = {
      where: {
        rut: this.user.rut,
      },
    };

    this.clientsService.getCustomerDebt(data).subscribe((r: any) => {
      this.customerDebt = r.data[0].documento_cobros;
      this.dtTrigger.next('');
      this.addCheckBoxs(this.customerDebt);
      this.calcTotalSelected();
      this.loading = false;

      this.customerDebt.forEach((e: any) => {
        var date_string = e.fechaVencimiento;
        var diff = +new Date() - +new Date(date_string);
        e.days = Math.ceil(diff / (1000 * 3600 * 24));
      });
    });
  }

  addCheckBoxs(docs: any) {
    docs.map((item: any) => {
      item.check = false;
    });
  }

  addCheck(item: any) {
    item.check = !item.check;
    this.calcTotalSelected();
  }

  // calcula el total de documentos seleccionados
  calcTotalSelected() {
    this.documentToPay = [];
    this.documentsSelected = [];
    this.total = 0;
    this.totalDocuments = 0;
    this.totalToPay = 0;
    this.totalExpired = 0;

    for (const item of this.customerDebt) {
      this.totalDocuments += item.saldo;
      // guarda las vencidas
      if (item.estado === 'VENCIDA') {
        this.totalExpired += item.saldo;
      }
      // guarda la seleccionadas
      if (item.check) {
        const obj = {
          folio: item.folio,
          monto: item.saldo,
        };
        this.documentToPay.push(item);
        this.documentsSelected.push(obj);

        this.total += item.saldo;
        this.totalToPay += item.saldo;
      }
    }
  }

  openModal() {
    this.modalPaymentMethodsRef = this.modalService.show(
      this.modalPaymentMethods
    );
  }

  setPaymentMethod(item: any) {
    this.paymentBtns.map((i) => {
      i.selected = false;
    });
    item.selected = true;
    this.paymentSelected = item.id;
  }

  // cuando es pago seleccionado
  openModalSelectedItem() {
    this.calcTotalSelected();
    this.openModal();
  }

  // cuando es pago seleccionado
  openModalTotalExpired() {
    this.totalToPay = 0;
    this.totalExpired = 0;
    this.documentToPay = [];

    for (const item of this.customerDebt) {
      if (item.estado === 'VENCIDA') {
        this.documentToPay.push(item);
        this.totalToPay += item.saldo;
        this.totalExpired += item.saldo;
      }
    }

    this.openModal();
  }

  // cuando es pago seleccionado
  openModalTotalDocuments() {
    this.totalToPay = 0;
    this.totalDocuments = 0;
    this.documentToPay = [];
    for (const item of this.customerDebt) {
      this.documentToPay.push(item);
      this.totalToPay += item.saldo;
      this.totalDocuments += item.saldo;
    }
    this.openModal();
  }

  generatePayment() {
    const data = {
      payment_method: this.paymentSelected,
      item: this.documentToPay,
      order_total: this.totalToPay,
      client_email: this.user.email,
      client_code: this.user.rut,
      client_name: this.user.company,
    };

    this.loadingPayment = true;
    this.clientsService.generatePayment(data).subscribe(
      (r: any) => {
        this.loadingPayment = false;

        if (r.error) {
          this.toastr.error(r.msg, 'Error');
          this.paymentMsgSuccess = false;
          return;
        }

        // si el pago se ingreso redirijimos
        this.paymentMsgSuccess = true;
        this.redirectPaymentImplementos(r.data.order_id);
        this.resetPayment();
      },
      (err) => {
        this.toastr.error('Error de comunicación con el servidor');
        this.paymentMsgSuccess = false;
      }
    );
  }

  redirectPaymentImplementos(orderId: any) {
    const url = `${environment.urlPagosImplementos}metodo_pago/resumen.php?order_id=${orderId}`;
    window.open(url);
  }

  resetPayment() {
    this.calcTotalSelected();
    this.paymentMsgSuccess = true;
    this.modalPaymentMethodsRef.hide();

    for (const item of this.customerDebt) {
      item.check = false;
    }
  }

  closeAlert() {
    this.paymentMsgSuccess = false;
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
