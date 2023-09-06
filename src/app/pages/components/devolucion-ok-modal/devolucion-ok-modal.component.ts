import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-devolucion-ok-modal',
  templateUrl: './devolucion-ok-modal.component.html',
  styleUrls: ['./devolucion-ok-modal.component.scss'],
})
export class DevolucionOkModalComponent implements OnInit {
  constructor(public ModalRef: BsModalRef) {}

  ngOnInit() {}
}
