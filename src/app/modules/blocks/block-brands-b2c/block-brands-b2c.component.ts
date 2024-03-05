// Angular
import { Component } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Constants
// Models
import { BRANDS } from '../../../../data/brands-images/brands-images';
import { IBrandImage } from '../../../../data/brands-images/brand-image.interface';

@Component({
  selector: 'app-block-brands-b2c',
  templateUrl: './block-brands-b2c.component.html',
  styleUrls: ['./block-brands-b2c.component.scss'],
})
export class BlockBrandsB2cComponent {
  imageUrl = environment.imageUrl;
  brands: IBrandImage[] = BRANDS;
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    lazyLoad: true,
    responsive: {
      1100: { items: 8 },
      920: { items: 8 },
      768: { items: 6 },
      680: { items: 6 },
      500: { items: 5 },
      0: { items: 3 },
    },
  };

  getParamTiendaOficial(brand: string) {
    if (['marcopolo', 'scania', 'randon'].includes(brand)) {
      return '&tiendaOficial=1';
    } else {
      return '';
    }
  }
}
