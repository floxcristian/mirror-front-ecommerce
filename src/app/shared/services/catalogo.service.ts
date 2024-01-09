// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Interfaces
import { ResponseApi } from '../interfaces/response-api';
import { ComentarioArticulo } from '../interfaces/comentariosArticulo';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  headers = new HttpHeaders({
    Authorization: `Basic c2VydmljZXM6MC49ajNEMnNzMS53Mjkt`,
  });
  constructor(private http: HttpClient) {}

  async obtenerCatalogoId(id: any) {
    let url = `${environment.apiCatalogo}obtenerCatalogo?id=${id}`;
    let consulta: any = await this.http.get(url).toPromise();

    if (!consulta.error) {
      return consulta.data;
    }
  }
  async obtenerPropuesta(id: any) {
    let url = `${environment.apiCatalogo}propuesta`;
    let consulta: any = await this.http.post(url, { folio: id }).toPromise();

    if (!consulta.error) {
      return consulta.data;
    }
  }

  async establecerPrecios(params: {
    sucursal: string;
    rut: string;
    skus: any[];
  }) {
    const call = `${environment.apiCatalogo}establecerPrecioCatalogo-v2`;
    let consulta: any = await this.http.post(call, params).toPromise();
    return consulta;
  }

}
