import { Component, OnInit, Input } from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { DirectionService } from '../../../../shared/services/direction.service'

@Component({
  selector: 'app-productos-catalog-tv',
  templateUrl: './productos-catalog-tv.component.html',
  styleUrls: ['./productos-catalog-tv.component.scss'],
})
export class ProductosCatalogTvComponent implements OnInit {
  @Input() images: any

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
      0: { items: 1 },
    },
    autoplaySpeed: 5000,
  }

  constructor(private direction: DirectionService) {}

  ngOnInit() {}
}
