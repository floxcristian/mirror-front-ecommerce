import { Component, OnInit } from '@angular/core'
import { Usuario } from '../../../../shared/interfaces/login'
import { RootService } from '../../../../shared/services/root.service'
import { ClientsService } from '../../../../shared/services/clients.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-page-invoices-list',
  templateUrl: './page-invoices-list.component.html',
  styleUrls: ['./page-invoices-list.component.sass'],
})
export class PageInvoicesListComponent implements OnInit {
  usuario: Usuario
  invoices: String[] = []
  visible_columns: String[] = [
    'Factura',
    'Fecha',
    'Monto',
    'Saldo',
    'Vencimiento',
    'Orden de Venta',
    'Sucursal',
    'Medio de Pago',
  ]
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
  ]

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private clients: ClientsService,
  ) {
    this.usuario = this.root.getDataSesionUsuario()
    this.clients.buscarFacturas(this.usuario.rut).subscribe(
      (r: any) => {
        this.invoices = r.data
        this.toastr.info('Facturas cargadas')
      },
      (error) => {
        this.toastr.error('Error de conexión, para obtener facturas por rut')
      },
    )
  }
  ngOnInit() {}
}
