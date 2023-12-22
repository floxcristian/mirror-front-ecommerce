import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { posts } from '../../../data/blog-posts';
import { brands } from '../../../data/shop-brands';
import { products } from '../../../data/shop-products';
import { isPlatformBrowser } from '@angular/common';
import { brandsB2c } from '../../../data/shop-brands-b2c';
import { SessionService } from '@core/services-v2/session/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './page-home-one.component.html',
  styleUrls: ['./page-home-one.component.scss'],
})
export class PageHomeOneComponent implements OnInit {
  products = products;
  banners: any = [];

  posts = posts;
  brands = brands;
  brandsB2c = brandsB2c;

  videos = [
    {
      url: 'assets/videos/UsurioNuevo.mov',
      preview: 'assets/videos/p1.jpg',
    },
    {
      url: 'assets/videos/UsuarioRegistrado.mov',
      preview: 'assets/videos/p2.jpg',
    },
  ];

  innerWidth: number;

  categoriaPopulares = false;
  cajaConceptos = false;
  banner = false;
  marcas = false;
  galeria = false;

  isB2B!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly sessionService: SessionService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.banners = [
      {
        url: 'https://www.implementos.cl/sitio/blog',
        target: '_self',
        image_full:
          '../../../assets/images/slides/blog/Banner-blog-v2-1920X400-px.webp',
        image_mobile:
          '../../../assets/images/slides/blog/Banner-movil-414X300.webp',
        image_tablet:
          '../../../assets/images/slides/blog/Banner-tablet-1024X300.webp',
      },
      {
        url: 'https://www.implementos.cl/sitio/tiendas',
        target: '_self',
        image_full: '../../../assets/images/slides/tiendas/MAPS-1920x400.webp',
        image_mobile:
          '../../../assets/images/slides/tiendas/tiendas_mobile.webp',
        image_tablet: '../../../assets/images/slides/tiendas/TIENDAS.webp',
      },
    ];
    const user = this.sessionService.getSession();
    const userRole = user.userRole;
    this.isB2B = ['supervisor', 'comprador'].includes(userRole || '');

    this.cargaParcializada();
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  cargaParcializada() {
    this.galeria = true;
    let tiempo = 0;

    if (isPlatformBrowser(this.platformId)) {
      tiempo = 3500;
    }

    this.categoriaPopulares = true;
    this.cajaConceptos = true;
    this.banner = true;
    this.marcas = true;
  }
}
