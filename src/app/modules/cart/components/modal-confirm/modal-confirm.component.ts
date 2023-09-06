import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit {
  modalRef!: BsModalRef;

  @Input() set fechaEvent(value: any) {
    this.fecha = value;
  }
  fecha: any = [];
  estado: boolean = false;
  constructor() {}

  ngOnInit() {}

  ngOnchages() {}
}
