import { Component, EventEmitter, OnInit } from '@angular/core';
// import { LocalStorageService } from 'angular-2-local-storage';
import { ShippingAddress } from '../../../../../../shared/interfaces/address';
import { PreferenciasCliente } from '../../../../../../shared/interfaces/preferenciasCliente';
import { ResponseApi } from '../../../../../../shared/interfaces/response-api';
import { LogisticsService } from '../../../../../../shared/services/logistics.service';
import { RootService } from '../../../../../../shared/services/root.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-direccion-despacho',
  templateUrl: './direccion-despacho.component.html',
  styleUrls: ['./direccion-despacho.component.scss'],
})
export class DireccionDespachoComponent implements OnInit {
  direcciones!: ShippingAddress[];
  direccionSeleccionada!: ShippingAddress | null;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private logisticsService: LogisticsService,
    private localS: LocalStorageService,
    private rootService: RootService
  ) {}

  async ngOnInit() {
    const usuario = this.rootService.getDataSesionUsuario();
    const resp: ResponseApi = (await this.logisticsService
      .obtieneDireccionesCliente(usuario.rut)
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
