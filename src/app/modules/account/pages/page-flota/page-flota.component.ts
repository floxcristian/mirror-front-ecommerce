import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { DataTableDirective } from 'angular-datatables'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { forkJoin, Subject } from 'rxjs'
import { AddFlotaModalComponent } from '../../../../shared/components/add-flota-modal/add-flota-modal.component'
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component'
import { UpdateFlotaModalComponent } from '../../../../shared/components/update-flota-modal/update-flota-modal.component'
import { Flota } from '../../../../shared/interfaces/flota'
import { Usuario } from '../../../../shared/interfaces/login'
import { ClientsService } from '../../../../shared/services/clients.service'
import { RootService } from '../../../../shared/services/root.service'

@Component({
  selector: 'app-page-flota',
  templateUrl: './page-flota.component.html',
  styleUrls: ['./page-flota.component.scss'],
})
export class PageFlotaComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) dtElements!: QueryList<DataTableDirective>

  userSession!: Usuario

  busquedasRecientes: any[] = []
  flota: any[] = []

  dtOptions: DataTables.Settings = {}
  dtTrigger1: Subject<any> = new Subject()
  dtTrigger2: Subject<any> = new Subject()
  collapsed1State = true
  collapsed2State = false
  cargando = true

  constructor(
    private clientsService: ClientsService,
    public root: RootService,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.userSession = this.root.getDataSesionUsuario()
    this.dtOptions = this.root.simpleDtOptions
    this.dtOptions = {
      ...this.dtOptions,
      ...{ dom: '<"row"<"col-6"l><"col-6"f>><"row"<"col-6"i><"col-6"p>> t' },
    }

    this.getData()
  }

  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe()
    this.dtTrigger2.unsubscribe()
  }

  getData() {
    this.cargando = true
    forkJoin([
      this.clientsService.getBusquedasVin(this.userSession.rut || '0'),
      this.clientsService.getFlota(this.userSession.rut || '0'),
    ]).subscribe((resp: any[]) => {
      this.busquedasRecientes = resp[0].data
      this.flota = resp[1].data
      this.cargando = false

      if (this.busquedasRecientes.length > 0) {
        this.dtTrigger1.next('')
      }
      if (this.flota.length > 0) {
        this.dtTrigger2.next('')
      }
    })
  }

  reDraw(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw()
          dtInstance.destroy()
        })
      }
    })
  }

  clickCollapse(item: any) {
    switch (item) {
      case 1:
        if (
          document
            .getElementById('busquedasRecientes')
            ?.classList.contains('collapsing')
        ) {
          return
        }
        this.collapsed1State = !this.collapsed1State
        this.collapsed2State = true
        break
      case 2:
        if (
          document.getElementById('miFlota')?.classList.contains('collapsing')
        ) {
          return
        }
        this.collapsed2State = !this.collapsed2State
        this.collapsed1State = true
        break
    }
  }

  agregarVinFlota(busqueda: Flota) {
    const initialState = {
      vin: busqueda.vehiculo?.chasis,
      closeToOk: false,
    }
    const bsModalRef: BsModalRef = this.modalService.show(
      AddFlotaModalComponent,
      { initialState },
    )
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const request: any = {
          idFlota: busqueda._id,
          alias: res,
        }
        const respuesta: any = await this.clientsService
          .setFlota(request)
          .toPromise()
        if (!respuesta.error) {
          this.toastr.success('VIN guardado exitosamente.')
          bsModalRef.hide()

          this.reDraw()
          this.getData()
        }
      }
    })
  }

  actualizarVinFlota(flota: Flota) {
    const initialState = {
      vin: flota.vehiculo?.chasis,
      alias: flota.alias,
      closeToOk: false,
    }
    const bsModalRef: BsModalRef = this.modalService.show(
      UpdateFlotaModalComponent,
      { initialState },
    )
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const request: any = {
          idFlota: flota._id,
          alias: res,
        }
        const respuesta: any = await this.clientsService
          .updateFlota(request)
          .toPromise()
        if (!respuesta.error) {
          this.toastr.success('Vehículo actualizado exitosamente.')
          bsModalRef.hide()

          this.reDraw()
          this.getData()
        }
      }
    })
  }

  eliminarVinBusqueda(busqueda: Flota) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> el VIN ${busqueda.vehiculo?.chasis} de las busquedas recientes?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    }
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    })
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteBusquedaVin(busqueda)
          .toPromise()
        if (!respuesta.error) {
          this.toastr.success('VIN eliminado exitosamente.')

          this.reDraw()
          this.getData()
        } else {
          this.toastr.error(respuesta.msg)
        }
      }
    })
  }

  eliminarFlota(flota: Flota) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Está seguro que desea <strong>eliminar</strong> el vehículo alias ${flota.alias} de tu flota?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    }
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    })
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteFlota(flota)
          .toPromise()
        if (!respuesta.error) {
          this.toastr.success('Vehículo eliminado exitosamente.')

          this.reDraw()
          this.getData()
        } else {
          this.toastr.error(respuesta.msg)
        }
      }
    })
  }
}
