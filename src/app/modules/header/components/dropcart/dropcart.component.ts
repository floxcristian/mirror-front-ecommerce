// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// Env
import { environment } from '@env/environment';
// Rxjs
import { Subject } from 'rxjs';
import { takeUntil, map, first } from 'rxjs/operators';
// Libs
import { ToastrService } from 'ngx-toastr';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
// Services
import { SessionService } from '@core/states-v2/session.service';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';

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
  usuario!: ISession;
  IVA = environment.IVA;
  isVacio = isVacio;

  products: ProductCart[] = [];

  constructor(
    public cart: CartService,
    public root: RootService,
    private toast: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly geolocationService: GeolocationServiceV2
  ) {}

  onStoresLoaded(): void {
    this.geolocationService.stores$
      .pipe(first((stores) => stores.length > 0))
      .subscribe({
        next: () => {
          this.cart.load();
        },
      });
  }

  ngOnInit(): void {
    this.onStoresLoaded();
    this.usuario = this.sessionService.getSession();
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
