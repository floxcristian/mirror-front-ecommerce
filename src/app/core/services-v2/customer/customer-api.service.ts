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
import { ICustomerCreateParams } from './models/customer-create-params.interface';

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

  createUser(params: ICustomerCreateParams) {
    const documentType = environment.country.toUpperCase();
    const userType = 0;
    const {
      firstName,
      lastName,
      city,
      street,
      streetNumber,
      documentId,
      businessLine,
      businessName,
      departmentOrHouse,
      contactDocumentId,
      locality,
      reference,
      latitude,
      longitude,
      phone,
      email,
      position,
      isCompanyUser,
      ..._params
    } = params;
    const [formattedCity, province, region] = city.split('@');
    const customerType = isCompanyUser ? 2 : 1;

    const formattedEmail = email.toLowerCase();
    console.log('params: ', params);
    console.log('_params: ', _params);
    return this.http.post<void>(`${API_CUSTOMER}/new`, {
      ..._params,
      documentId,
      documentType,
      userType,
      customerType,
      businessLine: businessLine || '',
      businessLineName: businessName || '',
      email: formattedEmail,
      firstName,
      lastName,
      contact: {
        documentId: isCompanyUser ? contactDocumentId : documentId,
        name: firstName,
        lastName,
        phone,
        position: isCompanyUser ? position : 'FACTURACION',
        email: formattedEmail,
      },
      address: {
        city: formattedCity,
        street,
        number: streetNumber,
        departmentOrHouse,
        reference,
        latitude,
        longitude,
        location: locality,
        region,
        province,
      },
    });
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
      firstName,
      lastName,
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
      firstName,
      lastName,
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
