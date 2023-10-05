import { Component, EventEmitter, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { isVacio } from '../../utils/utilidades'

@Component({
  selector: 'app-add-flota-modal',
  templateUrl: './add-flota-modal.component.html',
  styleUrls: ['./add-flota-modal.component.scss'],
})
export class AddFlotaModalComponent implements OnInit {
  vin!: string
  alias!: string

  closeToOK!: boolean
  cargando = false
  cantCaracteres = 0
  maxCaracteres = 30

  public event: EventEmitter<any> = new EventEmitter()

  constructor(
    public ModalRef: BsModalRef,
    private toastr: ToastrService,
  ) {}

  async ngOnInit() {
    if (isVacio(this.closeToOK)) {
      this.closeToOK = true
    }
  }

  guardar() {
    if (!isVacio(this.alias)) {
      this.event.emit(this.alias)

      if (this.closeToOK) {
        this.ModalRef.hide()
      } else {
        this.cargando = true
      }
    } else {
      this.toastr.info('Debe ingresar un alias.', 'Información')
    }
  }
}
