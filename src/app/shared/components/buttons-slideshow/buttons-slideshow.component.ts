import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageHomeService } from '../../../modules/page-home-cms/services/pageHome.service';
import { DirectionService } from '../../services/direction.service';
import { isPlatformBrowser } from '@angular/common';
import { CmsService } from '@core/services-v2/cms.service';

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
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly cmsService: CmsService
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

  async getCajaValor(): Promise<void> {
    // await this.pagehomeService.getCajaValor().subscribe((data: any) => {
    //   this.botones1 = data.data;
    // });
    await this.cmsService.getValueBoxes().subscribe({
      next: (res) => {
        this.botones1 = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
