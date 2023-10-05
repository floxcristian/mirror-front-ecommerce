import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class BannersService {
  constructor(private http: HttpClient) {}

  getBanners(locations: string[]) {
    let params = new HttpParams().set(
      'locations',
      encodeURIComponent(JSON.stringify(locations)),
    )
    return this.http.get(environment.apiCMS + 'banners/', { params: params })
  }

  /* CRUD */

  obtenerPosts() {
    var call = environment.apiCMS + `banners/`
    return this.http.get(call)
  }

  crearPost(data: any) {
    var call = environment.apiCMS + `banners`
    return this.http.post(call, data)
  }

  updatePost(data: any) {
    var call = environment.apiCMS + `banners/` + data['_id']
    return this.http.patch(call, data)
  }

  deletePost(data: any) {
    var call = environment.apiCMS + `banners/` + data['_id']
    return this.http.delete(call, data)
  }
}
