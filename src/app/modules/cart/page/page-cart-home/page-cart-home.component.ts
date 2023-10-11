import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-page-cart-home',
  templateUrl: './page-cart-home.component.html',
  styleUrls: ['./page-cart-home.component.scss'],
})
export class PageCartHomeComponent {
  logoSrc = environment.logoSrc;
  constructor() {}
}
