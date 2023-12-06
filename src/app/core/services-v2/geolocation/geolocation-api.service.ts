// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Models
import { IStore } from './store.interface';

const API_LOGISTIC = `${environment.apiEcommerce}/api/v1/logistic`;

@Injectable({
  providedIn: 'root',
})
export class GeolocationApiService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la tienda más cercana.
   * @param lat
   * @param lng
   * @returns
   */
  getNearestStore(lat: number, lng: number): Observable<IStore> {
    return this.http.get<IStore>(`${API_LOGISTIC}/nearest-store`, {
      params: {
        lat,
        lng,
      },
    });
  }

  /**
   * Obtener tiendas.
   */
  getStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(`${API_LOGISTIC}/stores`);
  }
}
