// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_PROMISE_lOGISTIC = `${environment.apiEcommerce}/api/v1/logistic-promise`;

@Injectable({
  providedIn: 'root',
})
export class PromiseLogisticService {
  constructor(private http: HttpClient) {}

  delivery() {}

  pickup() {}

  deliveryIdCart() {}

  pickupIdCart() {}

  nearestDateSupply() {}
}
