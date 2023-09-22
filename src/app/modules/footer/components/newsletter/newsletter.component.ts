import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
// import { theme } from '../../../../../data/theme';

@Component({
  selector: 'app-footer-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
})
export class NewsletterComponent {
  // theme = theme;  // no se usa
  innerWidth = 0;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    console.log(this.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    console.log(this.innerWidth);
  }
}
