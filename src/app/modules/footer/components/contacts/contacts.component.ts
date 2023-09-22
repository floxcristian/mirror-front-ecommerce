import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { StoreService } from '../../../../shared/services/store.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  innerWidth: number;
  constructor(
    public store: StoreService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
