// Angular
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Data mock
import { brandsB2c } from '../../../data/shop-brands-b2c';

@Component({
  selector: 'app-home',
  templateUrl: './page-home-one.component.html',
  styleUrls: ['./page-home-one.component.scss'],
})
export class PageHomeOneComponent implements OnInit {
  brandsB2c = brandsB2c;
  marcas = false;
  galeria = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.cargaParcializada();
  }

  cargaParcializada() {
    this.galeria = true;
    let tiempo = 0;

    if (isPlatformBrowser(this.platformId)) {
      tiempo = 3500;
    }
    this.marcas = true;
  }
}
