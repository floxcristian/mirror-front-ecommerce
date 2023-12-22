import { Component, OnInit } from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import * as moment from 'moment';
import { CartService } from '@shared/services/cart.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-page-ovs-list',
  templateUrl: './page-ovs-list.component.html',
  styleUrls: ['./page-ovs-list.component.sass'],
})
export class PageOvsListComponent implements OnInit {
  usuario: ISession;
  loadingData = true;
  carros: any[] = [];

  visible_columns = ['Fecha', 'Cliente', 'OC'];
  columns = ['modificacion', 'cliente', 'OrdenCompra'];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private carroService: ClientsService,
    private cartService: CartService,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.loadingData = true;
  }

  ngOnInit() {
    this.dtOptions = this.root.simpleDtOptions;
    this.dtOptions = { ...this.dtOptions, ...{ order: [[0, 'desc']] } };

    this.carroService.buscarOvsGeneradas().subscribe(
      (r: any) => {
        if (r.data !== null) {
          const results = r.data.map((result: any) => {
            result.modificacion = moment(result.modificacion).format(
              'DD/MM/YYYY'
            );
            if (result.ordenCompra.monto != undefined) {
              result.ordenCompra.monto =
                result.ordenCompra.monto.toLocaleString('es-es', {
                  minimumFractionDigits: 0,
                });
            }
            result.cliente.credito = result.cliente.credito.toLocaleString(
              'es-es',
              { minimumFractionDigits: 0 }
            );
            if (result.cliente.creditoUtilizado) {
              result.cliente.creditoUtilizado =
                result.cliente.creditoUtilizado.toLocaleString('es-es', {
                  minimumFractionDigits: 0,
                });
            } else {
              result.cliente.creditoUtilizado = '0';
            }

            return result;
          });

          this.carros = results;
        }

        this.loadingData = false;
        this.dtTrigger.next(null);
      },
      (error) => {
        this.loadingData = false;
        this.toastr.error('Error de conexión, para obtener ovs');
      }
    );
  }

  confirmarOV(idCarro: any) {
    this.cartService.confirmarOV(idCarro).subscribe((r: any) => {
      this.toastr.success('Error de conexión, para obtener ovs');
      window.location.reload();
    });
  }
}
