import { Component, EventEmitter, OnInit } from '@angular/core';
import { ShippingAddress } from '../../../../../../shared/interfaces/address';
import { PreferenciasCliente } from '../../../../../../shared/interfaces/preferenciasCliente';
import { ResponseApi } from '../../../../../../shared/interfaces/response-api';
import { LogisticsService } from '../../../../../../shared/services/logistics.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-direccion-despacho',
  templateUrl: './direccion-despacho.component.html',
  styleUrls: ['./direccion-despacho.component.scss'],
})
export class DireccionDespachoComponent implements OnInit {
  direcciones!: ShippingAddress[];
  direccionSeleccionada!: ShippingAddress | null;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private logisticsService: LogisticsService,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  async ngOnInit() {
    const usuario = this.sessionService.getSession(); //this.rootService.getDataSesionUsuario();
    const resp: ResponseApi = (await this.logisticsService
      .obtieneDireccionesCliente(usuario.documentId)
      .toPromise()) as ResponseApi;

    const direccionConfigurada: PreferenciasCliente = this.localS.get(
      'preferenciasCliente'
    ) as any;
    this.direcciones = resp.data;
    this.direccionSeleccionada =
      this.direcciones.find(
        (r) => r.recid === direccionConfigurada.direccionDespacho?.recid
      ) || null;
  }

  guardar() {
    this.event.emit(this.direccionSeleccionada);
    this.ModalRef.hide();
    this.logisticsService.guardarDireccionCliente(this.direccionSeleccionada);
  }

  seleccionaDireccion(direccion: ShippingAddress) {
    this.direccionSeleccionada = direccion;
  }
}
