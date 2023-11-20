// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environment
import { environment } from '@env/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) {}

  obtenerPosts() {
    return this.http
      .get(`${environment.apiCMS}posts`)
      .pipe(map((res: any) => res.data));
  }

  obtenerPost(data: any) {
    var call = environment.apiCMS + `posts/page/${data['page_id']}`;
    return this.http.get(call);
  }
}
