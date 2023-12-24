// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, map } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Models
import {
  IWishlist,
  IWishlistResponse,
} from './models/wishlist-response.interface';
import { IProductsFromFileResponse } from './models/product-from-file-response.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class WishlistApiService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener listas de deseos de un cliente.
   * @param documentId
   * @returns
   */
  getWishlists(documentId: string): Observable<IWishlist[]> {
    return this.http
      .get<IWishlistResponse>(`${API_CUSTOMER}/${documentId}/article-list`)
      .pipe(map((res) => res.articleList || []));
  }

  /**
   * Crear lista de deseos.
   * @param params
   * @returns
   */
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

  /**
   * Actualizar el nombre de una lista de deseos.
   * @param params
   * @returns
   */
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

  /**
   * Eliminar una lista de deseos.
   * @param documentId
   * @param wishlistId
   * @returns
   */
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

  /**
   * Establecer lista de deseos por defecto.
   * @param documentId
   * @param wishlistId
   * @returns
   */
  setDefaultWishlist(
    documentId: string,
    wishlistId: string
  ): Observable<void> {
    return this.http.put<void>(
      `${API_CUSTOMER}/${documentId}/article-list/${wishlistId}/default`,
      {}
    );
  }

  /**
   * Agregar productos a la lista de deseos.
   * @param params
   * @returns
   */
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

  /**
   * Agregar productos a la lista de deseos desde un archivo excel.
   * @param params
   * @returns
   */
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
