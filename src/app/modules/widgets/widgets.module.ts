// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Modules
import { SharedModule } from '../../shared/shared.module';
// import { Ng5SliderModule } from 'ng5-slider';

// Components
import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [WidgetFiltersComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    // Ng5SliderModule,
    TooltipModule.forRoot(),
  ],
  exports: [WidgetFiltersComponent],
})
export class WidgetsModule {}
