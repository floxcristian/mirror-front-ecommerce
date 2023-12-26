// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Env
import { environment } from '@env/environment';
import { IBusinessLine } from './business-line.interface';
import { Observable } from 'rxjs';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerBusinessLineApiService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los giros.
   */
  getBusinessLines(): Observable<IBusinessLine[]> {
    return this.http.get<IBusinessLine[]>(`${API_CUSTOMER}/business-lines`);
  }
}
