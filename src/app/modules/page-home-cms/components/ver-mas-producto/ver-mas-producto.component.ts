import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ver-mas-producto',
  templateUrl: './ver-mas-producto.component.html',
  styleUrls: ['./ver-mas-producto.component.scss'],
})
export class VerMasProductoComponent implements OnInit {
  data?: any;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
