import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() title!: string;
  @Input() body!: string;
  @Input() textBtnFalse!: any;
  @Input() textBtnTrue!: any;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  aceptar() {
    if (this.bsModalRef.content.callback != null) {
      this.bsModalRef.content.callback(true);
      this.bsModalRef.hide();
    }
  }

  rechazar() {
    if (this.bsModalRef.content.callback != null) {
      this.bsModalRef.content.callback(false);
      this.bsModalRef.hide();
    }
  }

  cerrar() {
    this.bsModalRef.hide();
  }
}
