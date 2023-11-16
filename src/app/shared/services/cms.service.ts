// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environment
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) {}

  obtenerNuevosProductos() {
    var call = environment.apiCMS + 'products/new-products';
    return this.http.get(call);
  }

  obtenerCategorias() {
    var call = environment.apiCMS + 'categories';
    return this.http.get(call);
  }

  asignarCategorias(data: any) {
    var call = environment.apiCMS + 'products/assign-categories';
    return this.http.post(call, data);
  }

  /* Blog */

  obtenerPosts() {
    var call = environment.apiCMS + `posts/`;
    return this.http.get(call);
  }

  obtenerPost(data: any) {
    var call = environment.apiCMS + `posts/page/${data['page_id']}`;
    return this.http.get(call);
  }
}
