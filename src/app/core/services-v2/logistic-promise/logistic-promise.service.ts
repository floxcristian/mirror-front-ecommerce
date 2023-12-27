// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Rxjs
import { Observable, map } from 'rxjs';
// Env
import { environment } from '@env/environment';
import {
  ILogisticProduct,
  ILogisticPromiseRequest,
} from './models/logistic-promise-request.interface';
import { ILocality } from './models/locality.interface';
import {
  IDeliveryAvailabilityResponse,
  ITripDate,
} from './models/delivery-availability-response.interface';

const API_LOGISTIC_PROMISE = `${environment.apiEcommerce}/api/v1/logistic-promise`;
// const API_LOGISTIC = `${environment.apiEcommerce}/api/v1/logistic/`;
@Injectable({
  providedIn: 'root',
})
export class LogisticPromiseApiService {
  private http = inject(HttpClient);

  /**
   * Obtener tiendas.
   * @returns
   */
  getStores(): Observable<any> {
    return this.http
      .get<any>(`${API_LOGISTIC_PROMISE}/stores`)
      .pipe(map((res) => res.data));
  }

  /**
   * Obtener localidades.
   */
  getLocalities(): Observable<ILocality[]> {
    return this.http.get<any>(`${API_LOGISTIC_PROMISE}/localities`);
  }

  /**
   * Obtener disponibilidad.
   * @param mode
   * @param location
   * @param products
   * @returns
   */
  getLogisticPromise(
    mode: string,
    location: any,
    products: ILogisticProduct[]
  ): Observable<any> {
    console.log(
      '🚀 ~ file: promesa.service.ts:33 ~ PromesaService ~ getpromesa ~ localidad:',
      location
    );
    const article = products[0];
    return this.http.post<any>(`${API_LOGISTIC_PROMISE}/${mode}`, {
      location,
      article,
    });
  }

  /**
   * Obtener disponibilidad de despacho a domicilio.
   * @returns
   */
  getDeliveryAvailability(
    params: ILogisticPromiseRequest
  ): Observable<ITripDate[]> {
    return this.http
      .post<IDeliveryAvailabilityResponse>(
        `${API_LOGISTIC_PROMISE}/delivery`,
        {
          ...params,
          omni: false,
          securityStock: true,
          useRealStock: false,
        }
      )
      .pipe(map((res) => res.subOrders[0].tripDates));
  }
}
