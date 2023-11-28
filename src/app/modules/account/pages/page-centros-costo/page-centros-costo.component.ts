import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import { CentroCosto } from '../../../../shared/interfaces/centroCosto';
import { ClientsService } from '../../../../shared/services/clients.service';
import { RootService } from '../../../../shared/services/root.service';
import { AddCentroCostoModalComponent } from './components/add-centro-costo-modal/add-centro-costo-modal.component';
import { EditCentroCostoModalComponent } from './components/edit-centro-costo-modal/edit-centro-costo-modal.component';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-page-centros-costo',
  templateUrl: './page-centros-costo.component.html',
  styleUrls: ['./page-centros-costo.component.scss'],
})
export class PageCentrosCostoComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) dtElements!: QueryList<DataTableDirective>;

  userSession!: ISession;

  centrosCosto: CentroCosto[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  cargando = true;

  constructor(
    private clientsService: ClientsService,
    public root: RootService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    this.userSession = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.dtOptions = this.root.simpleDtOptions;
    this.dtOptions = {
      ...this.dtOptions,
      ...{ dom: '<"row"<"col-6"l><"col-6"f>><"row"<"col-6"i><"col-6"p>> t' },
    };

    this.getData();
  }

  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
  }

  getData() {
    this.cargando = true;

    this.clientsService
      .getCentrosCosto(this.userSession.documentId)
      .subscribe((resp: any) => {
        this.centrosCosto = resp.data;
        this.cargando = false;

        if (this.centrosCosto.length > 0) {
          this.dtTrigger1.next('');
        }
      });
  }

  reDraw(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw();
          dtInstance.destroy();
        });
      }
    });
  }

  agregarVinFlota() {
    const initialState = {
      closeToOK: false,
    };
    const bsModalRef: BsModalRef = this.modalService.show(
      AddCentroCostoModalComponent,
      { initialState }
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const request: any = {
          rut: this.userSession.documentId,
          codigo: res.codigo,
          nombre: res.nombre,
        };
        const respuesta: any = await this.clientsService
          .setCentroCosto(request)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Centro de costo ingresado exitosamente.');
          bsModalRef.hide();

          this.reDraw();
          this.getData();
        } else {
          this.toastr.error(respuesta.msg);
          bsModalRef.hide();
        }
      }
    });
  }

  actualizarCentroCosto(centroCosto: CentroCosto) {
    const initialState = {
      codigo: centroCosto.codigo,
      nombre: centroCosto.nombre,
      closeToOk: false,
    };
    const bsModalRef: BsModalRef = this.modalService.show(
      EditCentroCostoModalComponent,
      { initialState }
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const respuesta: any = await this.clientsService
          .updateCentroCosto(res, this.userSession.documentId, centroCosto._id)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Centro de costo actualizado exitosamente.');
          bsModalRef.hide();

          this.reDraw();
          this.getData();
        }
      }
    });
  }

  eliminarCentroCosto(centroCosto: CentroCosto) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> el centro de costo código ${centroCosto.codigo}?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteCentroCosto(this.userSession.documentId, centroCosto._id)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Centro de costo eliminado exitosamente.');

          this.reDraw();
          this.getData();
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }
}
