// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginResponse,
  ITokenResponse,
} from '@core/models-v2/auth/login-response.interface';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
import { IUserInfo } from '@core/models-v2/auth/user-info.interface';

const API_AUTH = `${environment.apiEcommerce}/api/v1/auth`;
@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_AUTH}/login`, {
      username,
      password,
    });
  }

  me(): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${API_AUTH}/me`);
  }

  refreshToken(refreshToken: string): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`${API_AUTH}/refresh`, {
      refreshToken,
    });
  }
}
