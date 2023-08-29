import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-registro-ok-modal',
  templateUrl: './registro-ok-modal.component.html',
  styleUrls: ['./registro-ok-modal.component.scss'],
})
export class RegistroOkModalComponent implements OnInit {
  nombre!: string;

  constructor(public ModalRef: BsModalRef) {}

  ngOnInit() {}
}
