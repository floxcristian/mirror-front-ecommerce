import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isVacio } from '../../../../shared/utils/utilidades';
import { DirectionService } from '../../../../shared/services/direction.service';
import { isPlatformBrowser } from '@angular/common';
import { CmsService } from '@core/services-v2/cms.service';

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
    @Inject(PLATFORM_ID) private platformId: Object,
    //Services V2
    private readonly cmsService: CmsService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.Carga_mundo();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
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
