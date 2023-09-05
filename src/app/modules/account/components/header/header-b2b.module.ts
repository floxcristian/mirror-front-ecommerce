import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderB2bComponent } from './header-b2b.component';
import { SearchComponent } from './components/search/search.component';
import { SharedModule } from '../../../../shared/shared.module';
import { BtnFavoritesComponent } from './components/btn-favorites/btn-favorites.component';
import { BtnMyAccountComponent } from './components/btn-my-account/btn-my-account.component';
import { BtnOrderApprovalComponent } from './components/btn-order-approval/btn-order-approval.component';
import { HeaderModule } from '../../../header/header.module';


@NgModule({
  declarations: [
    HeaderB2bComponent,
    SearchComponent,
    BtnFavoritesComponent,
    BtnMyAccountComponent,
    BtnOrderApprovalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule
  ],
  exports: [
    HeaderB2bComponent,

  ]
})
export class HeaderB2bModule { }
