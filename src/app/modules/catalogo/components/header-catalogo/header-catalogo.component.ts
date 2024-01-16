import { Component, OnInit } from '@angular/core';
import { CartService } from '@core/services-v2/cart.service';

@Component({
  selector: 'app-header-catalogo',
  templateUrl: './header-catalogo.component.html',
  styleUrls: ['./header-catalogo.component.scss'],
})
export class HeaderCatalogoComponent implements OnInit {
  constructor(
    //Servicesv2
    public cart: CartService,) {}

  ngOnInit() {}
}
