import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-page-invoices-list',
  templateUrl: './page-invoices-list.component.html',
  styleUrls: ['./page-invoices-list.component.sass'],
})
export class PageInvoicesListComponent implements OnInit {
  usuario: ISession;
  invoices: String[] = [];
  visible_columns: String[] = [
    'Factura',
    'Fecha',
    'Monto',
    'Saldo',
    'Vencimiento',
    'Orden de Venta',
    'Sucursal',
    'Medio de Pago',
  ];
  // columns: String[] = ["factura", "fecha", "monto", "saldo", "vencimiento", "ordenVenta", "sucursal", "medioPago"];
  columns: any[] = [
    'factura',
    'fecha',
    'monto',
    'saldo',
    'vencimiento',
    'ordenVenta',
    'sucursal',
    'medioPago',
  ];

  constructor(
    private toastr: ToastrService,
    private clients: ClientsService,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.usuario = this.sessionService.getSession();

    this.clients.buscarFacturas(this.usuario.documentId).subscribe(
      (r: any) => {
        this.invoices = r.data;
        this.toastr.info('Facturas cargadas');
      },
      (error) => {
        this.toastr.error('Error de conexión, para obtener facturas por rut');
      }
    );
  }
  ngOnInit() {}
}
