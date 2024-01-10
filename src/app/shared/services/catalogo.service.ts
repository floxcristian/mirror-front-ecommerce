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



}
