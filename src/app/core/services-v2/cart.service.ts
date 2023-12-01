// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_CART = `${environment.apiEcommerce}/api/v1/shopping-cart`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  getPriceArticle(params: {
    sku: string;
    branch: string;
    documentId: string;
  }) {
    return this.http.get(API_CART, {
      params,
    });
  }
}
