import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-page-registro-usuario',
  templateUrl: './page-registro-usuario.component.html',
  styleUrls: ['./page-registro-usuario.component.scss'],
})
export class PageRegistroUsuarioComponent implements OnInit {
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
