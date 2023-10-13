// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient) {}

  async obtenerCatalogos(estado: string) {
    let url = `${environment.apiCatalogo}obtenerCatalogos?tipo=Web&datos=true&estado=${estado}`;
    let consulta: any = await this.http.get(url).toPromise();

    if (!consulta.error) {
      return consulta.data;
    }
  }

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

  getFiltroAnios() {
    return this.http.get<ResponseApi>(
      `${environment.apiCatalogo}filtros/anios`
    );
  }

  getFiltroMarcas(anio: string) {
    const call = environment.apiCatalogo + `filtros/marcas?anio=${anio}`;
    return this.http.get<ResponseApi>(call);
  }

  getFiltroModelos(anio: string, marca: string): Observable<ResponseApi> {
    const call =
      environment.apiCatalogo + `filtros/modelos?anio=${anio}&marca=${marca}`;
    return this.http.get<ResponseApi>(call);
  }

  guardarComentarioArticulo(
    request: ComentarioArticulo
  ): Observable<ResponseApi> {
    const call = environment.apiCatalogo + `comentarioArticulo`;
    return this.http.post<ResponseApi>(call, request);
  }

  getResumenComentarios(sku: string): Observable<ResponseApi> {
    const call = environment.apiCatalogo + `obtenerComentarios/${sku}/resumen`;
    return this.http.get<ResponseApi>(call);
  }

  getDetalleComentarios(sku: string, orden: string): Observable<ResponseApi> {
    const call =
      environment.apiCatalogo +
      `obtenerComentarios/${sku}/detalle?orden=${orden}`;
    return this.http.get<ResponseApi>(call);
  }
  async obtenerNewsletter(id: any) {
    const call = `${environment.apiCatalogo}obtenerNewsletter`;
    let consulta: any = await this.http.post(call, { id: id }).toPromise();
    return consulta;
  }
}
