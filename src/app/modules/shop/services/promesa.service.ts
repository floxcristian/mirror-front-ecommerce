import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromesaService {
  API_URL = environment.apiPromesa;
  API_URL_LOGISTICA = environment.apiImplementosLogistica;
  authBasic = 'Basic c2VydmljZXM6MC49ajNEMnNzMS53Mjkt';

  constructor(private http: HttpClient) {}

  localidades(): Observable<any> {
    const headers = this.headers();
    return this.http.get<any>(`${this.API_URL}localidades`, { headers });
  }

  headers() {
    return this.API_URL.startsWith('http://192')
      ? {}
      : new HttpHeaders().append('Authorization', this.authBasic);
  }

  tiendas(): Observable<any> {
    const headers = this.headers();
    return this.http.get<any>(`${this.API_URL_LOGISTICA}tiendas`, { headers });
  }

  getpromesa(modo: string, localidad: any, productos: any) {
    return this.http.post<any>(`${this.API_URL}${modo}/${localidad}`, {
      productos,
    });
  }

  //funcion para seleccionar la tienda//
}
