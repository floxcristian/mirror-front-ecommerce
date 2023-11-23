import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-addcart-button',
  templateUrl: './addcart-button.component.html',
  styleUrls: ['./addcart-button.component.scss'],
})
export class AddcartButtonComponent implements OnInit {
  @Input() addingToCart!: boolean;
  @Input() disponibilidad!: boolean;

  @Output() quantity: EventEmitter<any> = new EventEmitter();
  cantidad: FormControl = new FormControl(1);
  constructor(public route: Router, private cartService: CartService) {}

  ngOnInit() {}

  addToCart() {
    this.cartService.addProductfromMovilButton();
  }

  HideButton(): boolean {
    if (this.route.url.indexOf('productos/ficha') == -1) {
      return true;
    } else {
      return false;
    }
  }

  updateCart(event: any) {
    this.quantity.emit(event);
  }
}
