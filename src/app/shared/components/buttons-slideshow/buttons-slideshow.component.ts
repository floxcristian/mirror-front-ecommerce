import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageHomeService } from '../../../modules/page-home-cms/services/pageHome.service';
import { DirectionService } from '../../services/direction.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-buttons-slideshow',
  templateUrl: './buttons-slideshow.component.html',
  styleUrls: ['./buttons-slideshow.component.scss'],
})
export class ButtonsSlideshowComponent implements OnInit {
  botones1: any[] = [];
  screenWidth: any;
  screenHeight: any;
  style: any = {};

  options = {
    lazyLoad: true,
    dots: false,
    dragging: false,
    loop: true,
    autoplay: false,
    autoplayHoverPause: true,
    autoplayTimeout: 8000,

    nav: false,
    responsive: {
      0: { items: 1.5 },
      700: { items: 2.5 },
    },
    rtl: this.direction.isRTL(),
    autoplaySpeed: 3000,
  };

  constructor(
    private pagehomeService: PageHomeService,
    private direction: DirectionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900;
  }

  ngOnInit() {
    this.getCajaValor();
  }

  async getCajaValor() {
    await this.pagehomeService.getCajaValor().subscribe((data: any) => {
      this.botones1 = data.data;
    });
  }
}
