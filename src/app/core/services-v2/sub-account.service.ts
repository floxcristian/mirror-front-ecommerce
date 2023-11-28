// Environment
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;
@Injectable({
  providedIn: 'root',
})
export class SubAccountService {
  constructor(private http: HttpClient) {}

  createSubAccountsFromExcel(params: { documentId: string; file: File }) {
    const { documentId, file } = params;
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${API_CUSTOMER}/${documentId}/subaccount/upload`,
      formData
    );
  }
}
