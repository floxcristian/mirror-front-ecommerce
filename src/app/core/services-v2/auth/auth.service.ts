// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Models
import { IUserDetail } from '@core/services-v2/auth/models/user-info.interface';
import {
  ILoginResponse,
  ITokenResponse,
} from '@core/services-v2/auth/models/login-response.interface';
import { ICheckIfExists } from './models/check-if-exists-response.interface';
import { IExistsEmail } from './models/exists-email.interface';

const API_AUTH = `${environment.apiEcommerce}/api/v1/auth`;
@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  /**
   * Iniciar sesión.
   * @param username
   * @param password
   * @returns
   */
  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_AUTH}/login`, {
      username,
      password,
    });
  }

  /**
   * Obtener información detallada del usuario.
   * @returns
   */
  me(): Observable<IUserDetail> {
    return this.http.get<IUserDetail>(`${API_AUTH}/me`);
  }

  /**
   * Actualizar tokens de sesión.
   * @param refreshToken
   * @returns
   */
  refreshToken(refreshToken: string): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`${API_AUTH}/refresh`, {
      refreshToken,
    });
  }

  /**
   * Verificar si un usuario ya existe en base al identificador de documento.
   */
  checkDocumentId(documentId: string): Observable<ICheckIfExists> {
    return this.http.get<ICheckIfExists>(
      `${API_AUTH}/check-document-id/${documentId}`
    );
  }

  /**
   * Verificar si un usuario ya existe en base al email.
   */
  checkEmail(email: string): Observable<IExistsEmail> {
    return this.http.get<IExistsEmail>(`${API_AUTH}/check-email/${email}`);
  }

  /**
   * Verificar si un usuario ya existe en base al username.
   */
  checkUsername(username: string) {
    return this.http.get(`${API_AUTH}/check-username/${username}`);
  }

  /**
   * Enviar email con el link para recuperar la contraseña.
   * @param email
   * @returns
   */
  sendRecoverPasswordLink(email: string): Observable<void> {
    return this.http.get<void>(`${API_AUTH}/recover-password/${email}`);
  }

  /**
   * Setear nueva contraseña utilizando link de restauración.
   * @param params
   * @returns
   */
  recoverPassword(params: {
    email: string;
    id: string;
    password: string;
  }): Observable<void> {
    return this.http.post<void>(`${API_AUTH}/recover-password`, params);
  }

  /**
   * Actualizar contraseña.
   * @param params
   * @returns
   */
  updatePassword(params: {
    documentId: string;
    username: string;
    currentPassword: string;
    newPassword: string;
  }) {
    const { documentId, username, currentPassword, newPassword } = params;
    return this.http.put(`${API_AUTH}/${documentId}/password`, {
      username,
      newPassword,
      actualPassword: currentPassword,
    });
  }
}
