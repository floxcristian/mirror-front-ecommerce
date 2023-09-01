import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  screenWidth: any;
  screenHeight: any;
  @Input() set banner(value: any) {
    this.elementoData = value;
    this.bannerCms = this.elementoData.elemento;
  }
  bannerCms: any;
  elementoData: any;
  constructor() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
}
