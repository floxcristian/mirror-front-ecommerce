// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_LOGISTIC_PROMISE = `${environment.apiEcommerce}/api/v1/logistic-promise/`;
const API_LOGISTIC = `${environment.apiEcommerce}/api/v1/logistic/`;
@Injectable({
  providedIn: 'root',
})
export class LogisticPromiseService {
  private http = inject(HttpClient);

  getStores(): Observable<any> {
    return this.http.get<any>(`${API_LOGISTIC_PROMISE}stores`);
  }

  getLogisticPromise(
    mode: string,
    location: any,
    products: any
  ): Observable<any> {
    console.log(
      '🚀 ~ file: promesa.service.ts:33 ~ PromesaService ~ getpromesa ~ localidad:',
      location
    );
    const article = products[0];
    return this.http.post<any>(`${API_LOGISTIC_PROMISE}${mode}`, {
      location,
      article,
    });
  }
}
