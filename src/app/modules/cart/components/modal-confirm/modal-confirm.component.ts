import { Component, OnInit, Input } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit {
  modalRef!: BsModalRef
  fecha: any[] = []
  @Input() set fechaEvent(value: any) {
    this.fecha = value
  }
  estado: boolean = false
  constructor() {}

  ngOnInit() {}

  ngOnchages() {}
}
