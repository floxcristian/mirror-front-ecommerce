import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  constructor(private http: HttpClient) {}

  obtieneTiendas() {
    return this.http.get(environment.apiCMS + 'stores/')
  }

  crearTienda(data: any) {
    var call = environment.apiCMS + `stores`
    return this.http.post(call, data)
  }

  updateTienda(data: any) {
    var call = environment.apiCMS + `stores/` + data['_id']
    return this.http.patch(call, data)
  }

  deleteTienda(data: any) {
    var call = environment.apiCMS + `stores/` + data['_id']
    return this.http.delete(call, data)
  }
}
