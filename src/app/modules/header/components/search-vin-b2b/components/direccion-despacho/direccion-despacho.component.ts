// Angular
import { Component, EventEmitter, OnInit } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Models
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
// Services
import { SessionService } from '@core/services-v2/session/session.service';
import { CustomerAddressApiService } from '@core/services-v2/customer-address/customer-address-api.service';
import { CustomerPreferencesStorageService } from '@core/storage/customer-preferences-storage.service';
import { CustomerAddressService } from '@core/services-v2/customer-address/customer-address.service';
import { Router } from '@angular/router';

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
    public router: Router,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly customerAddressApiService: CustomerAddressApiService,
    private readonly customerAddressService: CustomerAddressService,
    private readonly customerPreferenceStorage: CustomerPreferencesStorageService
  ) {}

  ngOnInit(): void {
    const { documentId } = this.sessionService.getSession();
    this.customerAddressApiService.getDeliveryAddresses(documentId).subscribe({
      next: (addresses) => {
        this.direcciones = addresses;
        const direccionConfigurada = this.customerPreferenceStorage.get();
        this.direccionSeleccionada =
          this.direcciones.find(
            (address) =>
              address.id === direccionConfigurada.deliveryAddress?.id
          ) || null;
      },
    });
  }

  guardar(): void {
    this.event.emit(this.direccionSeleccionada);
    this.ModalRef.hide();
    this.customerAddressService.setCustomerAddress(this.direccionSeleccionada);
  }

  seleccionaDireccion(direccion: ICustomerAddress): void {
    this.direccionSeleccionada = direccion;
  }

  manageAddresses(event: Event) {
    event.preventDefault();
    this.ModalRef.hide();
    this.router.navigate(['/', 'mi-cuenta', 'mi-perfil']);
  }
}
