// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Modules
import { SharedModule } from '../../shared/shared.module';
// Components
import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';
// import { Ng5SliderModule } from 'ng5-slider';
// import { WidgetCategoriesComponent } from './widget-categories/widget-categories.component';
// import { WidgetPostsComponent } from './widget-posts/widget-posts.component';

@NgModule({
  declarations: [
    // WidgetCategoriesComponent,
    WidgetFiltersComponent,
    // WidgetPostsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    // Ng5SliderModule,
    SharedModule,
    FormsModule,
  ],
  exports: [
    // WidgetCategoriesComponent,
    WidgetFiltersComponent,
    // WidgetPostsComponent
  ],
})
export class WidgetsModule {}
