import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    address = 'Av. Gral Velásquez N° 10701, San Bernardo, Santiago.';
    email = 'ventas@implementos.cl';
    phone = ['800 330 088'];
    hours = 'Lu-Vie: 9:00 a 18:30 hrs. Sab: 9:00 a 13:00 hrs.';

    get primaryPhone(): string|null {
        return this.phone.length > 0 ? this.phone[0] : null;
    }

    constructor() { }
}
