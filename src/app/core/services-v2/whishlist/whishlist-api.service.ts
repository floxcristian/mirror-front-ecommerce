// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, map } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Models
import {
  IWishlist,
  IWishlistResponse,
} from './models/whishlist-response.interface';
import { IProductsFromFileResponse } from './models/product-from-file-response.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class WishlistApiService {
  constructor(private http: HttpClient) {}

  getWishlists(documentId: string): Observable<IWishlist[]> {
    return this.http
      .get<IWishlistResponse>(`${API_CUSTOMER}/${documentId}/article-list`)
      .pipe(map((res) => res.articleList || []));
  }

  updateWishlist(params: {
    documentId: string;
    wishlistId: string;
    name: string;
  }): Observable<void> {
    const { documentId, wishlistId, name } = params;
    return this.http.put<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}`,
      {
        name,
      }
    );
  }

  deleteWishlist(documentId: string, wishlistId: string): Observable<void> {
    return this.http.delete<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}`
    );
  }

  /**
   * Eliminar un producto de una lista de deseos.
   * @param params
   * @returns
   */
  deleteProductFromWishlist(params: {
    documentId: string;
    wishlistId: string;
    sku: string;
  }): Observable<void> {
    const { documentId, wishlistId, sku } = params;
    return this.http.delete<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}/sku/${sku}`
    );
  }

  /**
   * Eliminar un producto de todas las listas de deseos.
   * @param documentId
   * @param sku
   * @returns
   */
  deleteProductFromAllWishlists(documentId: string, sku: string) {
    return this.http.delete<void>(
      `${API_CUSTOMER}/${documentId}/article-list/sku/${sku}`
    );
  }

  setDefaultWishlist(
    documentId: string,
    wishlistId: string
  ): Observable<void> {
    return this.http.put<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}/default`,
      {}
    );
  }

  createWishlist(params: {
    documentId: string;
    name: string;
    skus?: string[];
  }): Observable<void> {
    const { documentId, name, skus } = params;
    return this.http.post<void>(`${API_CUSTOMER}/${documentId}/article-list`, {
      name,
      skus: skus || [],
    });
  }

  addProductsToWishlist(params: {
    documentId: string;
    wishlistId: string;
    skus: string[];
  }): Observable<void> {
    const { documentId, wishlistId, skus } = params;
    return this.http.post<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}/skus`,
      { skus }
    );
  }

  addProductsFromFileToWishlist(params: {
    documentId: string;
    wishlistId: string;
    file: File;
  }): Observable<IProductsFromFileResponse> {
    const { documentId, wishlistId, file } = params;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<IProductsFromFileResponse>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}/upload`,
      formData
    );
  }
}
