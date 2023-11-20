// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Subject, Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';

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
}
