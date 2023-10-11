import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductCart } from '../../interfaces/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-cart-min',
  templateUrl: './alert-cart-min.component.html',
  styleUrls: ['./alert-cart-min.component.scss'],
})
export class AlertCartMinComponent implements OnInit {
  showAlert = false;
  closeAlert = false;
  productDef!: ProductCart;
  timer: any;

  @Input() set product(value: ProductCart) {
    if (typeof value !== undefined) {
      this.productDef = value;
    }
  }

  constructor(public bsModalRef: BsModalRef, public router: Router) {}

  ngOnInit() {}

  show(value: any) {
    if (this.router.url === '/carro-compra/resumen') this.showAlert = false;
    else this.showAlert = value;
    // setTimeout(() => {
    //   clearTimeout(this.timer);
    //   this.showAlert = value;
    //   this.timer = setTimeout(() => {
    //     this.showAlert = false;
    //   }, 2500);
    // }, 100);
  }

  hide() {
    this.showAlert = false;
  }

  go_to() {
    this.showAlert = false;
    this.router.navigate(['/carro-compra/resumen']);
  }
}
