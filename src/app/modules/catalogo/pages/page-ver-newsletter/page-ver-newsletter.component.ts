import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { FlipSetting, PageFlip, SizeType } from 'page-flip';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

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
  pageTotal: any;
  pageCurrent: any = 1;
  pageState: any;
  data!: any;
  portada!: any;
  contraportada!: any;
  vertical!: any;

  constructor(
    private responsive: BreakpointObserver,
    private catalogoService: CatalogoService
  ) {}

  ngOnInit() {
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
          console.log(this.vertical);

          this.dispositivo = 'tablet';
        }
      });
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log(this.dispositivo);
    this.ObtenerDatos();
    setTimeout(() => {
      this.loadFlip();
    }, 1300);
  }
  async ObtenerDatos() {
    try {
      let respuesta = await this.catalogoService.obtenerNewsletter(1);
      this.portada = respuesta.data.paginas.shift();
      this.contraportada = respuesta.data.paginas.pop();
      this.portada = this.portada.imagen;
      this.contraportada = this.contraportada.imagen;
      this.data = respuesta.data;
      console.log(this.data);
    } catch (error) {
      console.log(error);
    }
  }
  abrirEnlace(link: any) {
    console.log('click');

    if (link) window.open(link, '_blank');
  }
  flipNext() {
    this.pageFlip.flipNext();
  }
  flipBack() {
    this.pageFlip.flipPrev();
  }
  altoPantalla: number = 0;
  anchoPantalla: number = 0;
  ObtenerTamanoPantalla() {
    this.altoPantalla = window.innerHeight;
    this.anchoPantalla = window.innerWidth;
  }

  dispositivo: string = '';
  nextPage() {
    let por = this.pageFlip.getOrientation();
    if (this.dispositivo === 'smartphone' || por === 'portrait') {
      if (this.pageCurrent < this.pageTotal) {
        this.pageFlip.turnToNextPage();
      }
    } else {
      this.pageFlip.flipNext();
    }
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
        size: SizeType.STRETCH,
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
        console.log(this.anchoPantalla);
      } else {
        // Escritorio
        width = this.anchoPantalla / 3;
        height = this.altoPantalla / 1.1;
      }

      const pageFlipSettings: Partial<FlipSetting> = {
        width,
        height,
        size: SizeType.FIXED,
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
        size: SizeType.STRETCH,
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
