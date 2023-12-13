// Environment
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEcommerceUser } from '@core/models-v2/auth/user.interface';
import { IPaginated } from '@core/models-v2/shared/paginated.interface';
import { Observable } from 'rxjs';
import { UploadSubAccountResult } from '@core/models-v2/customer/subaccount.interface';

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
    return this.http.post<UploadSubAccountResult>(
      `${API_CUSTOMER}/${documentId}/subaccount/upload`,
      formData
    );
  }

  getSubAccounts(params: {
    documentId: string;
    page?: number;
    limit?: number;
  }): Observable<IPaginated<IEcommerceUser>> {
    const documentId = params.documentId;
    const page = params.page ? params.page : 1;
    const limit = params.limit ? params.limit : 1000;
    return this.http.get<IPaginated<IEcommerceUser>>(
      `${API_CUSTOMER}/${documentId}/subaccounts?page=${page}&limit=${limit}`
    );
  }

  createSubAccount(params: {
    documentId: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userRole: string;
    active: boolean;
  }) {
    const {
      documentId,
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      userRole,
      active,
    } = params;
    return this.http.post<IEcommerceUser>(
      `${API_CUSTOMER}/${documentId}/subaccount`,
      {
        username,
        password,
        firstName,
        lastName,
        email,
        phone,
        userRole,
        active,
      }
    );
  }

  updateSubAccount(params: {
    documentId: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userRole: string;
    active: boolean;
  }) {
    const {
      documentId,
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      userRole,
      active,
    } = params;
    return this.http.put<IEcommerceUser>(
      `${API_CUSTOMER}/${documentId}/subaccount/${username}`,
      {
        password,
        firstName,
        lastName,
        email,
        phone,
        userRole,
        active,
      }
    );
  }

  deleteSubAccount(params: { documentId: string; username: string }) {
    const { documentId, username } = params;
    return this.http.delete(
      `${API_CUSTOMER}/${documentId}/subaccount/${username}`
    );
  }
}
