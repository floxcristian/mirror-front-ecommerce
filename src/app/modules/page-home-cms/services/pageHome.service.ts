import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PageHomeService {
  constructor(private http: HttpClient) {}

  getPagehomeCms() {
    return this.http.get(environment.apiElastic + 'newhomepageCms');
  }

  getHomePage(params: any) {
    return this.http.get(environment.apiElastic + 'homepageCms', { params });
  }

  /**
   * Según Jose se usa cuando se administra el dashboard.
   * @param params
   * @returns
   */
  buscarProductosElactic(params: any) {
    return this.http.get(environment.apiElastic + `especialCms`, { params });
  }

  getMundoCms() {
    return this.http.get(environment.apiCMS + 'mundo-slide/');
  }

  getCajaValor() {
    return this.http.get(environment.apiCMS + 'caja-valor/');
  }
}
