import { Injectable } from '@angular/core';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerAddressService {
  private customerAddressSubject: Subject<ICustomerAddress | null> =
    new Subject();
  readonly customerAddress$: Observable<ICustomerAddress | null> =
    this.customerAddressSubject.asObservable();

  setCustomerAddress(address: ICustomerAddress | null): void {
    this.customerAddressSubject.next(address);
  }
}
