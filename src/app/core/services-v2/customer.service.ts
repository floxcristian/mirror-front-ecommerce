// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '@core/models-v2/auth/login-response.interface';
import { ICreateGuest } from '@core/models-v2/customer/create-guest.interface';
import { ICustomerBlocked } from '@core/models-v2/customer/customer-blocked.interface';
import { IUsersDetail } from '@core/models-v2/customer/users-detail.interface';
import { ICustomerCredit } from '@core/models-v2/customer/customer.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_AUTH = `${environment.apiEcommerce}/api/v1/auth`;
const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  /**********************************************
   * AUTH
   **********************************************/
  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_AUTH}/login`, {
      username,
      password,
    });
  }

  refreshTokens(refreshToken: string) {
    return this.http.post(`${API_AUTH}/refresh`, {
      refreshToken,
    });
  }

  // FIXME: add bearer token.
  getUser() {
    return this.http.get(`${API_AUTH}/me`);
  }

  checkDocumentId(documentId: string) {
    return this.http.get(`${API_AUTH}/check-document-id/${documentId}`);
  }

  checkEmail(email: string) {
    return this.http.get(`${API_AUTH}/check-email/${email}`);
  }

  checkUsername(username: string) {
    return this.http.get(`${API_AUTH}/check-username/${username}`);
  }

  // FIXME: add bearer token.
  updatePassword(params: {
    documentId: string;
    username: string;
    currentPassword: string;
    newPassword: string;
  }) {
    const { documentId, username, currentPassword, newPassword } = params;
    return this.http.put(
      `${API_AUTH}/${documentId}/password`,
      {
        username,
        newPassword,
        actualPassword: currentPassword,
      },
      {
        headers: {},
      }
    );
  }

  updateProfile(params: {
    documentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    const { documentId, firstName, lastName, email, phone } = params;
    return this.http.put(`${API_CUSTOMER}/${documentId}/profile`, {
      firstName,
      lastName,
      email,
      phone,
    });
  }

  /**
   * Get link to recover password.
   * @param email
   * @returns
   */
  getRecoverPasswordLink(email: string) {
    return this.http.get(`${API_AUTH}/recover-password/${email}`);
  }

  recoverPassword(params: { email: string; id: string; password: string }) {
    return this.http.post(`${API_AUTH}/recover-password`, params);
  }

  /**********************************************
   * CUSTOMER
   **********************************************/

  getCustomerBlocked(documentId: string): Observable<ICustomerBlocked> {
    return this.http.get<ICustomerBlocked>(
      `${API_CUSTOMER}/${documentId}/blocked`
    );
  }

  getCustomerCredit(documentId: string): Observable<ICustomerCredit> {
    return this.http.get<ICustomerCredit>(
      `${API_CUSTOMER}/${documentId}/credit`
    );
  }

  getSupervisors(documentId: string): Observable<IUsersDetail> {
    return this.http.get<IUsersDetail>(
      `${API_CUSTOMER}/${documentId}/supervisor`
    );
  }

  createGuest(params: ICreateGuest): Observable<ICustomerCredit> {
    const url = `${API_CUSTOMER}/new-guest`;
    return this.http.post<ICustomerCredit>(url, params);
  }
}
