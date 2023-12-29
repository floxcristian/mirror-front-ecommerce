// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { IValueBox } from '@core/models-v2/cms/valueBox-response.interface';
// Services
import { DirectionService } from '../../services/direction.service';
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-buttons-slideshow',
  templateUrl: './buttons-slideshow.component.html',
  styleUrls: ['./buttons-slideshow.component.scss'],
})
export class ButtonsSlideshowComponent implements OnInit {
  botones1: IValueBox[] = [];

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
    private direction: DirectionService,
    // Services V2
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.getValueBoxes();
  }

  getValueBoxes(): void {
    this.cmsService.getValueBoxes().subscribe({
      next: (valueBoxes) => {
        this.botones1 = valueBoxes;
        console.log('valueBoxes: ', valueBoxes);
      },
      error: (err) => console.log(err),
    });
  }
}
