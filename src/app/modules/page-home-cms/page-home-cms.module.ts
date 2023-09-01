import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [CommonModule, SharedModule, NgbModule, CarouselModule],
  declarations: [],
  exports: [],
})
export class PageHomeCmsModule {}
