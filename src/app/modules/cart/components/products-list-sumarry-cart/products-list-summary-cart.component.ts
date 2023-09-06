import { Component, OnInit, Input } from '@angular/core';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-products-list-summary-cart',
  templateUrl: './products-list-summary-cart.component.html',
  styleUrls: ['./products-list-summary-cart.component.scss'],
})
export class ProductsListSummaryCartComponent implements OnInit {
  productoList: ProductCart[] = [];
  innerWidth!: number;

  @Input() set products(value: any) {
    this.innerWidth = window.innerWidth;
    this.productoList = value;
  }

  constructor(private root: RootService) {}

  ngOnInit() {}

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
