import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-header-catalogo',
  templateUrl: './header-catalogo.component.html',
  styleUrls: ['./header-catalogo.component.scss'],
})
export class HeaderCatalogoComponent implements OnInit {
  constructor(public cart: CartService, private root: RootService) {}

  ngOnInit() {}
}
