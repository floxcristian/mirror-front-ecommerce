import {
  Component,
  Input,
  TemplateRef,
  PLATFORM_ID,
  Inject,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectionService } from '../../../shared/services/direction.service';
import { SlidesService } from '../../../shared/services/slides.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-block-slideshow',
  templateUrl: './block-slideshow.component.html',
  styleUrls: ['./block-slideshow.component.scss'],
})
export class BlockSlideshowComponent implements OnInit {
  @Input() withDepartments = false;
  modalRef!: BsModalRef;

  innerWidth: number;
  options = {
    lazyLoad: true,
    dots: true,
    dragging: false,
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
  slides: any[] = [];

  isBrowser;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public sanitizer: DomSanitizer,
    private direction: DirectionService,
    private slidesService: SlidesService,
    private modalService: BsModalService,
    // Servicios V2
    private readonly cmsService: CmsService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.isBrowser = isPlatformBrowser('b2b');
  }

  cargarGaleria() {
    // this.slidesService.obtieneSlides().subscribe((r: any) => {
    //   this.slides = r.data;
    // });
    this.cmsService.getSliders().subscribe({
      next: (res) => {
        this.slides = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
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
