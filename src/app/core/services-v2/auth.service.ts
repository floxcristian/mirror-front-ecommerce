// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '@core/models-v2/auth/login-response.interface';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';

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
}
