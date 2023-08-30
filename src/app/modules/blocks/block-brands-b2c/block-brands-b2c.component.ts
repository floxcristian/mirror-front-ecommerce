import { Component, Input, OnInit } from '@angular/core';
import { DirectionService } from '../../../shared/services/direction.service';

@Component({
  selector: 'app-block-brands-b2c',
  templateUrl: './block-brands-b2c.component.html',
  styleUrls: ['./block-brands-b2c.component.scss']
})
export class BlockBrandsB2cComponent {
  @Input() brands: any[] = [];
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {
      1100: { items: 8 },
      920: { items: 8 },
      768: { items: 6 },
      680: { items: 6 },
      500: { items: 5 },
      0: { items: 3 }
    },
    rtl: this.direction.isRTL()
  };
  constructor(private direction: DirectionService) {}
}
