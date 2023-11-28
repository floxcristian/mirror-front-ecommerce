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
import { Usuario, esEmpresa } from '../../../../shared/interfaces/login';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { Subject } from 'rxjs';
import { isVacio } from '../../../../shared/utils/utilidades';
import { ToastrService } from 'ngx-toastr';
import { ShippingAddress } from '../../../../shared/interfaces/address';
import { DireccionDespachoComponent } from '../../../../modules/header/components/search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import {
  Cliente,
  Contacto,
  Direccion,
} from '../../../../shared/interfaces/cliente';
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

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss'],
})
export class PageProfileComponent implements OnDestroy, OnInit {
  usuario: ISession;
  dataClient!: Cliente;
  addresses!: Direccion[];
  contacts!: Contacto[];
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
  direccionSeleccionada!: Direccion;
  contactoSeleccionada!: Contacto;

  constructor(
    private root: RootService,
    private clientsService: ClientsService,
    private toastr: ToastrService,
    private localS: LocalStorageService,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Storage
    private readonly sessionStorage: SessionStorageService,
    private readonly sessionService: SessionService
  ) {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
  ngOnInit(): void {
    this.dtOptions = this.root.simpleDtOptions;
    this.root
      .getPreferenciasCliente()
      .then((preferencias: PreferenciasCliente) => {
        this.direccionDespacho = preferencias.direccionDespacho;
      });

    this.getDataClient();
  }

  getDataClient() {
    const data = {
      rut: this.usuario.documentId,
    };
    this.loadingClient = true;
    this.clientsService.getDataClient(data).subscribe((r: any) => {
      this.loadingClient = false;
      //comente este codigo hasta que se arregle la api de cliente
      //https://b2b-api.implementos.cl/api/cliente/GetDatosCliente
      this.dataClient = r.data[0];
      this.setTableAddresses(this.dataClient.direcciones);
      this.setTableContacts(this.dataClient.contactos);
    });
  }

  setTableAddresses(addresses: any) {
    this.addresses = addresses;
    this.dtTrigger.next(null);
  }

  setTableContacts(contacts: any) {
    this.contacts = contacts;
    this.dtTriggerContacts.next(null);
  }

  async actualizaIVA() {
    const parametros = {
      username: this.usuario.username,
      iva: isVacio(this.usuario.iva) ? false : !this.usuario.iva,
    };

    const resp: ResponseApi = (await this.clientsService
      .updateIVA(parametros)
      .toPromise()) as ResponseApi;

    if (resp.error) {
      this.toastr.error('No se logro actualizar la configuración del IVA');
    } else {
      this.toastr.success('Se actualizo con exito la configuración del IVA');
      this.actualizaLocalStorage(parametros.iva);
      this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    }
  }

  actualizaLocalStorage(iva: boolean) {
    // const user = this.root.getDataSesionUsuario();
    const user = this.sessionStorage.get();
    if (user) {
      user.iva = iva;
      this.sessionStorage.set(user);
      // this.localS.set('usuario', user);
    }
  }

  openModalAddAddress() {
    this.modalAddressRef = this.modalService.show(this.modalAddress, {
      ignoreBackdropClick: true,
    });
  }

  openModalUpdateAddAddress(direccion: Direccion) {
    this.direccionSeleccionada = direccion;
    this.modalUpdateAddressRef = this.modalService.show(
      this.modalUpdateAddress,
      { ignoreBackdropClick: true }
    );
  }

  deleteAddress(direccion: Direccion) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> esta direccion?<br><br>
                      Calle: <strong>${direccion.calle}</strong><br>
                      Número: <strong>${direccion.numero}</strong>`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      ignoreBackdropClick: true,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();
        const request = {
          codEmpleado: 0,
          codUsuario: 0,
          cuentaUsuario: usuario.username,
          rutUsuario: usuario.documentId,
          nombreUsuario: `${usuario.firstName} ${usuario.lastName}`,
        };
        const respuesta: any = await this.clientsService
          .eliminaDireccion(
            request,
            this.usuario?.documentId || '',
            direccion.recid || 0
          )
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Dirección eliminada exitosamente.');
          this.respuesta(true);
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }

  openModalAddContact() {
    this.modalAddContactRef = this.modalService.show(this.modalAddContact, {
      ignoreBackdropClick: true,
      class: 'modal-addContact',
    });
  }

  openModalUpdateContact(contacto: Contacto) {
    this.contactoSeleccionada = contacto;
    this.modalUpdateContactRef = this.modalService.show(
      this.modalUpdateContact,
      { ignoreBackdropClick: true, class: 'modal-updateContact' }
    );
  }

  deleteContact(contacto: Contacto) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> este contacto?<br><br>
                      Nombre: <strong>${contacto.nombre} ${
        contacto.apellido || ''
      }</strong><br>
                      Tipo: <strong>${contacto.contactoDe}</strong>`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();
        const request = {
          codEmpleado: 0,
          codUsuario: 0,
          cuentaUsuario: usuario.username,
          rutUsuario: usuario.documentId,
          nombreUsuario: `${usuario.firstName} ${usuario.lastName}`,
        };
        const respuesta: any = await this.clientsService
          .eliminaContacto(request, usuario.documentId, contacto.contactoId)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Contacto eliminado exitosamente.');
          this.respuesta(true);
        } else {
          this.toastr.error(respuesta.msg);
        }
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
