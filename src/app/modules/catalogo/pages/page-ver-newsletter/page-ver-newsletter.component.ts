import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlipSetting, PageFlip, SizeType } from 'page-flip';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { INewsletter, IPage } from '@core/models-v2/catalog/catalog-response.interface';
import { CatalogService } from '@core/services-v2/catalog.service';

@Component({
  selector: 'app-page-ver-newsletter',
  templateUrl: './page-ver-newsletter.component.html',
  styleUrls: ['./page-ver-newsletter.component.scss'],
})
export class PageVerNewsletterComponent implements OnInit {
  cargandoCat!: boolean;
  pageFlip: any;
  array = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  screenWidth!: number;
  screenHeight!: number;
  pageTotal!: number;
  pageCurrent: number = 1;
  pageState: any;
  data!: INewsletter;
  portada!: string;
  contraportada!: string;
  vertical!: boolean;
  dispositivo: string = '';

  constructor(
    private responsive: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    //Servicesv2
    private readonly catalogService:CatalogService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 1;
    if(isPlatformBrowser(this.platformId)){
      this.responsive
      .observe([
        Breakpoints.TabletPortrait,
        Breakpoints.HandsetPortrait,
        Breakpoints.WebPortrait,
        Breakpoints.WebLandscape,
        Breakpoints.Web,
        Breakpoints.HandsetLandscape,
      ])
      .subscribe((result) => {
        this.pageFlip = null;
        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.dispositivo = 'tablet';
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.dispositivo = 'smartphone';
        } else if (
          breakpoints[Breakpoints.WebLandscape] ||
          breakpoints[Breakpoints.WebPortrait] ||
          breakpoints[Breakpoints.Web]
        ) {
          this.dispositivo = 'web';
        } else {
          if (breakpoints[Breakpoints.HandsetLandscape]) this.vertical = true;
          this.dispositivo = 'tablet';
        }
      });
      this.screenWidth = isPlatformBrowser(this.platformId)
        ? window.innerWidth
        : 900;
      this.screenHeight = isPlatformBrowser(this.platformId)
        ? window.innerHeight
        : 900;
      this.ObtenerDatos(id);
      setTimeout(() => {
        this.loadFlip();
      }, 1300);
    }
  }

  async ObtenerDatos(id: any) {
      this.catalogService.getNewsletter(id).subscribe({
        next:(res)=>{
          this.data = res.data
          let page_portada:IPage = res.data.pages.shift() as IPage;
          let page_contraportada:IPage = res.data.pages.pop() as IPage;
          this.portada = page_portada.image;
          this.contraportada = page_contraportada.image;
        },
        error:(err)=>{
          console.log(err)
          this.router.navigate(['/not-found']);
        }
      })
  }
  abrirEnlace(link: any) {
    if (link) window.open(link, '_blank');
  }
  flipNext() {
    this.pageFlip.flipNext();
  }

  altoPantalla: number = 0;
  anchoPantalla: number = 0;
  ObtenerTamanoPantalla() {
    this.altoPantalla = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900;
    this.anchoPantalla = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
  nextPage() {
    let por = this.pageFlip.getOrientation();
    if (this.dispositivo === 'smartphone' || por === 'portrait') {
      if (this.pageCurrent < this.pageTotal) {
        this.pageFlip.turnToNextPage();
      }
    } else
      this.pageFlip.flipNext();
  }

  prevPage() {
    let por = this.pageFlip.getOrientation();
    this.dispositivo === 'smartphone' || por === 'portrait'
      ? this.pageFlip.turnToPrevPage()
      : this.pageFlip.flipPrev();
  }

  loadFlip() {
    let duracion = 1000;
    if (this.dispositivo === 'smartphone') {
      const htmlElement = document.getElementById(
        'demoBookExample'
      ) as HTMLElement;
      const pageFlipSettings: Partial<FlipSetting> = {
        width: 500,
        height: 707,
        size: 'stretch' as SizeType.STRETCH,
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 800,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: true,
        disableFlipByClick: true,
        useMouseEvents: false,
        flippingTime: 800,
        clickEventForward: true,
        showPageCorners: false,
        swipeDistance: 20,
        startZIndex: 1,
      };

      this.pageFlip = new PageFlip(htmlElement, pageFlipSettings);
    }
    if (this.dispositivo === 'web') {
      this.ObtenerTamanoPantalla();
      let width;
      let height;
      if (this.anchoPantalla > 1000 && this.anchoPantalla <= 1440) {
        // Notebook
        width = this.anchoPantalla / 3;
        height = this.altoPantalla / 1.1;
      } else {
        // Escritorio
        width = this.anchoPantalla / 3;
        height = this.altoPantalla / 1.1;
      }

      const pageFlipSettings: Partial<FlipSetting> = {
        width,
        height,
        size: 'fixed' as SizeType,
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
        usePortrait: false,
        maxShadowOpacity: 0,
        showCover: true,
        mobileScrollSupport: false,
        flippingTime: duracion,
        showPageCorners: false,
      };
      const htmlElement = document.getElementById(
        'demoBookExample'
      ) as HTMLElement;
      this.pageFlip = new PageFlip(htmlElement, pageFlipSettings);
    }
    if (this.dispositivo === 'tablet') {
      const htmlElement = document.getElementById(
        'demoBookExample'
      ) as HTMLElement;
      const pageFlipSettings: Partial<FlipSetting> = {
        width: 550,
        height: 733,
        size: 'stretch' as SizeType,
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 800,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false,
        clickEventForward: true,
      };
      this.pageFlip = new PageFlip(htmlElement, pageFlipSettings);
    }
    this.pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    this.pageFlip.on('flip', (e: any) => {
      this.pageCurrent = e.data + 1;
    });
    this.pageFlip.on('changeState', (e: any) => {
      this.pageState = e.data;
    });
    this.pageFlip.on('changeOrientation', (e: any) => {
      this.ngOnInit();
    });
  }
}
