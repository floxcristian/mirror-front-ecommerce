// Angular
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// Libs
import { OwlOptions } from 'ngx-owl-carousel-o';
// Models
import { ISlider } from '@core/models-v2/cms/slider-reponse.interface';
// Services
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-block-slideshow',
  templateUrl: './block-slideshow.component.html',
  styleUrls: ['./block-slideshow.component.scss'],
})
export class BlockSlideshowComponent implements OnInit {
  options: OwlOptions = {
    lazyLoad: true,
    dots: true,
    //dragging: false,
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 8000,
    nav: false,
    responsive: {
      0: { items: 1 },
    },
    autoplaySpeed: 1000,
  };
  slides: ISlider[] = [];

  constructor(
    public sanitizer: DomSanitizer,
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.cargarGaleria();
  }

  private cargarGaleria(): void {
    this.cmsService.getSliders().subscribe({
      next: (res) => {
        this.slides = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
