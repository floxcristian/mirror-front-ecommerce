import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-page-registro-usuario-b2b',
  templateUrl: './page-registro-usuario-b2b.component.html',
  styleUrls: ['./page-registro-usuario-b2b.component.scss'],
})
export class PageRegistroUsuarioB2BComponent implements OnInit {
  innerWidth: number;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {}
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
