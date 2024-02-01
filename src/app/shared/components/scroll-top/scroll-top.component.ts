import { Component, OnInit, HostListener, Input, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit {
  windowScrolled!: boolean;
  @Input() fast = false;
  constructor(private renderer:Renderer2) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const body_e = this.renderer.selectRootElement('body',true) // safari
    const html_e = this.renderer.selectRootElement('html',true) //other
    if (
      window.pageYOffset ||
      html_e.scrollTop ||
      body_e.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      html_e.scrollTop ||
      body_e.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    const body_e = this.renderer.selectRootElement('body',true) // safari
    const html_e = this.renderer.selectRootElement('html',true) //other
    if (this.fast) {
      window.scrollTo({ top: 0 });
      this.renderer.setProperty(body_e,'scrollTop',0)
      this.renderer.setProperty(html_e,'scrollTop',0)
    } else {
      (function smoothscroll() {
        let currentScroll = html_e.scrollTop || body_e.scrollTop
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 8);
        }
      })();
    }
  }
  ngOnInit() {}
}
