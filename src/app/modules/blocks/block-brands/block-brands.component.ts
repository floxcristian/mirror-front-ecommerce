import { Component, Input, Inject } from '@angular/core';
import { DirectionService } from '../../../shared/services/direction.service';
// import { WINDOW } from 'ngx-owl-carousel-o/lib/services/window-ref.service';  // no se usa

@Component({
  selector: 'app-block-brands',
  templateUrl: './block-brands.component.html',
  styleUrls: ['./block-brands.component.scss'],
})
export class BlockBrandsComponent {
  @Input() brands: any[] = [];
  innerWidth: number;

  carouselOptions = {
    lazyLoad: true,
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 30000,
    responsive: {
      1100: { items: 6 },
      920: { items: 3 },
      680: { items: 3 },
      500: { items: 2 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
    autoplaySpeed: 5000,
  };

  constructor(private direction: DirectionService) {
    this.innerWidth = window.innerWidth;
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
