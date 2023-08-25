import { Component, ɵConsole, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { posts } from '../../../data/blog-posts';
import { brands } from '../../../data/shop-brands';
import { products } from '../../../data/shop-products';
import { categories } from '../../../data/shop-block-categories';
import { Category } from '../../shared/interfaces/category';
import { CmsService } from '../../shared/services/cms.service';
import { isPlatformBrowser } from '@angular/common';
import { RootService } from '../../shared/services/root.service';
import { brandsB2c } from '../../../data/shop-brands-b2c';

@Component({
    selector: 'app-home',
    templateUrl: './page-home-one.component.html',
    styleUrls: ['./page-home-one.component.scss']
})
export class PageHomeOneComponent implements OnInit {
    products = products;
    categories: Category[] = categories;
    banners: any = [];

    posts = posts;
    brands = brands;
    brandsB2c = brandsB2c;

    videos = [
        {
            url: 'assets/videos/UsurioNuevo.mov',
            preview: 'assets/videos/p1.jpg'
        },
        {
            url: 'assets/videos/UsuarioRegistrado.mov',
            preview: 'assets/videos/p2.jpg'
        }
    ];

    innerWidth: number;

    categoriaPopulares = false;
    cajaConceptos = false;
    banner = false;
    marcas = false;
    galeria = false;

    isB2B: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any, private cmsService: CmsService, private rootService: RootService) {
        this.innerWidth = window.innerWidth;
    }

    ngOnInit() {
        // this.cmsService.obtenerBanners().subscribe((r: any) => {
        //     this.banners = r.data.filter(banners => banners.position === "homepage");
        // });
        this.banners = [
            {
                url: 'https://www.implementos.cl/sitio/blog',
                target: '_self',
                image_full: '../../../assets/images/slides/blog/Banner-blog-v2-1920X400-px.webp',
                image_mobile: '../../../assets/images/slides/blog/Banner-movil-414X300.webp',
                image_tablet: '../../../assets/images/slides/blog/Banner-tablet-1024X300.webp'
            },
            {
                url: 'https://www.implementos.cl/sitio/tiendas',
                target: '_self',
                image_full: '../../../assets/images/slides/tiendas/MAPS-1920x400.webp',
                image_mobile: '../../../assets/images/slides/tiendas/tiendas_mobile.webp',
                image_tablet: '../../../assets/images/slides/tiendas/TIENDAS.webp'
            }
        ];
        const role = this.rootService.getDataSesionUsuario().user_role;
        this.isB2B = role === 'supervisor' || role === 'comprador';

        this.cargaParcializada();
    }

    onResize(event) {
        this.innerWidth = event.target.innerWidth;
    }

    cargaParcializada() {
        this.galeria = true;
        let tiempo = 0;

        if (isPlatformBrowser(this.platformId)) {
            tiempo = 3500;
        }

        // setTimeout(() => {
        this.categoriaPopulares = true;
        this.cajaConceptos = true;
        this.banner = true;
        this.marcas = true;
        // }, tiempo);
    }
}
