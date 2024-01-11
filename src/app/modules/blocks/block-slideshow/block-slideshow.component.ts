// Angular
import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// Libs
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// Models
import { ISlider } from '@core/models-v2/cms/slider-reponse.interface';
// Services
import { DirectionService } from '../../../shared/services/direction.service';
import { CmsService } from '@core/services-v2/cms.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-block-slideshow',
  templateUrl: './block-slideshow.component.html',
  styleUrls: ['./block-slideshow.component.scss'],
})
export class BlockSlideshowComponent implements OnInit {
  @Input() withDepartments = false;
  modalRef!: BsModalRef;

  options: OwlOptions = {
    // lazyLoad: false,
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
    rtl: this.direction.isRTL(),
    autoplaySpeed: 1000,
  };
  slides: ISlider[] = [];

  constructor(
    public sanitizer: DomSanitizer,
    private direction: DirectionService,
    private modalService: BsModalService,
    // Servicios V2
    private readonly cmsService: CmsService
  ) {}

  cargarGaleria() {
    this.cmsService.getSliders().subscribe({
      next: (res) => {
        this.slides = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openForm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  ngOnInit() {
    this.cargarGaleria();
  }

  delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
