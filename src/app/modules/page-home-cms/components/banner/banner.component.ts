import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() set banner(value: any) {
    this.elementoData = value;
    this.bannerCms = this.elementoData.element;
  }
  bannerCms: any;
  elementoData: any;
}
