import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-cart-request-success',
  templateUrl: './page-cart-request-success.component.html',
  styleUrls: ['./page-cart-request-success.component.scss'],
})
export class PageCartRequestSuccessComponent implements OnInit {
  count = 1;
  constructor(private router: Router) {
    /*setTimeout(() => {
      this.router.navigate(['/inicio'])
    .then(() => {
        window.location.reload();
    });
  }, 3000);*/
  }

  ngOnInit() {
    //window.location.reload();
  }

  inicio() {
    this.router.navigate(['/inicio']).then(() => {
      window.location.reload();
    });
  }
}
