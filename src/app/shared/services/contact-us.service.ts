import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  header = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'response-Type': 'json',
  });

  constructor(private httpClient: HttpClient) {}

  async enviarCorreoContacto(parametros: any) {
    let consulta = null;
    let url = `${environment.apiImplementosCarro}enviarmail`;
    consulta = await this.httpClient
      .post(url, parametros, { headers: this.header, responseType: 'text' })
      .toPromise();

    return consulta;
  }
}
