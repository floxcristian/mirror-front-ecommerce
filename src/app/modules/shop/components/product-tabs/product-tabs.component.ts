import { Component, Input, ViewChild } from '@angular/core';
import { ProductReview, Product } from '../../../../shared/interfaces/product';
import { specification } from '../../../../../data/shop-product-spec';
import { reviews } from '../../../../../data/shop-product-reviews';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss'],
})
export class ProductTabsComponent {
  @ViewChild('staticTabs', { static: true }) staticTabs!: TabsetComponent;

  @Input() withSidebar = false;
  @Input() tab: 'description' | 'specification' | 'reviews' | 'stock' =
    'specification';
  innerWidth!: number;
  @Input() stock!: boolean;
  @Input() set product(value: Product) {
    this.producto = value;
    this.innerWidth = window.innerWidth;

    if (!this.stock) {
      //si no tiene stock, se deja seleccionada la primera pestaña.
      this.staticTabs.tabs[0].active = true;
    }
  }

  producto!: Product;
  specification = specification;
  reviews: ProductReview[] = reviews;
  tabsStock = true;
  tabsDescription = false;
  videoWidth: number = 0;
  videoHeight: number = 0;

  constructor() {
    this.setVideoDimensiones();
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

  getIdVideo(url: string) {
    let idVideo = url.split('/');
    return idVideo[idVideo.length - 1];
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    this.setVideoDimensiones();
  }

  setVideoDimensiones() {
    if (this.innerWidth > 1200) {
      this.videoWidth = 450;
      this.videoHeight = 250;
    } else {
      this.videoWidth = 300;
      this.videoHeight = 150;
    }
  }
}
