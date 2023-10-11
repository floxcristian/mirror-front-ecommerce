// Angular
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  uploadImage(
    id: string,
    filename: string,
    name: string,
    image: File
  ): Observable<any> {
    var formData: any = new FormData();

    formData.append('name', name);
    formData.append('filename', filename);
    formData.append('avatar', image);
    formData.append('id', id);

    return this.http.post(
      environment.apiCMS + `images/upload-image/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
