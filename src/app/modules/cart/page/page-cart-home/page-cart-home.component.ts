import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-page-cart-home',
  templateUrl: './page-cart-home.component.html',
  styleUrls: ['./page-cart-home.component.scss']
})
export class PageCartHomeComponent implements OnInit {
  logoSrc = environment.logoSrc;
  constructor() { }

  ngOnInit() {
  }

}
