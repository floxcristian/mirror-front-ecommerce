import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductCart } from '../../interfaces/cart-item';

@Component({
  selector: 'app-alert-cart',
  templateUrl: './alert-cart.component.html',
  styleUrls: ['./alert-cart.component.scss'],
})
export class AlertCartComponent implements OnInit {
  @Input() product!: ProductCart;
  @Input() modalRef!: BsModalRef;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
