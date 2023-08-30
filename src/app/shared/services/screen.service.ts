import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  constructor(private http: HttpClient) {}

  async obtenerPropaganda(idObj: string, estado: boolean) {
    let query = '';
    if (idObj) {
      query = `id=${idObj}`;
    }

    if (estado) {
      if (query !== '') {
        query += '&';
      }
      query += `estado=${estado}`;
    }

    let url = `${environment.urlScreen}obtenerPropaganda?${query}`;
    let consulta: any = await this.http.get(url).toPromise();

    if (!consulta.error) {
      return consulta.data;
    }
  }

  async obtenerCronograma(
    idObjEdit: string | null = null,
    estado: boolean = true
  ) {
    let query = '';
    if (idObjEdit) {
      query = `id=${idObjEdit}`;
    }

    if (estado) {
      if (query !== '') {
        query += '&';
      }
      query += `estado=${estado}`;
    }

    const url = `${environment.urlScreen}obtenerCronograma?${query}`;
    const consulta: any = await this.http.get(url).toPromise();
    if (!consulta.error) {
      return consulta.data;
    }
  }

  async obtenerClima(tienda: string) {
    let url = `${environment.urlScreen}obtenerClima?t=${tienda}`;
    let consulta: any = await this.http.get(url).toPromise();

    if (!consulta.error) {
      return consulta;
    }
  }

  async indicadoresFinancieros() {
    let url = `${environment.urlScreen}indicadoresFinancieros`;
    let consulta: any = await this.http.get(url).toPromise();

    if (!consulta.error) {
      return consulta;
    }
  }
}
