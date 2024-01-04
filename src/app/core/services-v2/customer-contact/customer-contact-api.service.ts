// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Rxjs
import { Observable } from 'rxjs';
// Models
import { IContactPosition } from './models/contact-positions.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerContactApiService {
  constructor(private http: HttpClient) {}

  getContactPositions(): Observable<IContactPosition[]> {
    return this.http.get<IContactPosition[]>(
      `${API_CUSTOMER}/contact-positions`
    );
  }
}
