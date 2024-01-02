// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Rxjs
import { Observable } from 'rxjs';
// Models
import { ICustomerB2BParams } from './models/customer-b2b-request.interface';
import { ICheckIfExists } from './models/check-if-exists-response.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;
const API_AUTH = `${environment.apiEcommerce}/api/v1/auth`;

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  constructor(private http: HttpClient) {}

  /**
   * Formatea rut.
   * Esto debe hacerse a nivel de api.
   * @param value
   * @returns
   */
  private formatDocumentId(value: string): string {
    return (
      value.substring(0, value.length - 1) +
      '-' +
      value.substring(value.length, value.length - 1)
    );
  }

  /**
   * Registrar usuario B2B.
   * @param params
   * @returns
   */
  registerUserB2B(params: ICustomerB2BParams): Observable<void> {
    const password = 'qwert1234';
    const documentType = environment.country.toUpperCase();
    const {
      city,
      street,
      addressNumber,
      departmentOrHouse,
      documentId,
      ..._params
    } = params;
    const formatDocumentId = this.formatDocumentId(documentId);
    return this.http.post<void>(`${API_CUSTOMER}/new-b2b`, {
      ..._params,
      password,
      documentType,
      documentId: formatDocumentId,
      address: {
        city,
        street,
        departmentOrHouse,
        number: addressNumber,
      },
    });
  }

  /**
   * Verifica si un usuario ya existe en base el identificador de documento.
   */
  checkIfUserExists(documentId: string): Observable<ICheckIfExists> {
    return this.http.get<ICheckIfExists>(
      `${API_AUTH}/check-document-id/${documentId}`
    );
  }
}
