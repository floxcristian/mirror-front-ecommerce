import { Component } from '@angular/core';
import { StoreService } from '../../../../shared/services/store.service';

@Component({
    selector: 'app-footer-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent {
innerWidth: number;
    constructor(public store: StoreService) {
        this.innerWidth=window.innerWidth;
    }

    onResize(event:any) {
    this.innerWidth = event.target.innerWidth;
    }
}
