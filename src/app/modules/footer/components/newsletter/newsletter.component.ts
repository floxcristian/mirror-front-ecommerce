import { Component, HostListener } from '@angular/core';
// import { theme } from '../../../../../data/theme';

@Component({
  selector: 'app-footer-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  // theme = theme;  // no se usa
  innerWidth = 0;
  constructor() {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }
}
