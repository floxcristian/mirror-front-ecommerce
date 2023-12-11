// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IContactPosition } from '@core/models-v2/customer/contact-position.interface';
import { ICustomerContact } from '@core/models-v2/customer/customer.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerContactService {
  constructor(private http: HttpClient) {}

  getPositions(): Observable<IContactPosition[]> {
    return this.http.get<IContactPosition[]>(
      `${API_CUSTOMER}/contact-positions`
    );
  }

  getContacts(documentId: string): Observable<ICustomerContact[]> {
    return this.http.get<ICustomerContact[]>(
      `${API_CUSTOMER}/${documentId}/contacts`
    );
  }

  createContact(params: {
    customerDocumentId: string;
    documentId: string;
    name: string;
    lastName: string;
    position: string;
    phone: string;
    email: string;
  }) {
    const {
      customerDocumentId,
      documentId,
      name,
      lastName,
      position,
      phone,
      email,
    } = params;
    return this.http.post(`${API_CUSTOMER}/${customerDocumentId}/contact`, {
      documentId,
      name,
      lastName,
      position,
      phone,
      email,
    });
  }

  updateContact(params: {
    customerDocumentId: string;
    documentId: string;
    contactId: string;
    name: string;
    lastName: string;
    position: string;
    phone: string;
    email: string;
  }) {
    const {
      customerDocumentId,
      documentId,
      contactId,
      name,
      lastName,
      position,
      phone,
      email,
    } = params;
    return this.http.put(
      `${API_CUSTOMER}/${customerDocumentId}/contact/${contactId}`,
      {
        documentId,
        name,
        lastName,
        position,
        phone,
        email,
      }
    );
  }

  deleteContact(customerDocumentId: string, contactId: string) {
    return this.http.delete(
      `${API_CUSTOMER}/${customerDocumentId}/contact/${contactId}`
    );
  }
}
