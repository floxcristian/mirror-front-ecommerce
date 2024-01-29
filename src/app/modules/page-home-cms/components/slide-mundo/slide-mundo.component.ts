// Angular
import { Component, OnInit } from '@angular/core';
// Services
import { isVacio } from '../../../../shared/utils/utilidades';
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-slide-mundo',
  templateUrl: './slide-mundo.component.html',
  styleUrls: ['./slide-mundo.component.scss'],
})
export class SlideMundoComponent implements OnInit {
  style: any = [];
  isVacio = isVacio;
  carouselOptions = {
    lazyLoad: true,
    nav: false,
    dots: true,
    loop: true,
    autoplay: false,
    responsiveClass: true,
    responsive: {
      1024: { items: 3 },
      0: { items: 1 },
    },
  };

  carouselOptions2 = {
    lazyLoad: true,
    nav: false,
    dots: true,
    loop: true,
    responsiveClass: true,
    autoplay: false,
    responsive: {
      0: { items: 1 },
    },
  };
  slides: any[] = [];
  constructor(private readonly cmsService: CmsService) {}

  ngOnInit() {
    this.Carga_mundo();
  }

  async Carga_mundo() {
    this.cmsService.getWorlds().subscribe({
      next: (res) => {
        this.slides = res.data;
        this.slides.forEach((item: any) => {
          this.style.push({
            cursor: 'pointer',
            'background-image': "url('" + item.imageOverlay + "')",
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
