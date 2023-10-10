// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Subject, Observable } from 'rxjs';
// Environment
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SlidesService {
  private finishServiceSlideSubjet: Subject<any> = new Subject();
  readonly $finishServiceSlide: Observable<any> =
    this.finishServiceSlideSubjet.asObservable();

  constructor(private http: HttpClient) {}

  obtieneSlides() {
    return this.http.get(environment.apiCMS + 'slides/');
  }

  crearSlide(data: any) {
    var call = environment.apiCMS + `slides`;
    return this.http.post(call, data);
  }

  updateSlide(data: any) {
    var call = environment.apiCMS + `slides/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteSlide(data: any) {
    var call = environment.apiCMS + `slides/` + data['_id'];
    return this.http.delete(call, data);
  }
}
