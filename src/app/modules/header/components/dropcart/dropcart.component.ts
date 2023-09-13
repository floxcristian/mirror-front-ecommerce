import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';
import { Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../../shared/interfaces/login';
import { environment } from '../../../../../environments/environment';
import { isVacio } from '../../../../shared/utils/utilidades';

interface Item {
  ProductCart: ProductCart;
  quantity: number;
  quantityControl: FormControl;
}

@Component({
  selector: 'app-header-dropcart',
  templateUrl: './dropcart.component.html',
  styleUrls: ['./dropcart.component.scss'],
})
export class DropcartComponent implements OnInit, OnDestroy {
  removedItems: ProductCart[] = [];

  private destroy$: Subject<void> = new Subject();

  // items: Item[] = [];
  items: any[] = [];
  updating = false;
  saveTimer: any;
  saveTimerLocalCart: any;
  usuario!: Usuario;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;

  products: ProductCart[] = [];

  constructor(
    public cart: CartService,
    public root: RootService,
    private toast: ToastrService
  ) {
    this.cart.load();
  }

  ngOnInit(): void {
    this.usuario = this.root.getDataSesionUsuario();

    this.cart.items$
      .pipe(
        takeUntil(this.destroy$),
        map((ProductCarts) =>
          (ProductCarts || []).map((item) => {
            return {
              ProductCart: item,
              quantity: item.cantidad,
              quantityControl: new FormControl(
                item.cantidad,
                Validators.required
              ),
            };
          })
        )
      )
      .subscribe((items) => {
        this.items = items;
      });
  }

  remove(item: ProductCart): void {
    this.cart.remove(item).subscribe((r) => {});
  }

  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();
  }

  async updateCart(cantidad: any, item: any) {
    if (cantidad < 1) {
      cantidad = 1;
      this.toast.error('No se permiten números negativos en la cantidad');
    }

    item.ProductCart.cantidad = cantidad;
    const productos: ProductCart[] = [];
    this.items.map((r) => {
      productos.push(r.ProductCart);
    });
    clearTimeout(this.saveTimerLocalCart);
    this.saveTimerLocalCart = setTimeout(() => {
      this.cart.saveCart(productos).subscribe((r) => {
        for (const el of r.data.productos) {
          if (el.sku == item.ProductCart.sku) {
            item.ProductCart.conflictoEntrega = el.conflictoEntrega;
            item.ProductCart.entregas = el.entregas;
            item.ProductCart.precio = el.precio;
          }
        }
        this.cart.updateCart(productos);
      });
    }, 100);
  }

  saveCart() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      const productos = this.items.map((item) => {
        return {
          sku: item.ProductCart.sku,
          cantidad: item.quantity,
        };
      });
      this.cart.saveCart(productos).subscribe((r) => {});
    }, 700);
  }
}
