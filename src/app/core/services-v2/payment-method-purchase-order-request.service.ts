// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';
import { IPaymentPurchaseOrder } from '@core/models-v2/payment-method/payment-purchase-order.interface';
// Environment
import { environment } from '@env/environment';

const API_PAYMENT = `${environment.apiEcommerce}/api/v1/payment`;

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodPurchaseOrderRequestService {
  constructor(private http: HttpClient) {}

  upload(params: {
    shoppingCartId: string;
    number: string;
    amount: number;
    costCenter: string;
    file: File;
  }) {
    const { shoppingCartId, number, amount, costCenter, file } = params;
    const formData: FormData = new FormData();
    formData.append('shoppingCartId', shoppingCartId);
    formData.append('number', number);
    formData.append('amount', amount.toString());
    formData.append('costCenter', costCenter);
    formData.append('file', file);
    const url = `${API_PAYMENT}/purchase-order/upload`;
    return this.http.post<IPaymentPurchaseOrder>(url, formData);
  }

  requestApproval(params: {
    shoppingCartId: string;
    salesDocumentType: number;
  }) {
    const url = `${API_PAYMENT}/purchase-order/resend-otp`;
    return this.http.post<IShoppingCart>(url, {
      shoppingCartId: params.shoppingCartId,
      salesDocumentType: params.salesDocumentType,
    });
  }

  resendOTP(params: { purchaseOrderId: string }) {
    const url = `${API_PAYMENT}/purchase-order/resend-otp`;
    return this.http.post<IPaymentPurchaseOrder>(url, {
      purchaseOrderId: params.purchaseOrderId,
    });
  }

  confirmOTP(params: { purchaseOrderId: string; otp: string }) {
    const url = `${API_PAYMENT}/purchase-order/confirm-otp`;
    return this.http.post<IPaymentPurchaseOrder>(url, {
      purchaseOrderId: params.purchaseOrderId,
      otp: params.otp,
    });
  }

  approve(params: { shoppingCartId: string }) {
    const url = `${API_PAYMENT}/purchase-order/approve`;
    return this.http.post<IPaymentPurchaseOrder>(url, {
      shoppingCartId: params.shoppingCartId,
    });
  }

  reject(params: { shoppingCartId: string; observation: string }) {
    const url = `${API_PAYMENT}/purchase-order/reject`;
    return this.http.post<IPaymentPurchaseOrder>(url, {
      shoppingCartId: params.shoppingCartId,
      observation: params.observation,
    });
  }
}
