import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-topbar-mobile',
  templateUrl: './topbar-mobile.component.html',
  styleUrls: ['./topbar-mobile.component.scss'],
})
export class TopbarMobileComponent implements OnInit {
  logoSrc = environment.logoSrc;
  constructor(private router: Router) {}

  ngOnInit() {
    this.Hide_menub2c();
  }

  Hide_menub2c() {
    if (this.router.url.includes('/carro-compra/')) {
      return false;
    } else {
      return true;
    }
  }

  navegar() {
    this.router.navigate(['/inicio']);
  }
}
