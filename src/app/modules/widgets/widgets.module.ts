import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules (third-party)
// import { Ng5SliderModule } from 'ng5-slider';

// modules
import { SharedModule } from '../../shared/shared.module';

// widgets

// import { WidgetCategoriesComponent } from './widget-categories/widget-categories.component';
// import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';
// import { WidgetPostsComponent } from './widget-posts/widget-posts.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    // widgets

    // WidgetCategoriesComponent,
    // WidgetFiltersComponent,
    // WidgetPostsComponent
  ],
  imports: [
    // modules (angular)
    CommonModule,
    RouterModule,
    // modules (third-party)
    // Ng5SliderModule,
    // modules
    SharedModule,
    FormsModule
  ],
  exports: [
    // widgets

    // WidgetCategoriesComponent,
    // WidgetFiltersComponent,
    // WidgetPostsComponent
  ]
})
export class WidgetsModule {}
