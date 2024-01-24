// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Libs
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// Modules
import { SharedModule } from '../../shared/shared.module';
// Components
import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';

@NgModule({
  declarations: [WidgetFiltersComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
  ],
  exports: [WidgetFiltersComponent],
})
export class WidgetsModule {}
