// Angular
import { Component } from '@angular/core';
// Models
import { Address } from '../../../../shared/interfaces/address';
// Constants
import { addresses } from '../../../../../data/account-addresses';

@Component({
  selector: 'app-page-addresses-list',
  templateUrl: './page-addresses-list.component.html',
  styleUrls: ['./page-addresses-list.component.sass'],
})
export class PageAddressesListComponent {
  addresses: Address[] = addresses;
}
