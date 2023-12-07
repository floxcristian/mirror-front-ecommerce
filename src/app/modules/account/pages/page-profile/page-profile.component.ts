import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { esEmpresa } from '../../../../shared/interfaces/login';
import { Subject } from 'rxjs';
import { isVacio } from '../../../../shared/utils/utilidades';
import { ToastrService } from 'ngx-toastr';
import { ShippingAddress } from '../../../../shared/interfaces/address';
import { DireccionDespachoComponent } from '../../../../modules/header/components/search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { IEcommerceUser } from '@core/models-v2/auth/user.interface';
import { AuthApiService } from '@core/services-v2/auth.service';
import {
  ICustomer,
  ICustomerAddress,
  ICustomerContact,
} from '@core/models-v2/customer/customer.interface';
import { CustomerContactService } from '@core/services-v2/customer-contact.service';
import { CustomerAddressService } from '@core/services-v2/customer-address.service';
import { IError } from '@core/models-v2/error/error.interface';
import { CustomerPreferenceService } from '@core/services-v2/customer-preference.service';
import { AddressType } from '@core/enums/address-type.enum';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss'],
})
export class PageProfileComponent implements OnDestroy, OnInit {
  usuario: ISession;
  dataUser!: IEcommerceUser;
  dataClient!: ICustomer;
  addresses!: ICustomerAddress[];
  contacts!: ICustomerContact[];
  direccionDespacho!: ShippingAddress | null | undefined;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTriggerContacts: Subject<any> = new Subject();
  loadingClient = true;
  cargandoIVA = false;
  @ViewChild('modalAddress', { static: false })
  modalAddress!: TemplateRef<any>;
  @ViewChild('modalUpdateAddress', { static: false })
  modalUpdateAddress!: TemplateRef<any>;
  @ViewChild('modalAddContact', { static: false })
  modalAddContact!: TemplateRef<any>;
  @ViewChild('modalUpdateContact', { static: false })
  modalUpdateContact!: TemplateRef<any>;
  @ViewChild('modalEdit', { static: false }) modalEdit!: TemplateRef<any>;
  @ViewChild('modalPassword', { static: false })
  modalPassword!: TemplateRef<any>;
  modalAddressRef!: BsModalRef;
  modalUpdateAddressRef!: BsModalRef;
  modalAddContactRef!: BsModalRef;
  modalUpdateContactRef!: BsModalRef;
  modalEditRef!: BsModalRef;
  modalPasswordRef!: BsModalRef;
  innerWidth: number;
  isVacio = isVacio;
  direccionSeleccionada!: ICustomerAddress;
  contactoSeleccionada!: ICustomerContact;

  ADDRESS_TYPE = AddressType;

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private localS: LocalStorageService,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Storage
    private readonly sessionStorage: SessionStorageService,
    private readonly sessionService: SessionService,
    // Services V2
    private readonly authService: AuthApiService,
    private readonly customerContactService: CustomerContactService,
    private readonly customerAddressService: CustomerAddressService,
    private readonly customerPreferenceService: CustomerPreferenceService
  ) {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
  ngOnInit(): void {
    this.getDataClient();
    this.dtOptions = this.root.simpleDtOptions;
    this.root
      .getPreferenciasCliente()
      .then((preferencias: PreferenciasCliente) => {
        this.direccionDespacho = preferencias.direccionDespacho;
      });
  }

  getDataClient() {
    this.loadingClient = true;
    this.authService.me().subscribe((r) => {
      this.dataUser = r.user;
      this.dataClient = r.customer;
      this.setTableAddresses(this.dataClient.addresses);
      this.setTableContacts(this.dataClient.contacts);
      this.loadingClient = false;
    });
  }

  setTableAddresses(addresses: ICustomerAddress[]) {
    this.addresses = addresses;
    this.dtTrigger.next(null);
  }

  setTableContacts(contacts: ICustomerContact[]) {
    this.contacts = contacts;
    this.dtTriggerContacts.next(null);
  }

  async actualizaIVA() {
    const parametros = {
      iva: isVacio(this.usuario.preferences.iva)
        ? false
        : !this.usuario.preferences.iva,
    };

    this.customerPreferenceService.updatePreferenceIva(parametros).subscribe({
      next: (_) => {
        this.toastr.success('Se actualizo con exito la configuración del IVA');
        this.actualizaLocalStorage(parametros.iva);
        this.usuario = this.sessionService.getSession();
      },
      error: (_) => {
        this.toastr.error('No se logro actualizar la configuración del IVA');
      },
    });
  }

  actualizaLocalStorage(iva: boolean): void {
    const user = this.sessionService.getSession();
    user.preferences.iva = iva;
    this.sessionStorage.set(user);
  }

  openModalAddAddress() {
    this.modalAddressRef = this.modalService.show(this.modalAddress, {
      ignoreBackdropClick: true,
    });
  }

  openModalUpdateAddAddress(direccion: ICustomerAddress) {
    this.direccionSeleccionada = direccion;
    this.modalUpdateAddressRef = this.modalService.show(
      this.modalUpdateAddress,
      { ignoreBackdropClick: true }
    );
  }

  deleteAddress(direccion: ICustomerAddress) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> esta direccion?<br><br>
                      Calle: <strong>${direccion.street}</strong><br>
                      Número: <strong>${direccion.number}</strong>`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      ignoreBackdropClick: true,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const documentId = this.dataClient.documentId;
        const addressId = direccion.id;
        this.customerAddressService
          .deleteAddress(documentId, addressId)
          .subscribe({
            next: (_) => {
              this.toastr.success('Dirección eliminada exitosamente.');
              this.respuesta(true);
            },
            error: (err: IError) => {
              this.toastr.error(err.message);
            },
          });
      }
    });
  }

  openModalAddContact() {
    this.modalAddContactRef = this.modalService.show(this.modalAddContact, {
      ignoreBackdropClick: true,
      class: 'modal-addContact',
    });
  }

  openModalUpdateContact(contacto: ICustomerContact) {
    this.contactoSeleccionada = contacto;
    this.modalUpdateContactRef = this.modalService.show(
      this.modalUpdateContact,
      { ignoreBackdropClick: true, class: 'modal-updateContact' }
    );
  }

  deleteContact(contacto: ICustomerContact) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> este contacto?<br><br>
                      Nombre: <strong>${contacto.name} ${
        contacto.lastName || ''
      }</strong><br>
                      Tipo: <strong>${contacto.contactType}</strong>`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const documentId = this.dataClient.documentId;
        const contactId = contacto.id;
        this.customerContactService
          .deleteContact(documentId, contactId)
          .subscribe({
            next: (_) => {
              this.toastr.success('Contacto eliminado exitosamente.');
              this.respuesta(true);
            },
            error: (err: IError) => {
              this.toastr.error(err.message);
            },
          });
      }
    });
  }

  openModalEditProfile() {
    this.modalEditRef = this.modalService.show(this.modalEdit, {
      ignoreBackdropClick: true,
    });
  }

  openModalPassword() {
    this.modalPasswordRef = this.modalService.show(this.modalPassword, {
      ignoreBackdropClick: true,
    });
  }

  respuesta(event: any) {
    if (event) {
      this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
      this.getDataClient();
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  esEmpresa(): boolean {
    return esEmpresa(this.usuario);
  }

  modificarDireccionDespacho() {
    const bsModalRef: BsModalRef = this.modalService.show(
      DireccionDespachoComponent
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      const direccionDespacho = res;

      this.direccionDespacho = direccionDespacho;
      const preferencias: PreferenciasCliente = this.localS.get(
        'preferenciasCliente'
      );
      preferencias.direccionDespacho = direccionDespacho;
      this.localS.set('preferenciasCliente', preferencias);
    });
  }
}
