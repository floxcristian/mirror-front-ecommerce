import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class DetallePedidoComponent implements OnInit {
  @Input() set ordenVenta(value: any) {
    this.n_ov = value;
  }
  @Output() listaProducto: EventEmitter<any> = new EventEmitter();

  n_ov = '';
  addingToCart = false;
  @Input() productos: any = [];
  @Input() index: Number = 0;
  constructor(public root: RootService, private cart: CartService, private toastr: ToastrService) {}

  async ngOnInit() {}

  addCart(item: any) {
    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.add(item, 1).subscribe(resp => {
      {
        this.addingToCart = false;
        if (!resp.error) {
          this.toastr.success(`Productos "${item.sku}" agregado al carro correctamente.`);
        }
      }
    });
  }

  addToCart() {
    this.listaProducto.emit(this.index);
  }
}
