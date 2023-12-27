// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_NOTIFICATION = `${environment.apiEcommerce}/api/v1/notification`;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  /***********************************
   *  NOTIFICATION
   *
   **********************************/

  sendEmail(params: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    template: string;
    meta: {
      email: string;
      name: string;
      redirectUrl: string;
    };
    attachments: [
      {
        filename: string;
        url: string;
        base64: string;
        contentType: string;
      }
    ];
  }) {
    return this.http.post(`${API_NOTIFICATION}/send-email`, params);
  }

  sendWhatsapp(params: {
    templateKey: string;
    message: string;
    phones: string[];
    paramsBody: string[];
    paramsFooter: string[];
  }) {
    return this.http.post(`${API_NOTIFICATION}/send-whatsapp`, params);
  }

  sendSms(params: { message: string; phones: string[] }) {
    return this.http.post(`${API_NOTIFICATION}/send-sms`, params);
  }

  /***********************************
   *  OTP
   *
   **********************************/

  generateOtp(params: {
    reference: string;
    digits: number;
    meta: {
      hola: string;
    };
    expiresAt: string;
  }) {
    return this.http.post(`${API_NOTIFICATION}/generate-otp`, { params });
  }

  validateOtp(params: { reference: string; otp: string }) {
    return this.http.get(`${API_NOTIFICATION}/validate-otp`, { params });
  }

  /***********************************
   *  ECOMMERCE
   *
   **********************************/

  sendContactFormEmail(params:{
    documentId:string;
    phone:string;
    name:string;
    email:string;
    subject:string;
    text:string;
  }){
    return this.http.post(`${API_NOTIFICATION}/contact-form`,params)
  }

}
