import { Component, EventEmitter, OnInit } from '@angular/core';
import { ShippingAddress } from '../../../../../../shared/interfaces/address';
import { PreferenciasCliente } from '../../../../../../shared/interfaces/preferenciasCliente';
import { LogisticsService } from '../../../../../../shared/services/logistics.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { CustomerAddressService } from '@core/services-v2/customer-address.service';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';

@Component({
  selector: 'app-direccion-despacho',
  templateUrl: './direccion-despacho.component.html',
  styleUrls: ['./direccion-despacho.component.scss'],
})
export class DireccionDespachoComponent implements OnInit {
  direcciones!: ICustomerAddress[];
  direccionSeleccionada!: ICustomerAddress | null;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private logisticsService: LogisticsService,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly customerAddressService: CustomerAddressService
  ) {}

  async ngOnInit() {
    const usuario = this.sessionService.getSession(); //this.rootService.getDataSesionUsuario();
    const resp = (await this.customerAddressService
      .getDeliveryAddresses(usuario.documentId)
      .toPromise()) as ICustomerAddress[];

    const direccionConfigurada: PreferenciasCliente = this.localS.get(
      'preferenciasCliente'
    ) as any;
    this.direcciones = resp;
    this.direccionSeleccionada =
      this.direcciones.find(
        (r) => r.id === direccionConfigurada.direccionDespacho?.id
      ) || null;
  }

  guardar() {
    this.event.emit(this.direccionSeleccionada);
    this.ModalRef.hide();
    this.logisticsService.guardarDireccionCliente(this.direccionSeleccionada);
  }

  seleccionaDireccion(direccion: ICustomerAddress) {
    this.direccionSeleccionada = direccion;
  }
}
