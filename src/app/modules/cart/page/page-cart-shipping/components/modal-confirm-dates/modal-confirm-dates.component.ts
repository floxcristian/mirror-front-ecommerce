// Angular
import { Component, EventEmitter } from '@angular/core'
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal'
// Enums
import { ShippingType } from '../../../../../../core/enums'

@Component({
  selector: 'app-modal-confirm-dates',
  templateUrl: './modal-confirm-dates.component.html',
  styleUrls: ['./modal-confirm-dates.component.scss'],
})
export class ModalConfirmDatesComponent {
  confirmar!: boolean
  obj_fecha!: any[]
  select_grupos!: boolean
  shippingType!: ShippingType

  select_grupos_change = new EventEmitter<boolean>()
  selectTab = new EventEmitter<ShippingType>()

  constructor(public bsModalRef: BsModalRef) {}

  /**
   * Confirmar o cancelar el modal.
   * @param event
   */
  submit(event: boolean): void {
    if (event) this.select_grupos_change.emit(true)
    else {
      this.select_grupos_change.emit(false)
      if (this.shippingType === ShippingType.RETIRO)
        this.selectTab.emit(ShippingType.RETIRO)
      else this.selectTab.emit(ShippingType.DESPACHO)
    }
    this.bsModalRef.hide()
  }
}
