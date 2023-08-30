/**
 * Actualmente este servicio no se ocupa.
 */

// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environment
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  constructor(private readonly http: HttpClient) {}

  SetPixel(param: any) {
    return this.http.post(
      `${environment.apiConversion}${environment.TOKEN}`,
      param
    );
  }
}
