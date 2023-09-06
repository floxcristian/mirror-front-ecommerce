import { Component, OnInit } from '@angular/core';
import { products } from '../../../data/shop-products';
import { categories } from '../../../data/shop-block-categories';
import { Category } from '../../shared/interfaces/category';
import { Banner } from '../../shared/interfaces/banner';
import { CmsService } from '../../shared/services/cms.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-specials',
  templateUrl: './page-specials.component.html',
  styleUrls: ['./page-specials.component.scss'],
})
export class PageSpecialsComponent implements OnInit {
  products = products;
  categories: Category[] = categories;
  banners: Banner[] = [];
  nombre: string | undefined = undefined;
  innerWidth: number;
  viewMode: 'grid' | 'grid-with-features' | 'list' = 'grid';

  constructor(private cmsService: CmsService, private route: ActivatedRoute) {
    this.innerWidth = window.innerWidth;
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
