import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-approval',
  templateUrl: './order-approval.component.html',
  styleUrls: ['./order-approval.component.scss']
})
export class OrderApprovalComponent implements OnInit {

  constructor() { }
  title = [{
    name: "TEST DE PRODUCTO",
    description: "SKU: LIMCAR0016"
  }, {
    name: "TEST DE PRODUCTO 2",
    description: "SKU: LIMCAR0016"
  }];
  ngOnInit() {
  }

}
