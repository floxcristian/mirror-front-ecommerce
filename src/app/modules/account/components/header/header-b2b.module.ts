// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Modules
import { HeaderModule } from '../../../header/header.module';
import { SharedModule } from '../../../../shared/shared.module';
// Components
import { HeaderB2bComponent } from './header-b2b.component';
import { SearchComponent } from './components/search/search.component';
import { BtnMyAccountComponent } from './components/btn-my-account/btn-my-account.component';
import { BtnOrderApprovalComponent } from './components/btn-order-approval/btn-order-approval.component';

@NgModule({
  declarations: [
    HeaderB2bComponent,
    SearchComponent,
    BtnMyAccountComponent,
    BtnOrderApprovalComponent,
  ],
  imports: [CommonModule, SharedModule, HeaderModule],
  exports: [HeaderB2bComponent],
})
export class HeaderB2bModule {}
