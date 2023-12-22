// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Envs
import { environment } from '@env/environment';
// Models
import {
  IShoppingCart,
  IShoppingCartProductOrigin,
} from '@core/models-v2/cart/shopping-cart.interface';

const API_CART = `${environment.apiEcommerce}/api/v1/shopping-cart`;

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Agregar producto al carro de compras.
   */
  addToCart(params: {
    sku: string;
    name: string;
    origin: IShoppingCartProductOrigin;
    quantity: number;
  }) {
    const { sku, name, origin, quantity } = params;

    /*return this.http.post<IShoppingCart>(`${API_CART}/article`, {
      documentId,
      branch: storeCode,
      user: username || email,
      products: [
        {
          sku: sku,
          quantity: currentQuantity + quantity,
          origin: origin || null,
          // status: product.status,
        },
      ],
    });*/
  }
}
