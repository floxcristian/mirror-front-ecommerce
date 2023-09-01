import { Component, HostListener, OnInit } from '@angular/core';
import { isVacio } from '../../../../shared/utils/utilidades';
import { DirectionService } from '../../../../shared/services/direction.service';
import { PageHomeService } from '../../services/pageHome.service';

@Component({
  selector: 'app-slide-mundo',
  templateUrl: './slide-mundo.component.html',
  styleUrls: ['./slide-mundo.component.scss'],
})
export class SlideMundoComponent implements OnInit {
  innerWidth: any;
  style: any = [];
  isVacio = isVacio;
  carouselOptions = {
    nav: false,
    dots: true,
    loop: false,
    autoplay: false,
    responsiveClass: true,
    responsive: {
      1024: { items: 3 },
      0: { items: 1 },
    },
    rtl: this.direction.isRTL(),
  };

  carouselOptions2 = {
    nav: false,
    dots: true,
    loop: true,
    responsiveClass: true,
    autoplay: false,
    responsive: {
      0: { items: 1 },
    },
    rtl: this.direction.isRTL(),
  };
  slides: any[] = [];
  constructor(
    private direction: DirectionService,
    private pageHomeService: PageHomeService
  ) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.Carga_mundo();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  async Carga_mundo() {
    let consulta: any = await this.pageHomeService.get_mundo_cms().toPromise();
    this.slides = consulta.data;
    this.slides.forEach((item: any) => {
      this.style.push({
        cursor: 'pointer',
        'background-image': "url('" + item.image_overlay + "')",
      });
    });
  }
}
