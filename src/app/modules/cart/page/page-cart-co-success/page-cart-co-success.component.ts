import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-cart-co-success',
  templateUrl: './page-cart-co-success.component.html',
  styleUrls: ['./page-cart-co-success.component.scss'],
})
export class PageCartCoSuccessComponent {
  numero = 0;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.numero = params['numero'];
    });
  }
}
