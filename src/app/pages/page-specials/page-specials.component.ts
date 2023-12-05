import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { products } from '../../../data/shop-products';
import { categories } from '../../../data/shop-block-categories';
import { Category } from '../../shared/interfaces/category';
import { Banner } from '../../shared/interfaces/banner';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-specials',
  templateUrl: './page-specials.component.html',
  styleUrls: ['./page-specials.component.scss'],
})
export class PageSpecialsComponent implements OnInit {
  nombre: string | undefined = undefined;
  innerWidth: number;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((query: any) => {
      if (query.nombre) this.nombre = query.nombre;
    });
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
