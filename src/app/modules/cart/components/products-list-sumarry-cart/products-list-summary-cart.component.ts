import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';
import { isPlatformBrowser } from '@angular/common';
import { IShoppingCartProduct } from '@core/models-v2/cart/shopping-cart.interface';

@Component({
  selector: 'app-products-list-summary-cart',
  templateUrl: './products-list-summary-cart.component.html',
  styleUrls: ['./products-list-summary-cart.component.scss'],
})
export class ProductsListSummaryCartComponent implements OnInit {
  productoList: IShoppingCartProduct[] | any[] = [];
  innerWidth!: number;

  @Input() set products(value: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.productoList = value;
  }

  constructor(
    public root: RootService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
