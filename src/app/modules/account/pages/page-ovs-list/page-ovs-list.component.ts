import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { orders } from '../../../../../data/account-orders';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import * as moment from 'moment';

@Component({
  selector: 'app-page-ovs-list',
  templateUrl: './page-ovs-list.component.html',
  styleUrls: ['./page-ovs-list.component.sass'],
})
export class PageOvsListComponent implements OnInit {
  usuario: Usuario;
  loadingData = true;
  carros: any[] = [];

  visible_columns = ['Fecha', 'Cliente', 'OC'];
  columns = ['modificacion', 'cliente', 'OrdenCompra'];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private carroService: ClientsService
  ) {
    this.usuario = this.root.getDataSesionUsuario();
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
    this.carroService.confirmarOV(idCarro).subscribe((r: any) => {
      this.toastr.success('Error de conexión, para obtener ovs');
      window.location.reload();
    });
  }
}
