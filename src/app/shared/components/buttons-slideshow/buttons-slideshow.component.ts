import { Component, OnInit } from '@angular/core';
import { PageHomeService } from '../../../modules/page-home-cms/services/pageHome.service';
import { DirectionService } from '../../services/direction.service';

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
    private direction: DirectionService
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
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
