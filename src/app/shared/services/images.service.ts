import { Injectable } from '@angular/core'
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  headers = new HttpHeaders().set('Content-Type', 'application/json')

  constructor(private http: HttpClient) {}

  obtieneImages() {
    return this.http.get(environment.apiCMS + 'images/')
  }

  crearImage(data: any) {
    var call = environment.apiCMS + `images`

    return this.http.post(call, data)
  }

  uploadImage(
    id: string,
    filename: string,
    name: string,
    image: File,
  ): Observable<any> {
    var formData: any = new FormData()

    formData.append('name', name)
    formData.append('filename', filename)
    formData.append('avatar', image)
    formData.append('id', id)

    return this.http.post(
      environment.apiCMS + `images/upload-image/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    )
  }

  uploadBannerImage(
    id: string,
    filename: string,
    name: string,
    image: File,
  ): Observable<any> {
    var formData: FormData = new FormData()

    formData.append('name', name)
    formData.append('filename', filename)
    formData.append('avatar', image)
    formData.append('id', id)

    return this.http.post(
      environment.apiCMS + `images/upload-banner-image/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    )
  }

  uploadImageImage(
    id: string,
    filename: string,
    name: string,
    image: File,
  ): Observable<any> {
    var formData: any = new FormData()

    formData.append('name', name)
    formData.append('filename', filename)
    formData.append('avatar', image)
    formData.append('id', id)

    return this.http.post(
      environment.apiCMS + `images/upload-only-image/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message //client error
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}` //server side error
    }
    console.log(errorMessage)
    return throwError(errorMessage)
  }

  updateImage(data: any) {
    var call = environment.apiCMS + `images/` + data['_id']
    return this.http.patch(call, data)
  }

  deleteImage(data: any) {
    var call = environment.apiCMS + `images/` + data['_id']
    return this.http.delete(call, data)
  }

  subir_imagen(files: any) {
    let fd = new FormData()
    fd.append('file', files.file)
    fd.append('tipo', files.tipo)

    var call = `${environment.apib2b}/api/catalogo/subirImagenCms`
    console.log(`${environment.apib2b}/api/catalogo/subirImagenCms`)
    return this.http.post(call, fd)
  }
}
