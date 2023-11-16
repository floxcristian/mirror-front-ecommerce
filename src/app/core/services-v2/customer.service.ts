// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '@core/models-v2/auth/login-response.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/auth`;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  /**********************************************
   * AUTH
   **********************************************/
  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_CUSTOMER}/login`, {
      username,
      password,
    });
  }

  refreshTokens(refreshToken: string) {
    return this.http.post(`${API_CUSTOMER}/refresh`, {
      refreshToken,
    });
  }

  // FIXME: add bearer token.
  getUser() {
    return this.http.get(`${API_CUSTOMER}/me`);
  }

  checkDocumentId(documentId: string) {
    return this.http.get(`${API_CUSTOMER}/check-document-id/${documentId}`);
  }

  checkEmail(email: string) {
    return this.http.get(`${API_CUSTOMER}/check-email/${email}`);
  }

  checkUsername(username: string) {
    return this.http.get(`${API_CUSTOMER}/check-username/${username}`);
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
      `${API_CUSTOMER}/${documentId}/password`,
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

  /**
   * Get link to recover password.
   * @param email
   * @returns
   */
  getRecoverPasswordLink(email: string) {
    return this.http.get(`${API_CUSTOMER}/recover-password/${email}`);
  }

  recoverPassword(params: { email: string; id: string; password: string }) {
    return this.http.post(`${API_CUSTOMER}/recover-password`, params);
  }

  /**********************************************
   * CUSTOMER
   **********************************************/
}
