import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-template-productos-dinamico',
  templateUrl: './template-productos-dinamico.component.html',
  styleUrls: ['./template-productos-dinamico.component.scss'],
})
export class TemplateProductosDinamicoComponent implements OnInit {
  @Input() objeto: any;
  @Output() agregarCarro: EventEmitter<any> = new EventEmitter();
  @Input() innerWidth!: number;
  addingToCart = false;
  @Input() tipoCatalogo: any;
  precios: boolean = true;
  carro: boolean = true;

  constructor(public cart: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    switch (this.tipoCatalogo) {
      case 'Vendedor':
        this.carro = false;
        break;
      case 'Distribuidor':
        this.precios = false;
        this.carro = false;
        break;
    }
  }
  addToCart(producto: any): void {
    producto.imagen = `https://images.implementos.cl/img/250/${producto.sku}-1.jpg`;

    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.add(producto, 1).subscribe({
      complete: () => {
        this.addingToCart = false;
        this.cd.markForCheck();
      },
    });
  }
}
