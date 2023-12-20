import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PageHomeService {
  constructor(private http: HttpClient) {}

  getHomePage(params: any) {
    return this.http.get(environment.apiElastic + 'homepageCms', { params });
  }

  getMundoCms() {
    return this.http.get(environment.apiCMS + 'mundo-slide/');
  }

  getCajaValor() {
    return this.http.get(environment.apiCMS + 'caja-valor/');
  }
}
