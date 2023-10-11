import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root',
})
export class ChilexpressService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Ocp-Apim-Subscription-Key': '47d8e38b72194329a047c185bef815f1',
  });
  constructor(private http: HttpClient) {}
  API_URL = 'https://testservices.wschilexpress.com/georeference/api/v1.0/';
  getRegiones() {
    return this.http.get(this.API_URL + 'regions');
  }

  getSucursales(params: any) {
    return this.http.get(this.API_URL + 'offices', { params: params });
  }

  getOmsPromesa(tipo: any, comuna: any, productos: any) {
    return this.http.post(
      environment.apiOms + 'promesa-entrega/' + tipo + '/' + comuna,
      productos
    );
  }
}
