import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class PageHomeService {
  constructor(private http: HttpClient) {}
  //cargar pagina home
  get_pagehome_cms() {
    return this.http.get(environment.apiElastic + 'newhomepageCms')
  }
  //update pagina home
  getBlogEntries() {
    return this.http
      .get(`${environment.apiCMS}posts`)
      .pipe(map((res: any) => res.data))
  }

  buscarProductosElactic(params: any) {
    return this.http.get(environment.apiElastic + `especialCms`, { params })
  }

  get_pagehome_cms_sku(texto: any, sucursal: any, rut: any) {
    return this.http.get(
      environment.apiElastic +
        `?word=${texto}&rut=${rut}&sucursal=${sucursal}`,
    )
  }

  get_mundo_cms() {
    return this.http.get(environment.apiCMS + 'mundo-slide/')
  }

  getCajaValor() {
    return this.http.get(environment.apiCMS + 'caja-valor/')
  }
}
