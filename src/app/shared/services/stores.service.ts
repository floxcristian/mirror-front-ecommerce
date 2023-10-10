// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environments
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  constructor(private http: HttpClient) {}

  obtieneTiendas() {
    return this.http.get(`${environment.apiCMS}stores/`);
  }
}
