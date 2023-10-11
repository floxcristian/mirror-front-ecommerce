import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loadData$: Subject<any> = new Subject();
  readonly loadDataRead$: Observable<number> = this.loadData$.asObservable();
  private template$: Subject<any> = new Subject();
  readonly templateRead$: Observable<number> = this.template$.asObservable();
  constructor(private httpClient: HttpClient) {}

  insertar(user: any) {
    let url = environment.apiCustomer + 'crearusuario';
    return this.httpClient.post(url, user);
  }

  Update(id: any, data: any) {
    let json = {
      id: id,
      data: data,
    };
    let url = environment.apiCustomer + 'updateusuario';
    return this.httpClient.post(url, json);
  }

  uploadExcel(data: any) {
    const formData: FormData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    return this.httpClient.post(
      environment.apiCustomer + 'cargarlistadousuario',
      formData
    );
  }

  Eliminar(id: any) {
    let url = environment.apiCustomer + 'eliminarusuario';
    return this.httpClient.get(url, { params: { id: id } });
  }

  activarModal(item: any) {
    this.template$.next(item);
  }

  LoadData() {
    this.loadData$.next(null);
  }
}
