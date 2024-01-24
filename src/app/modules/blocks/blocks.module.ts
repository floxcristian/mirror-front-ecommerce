// Angular
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Libs
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-bootstrap/carousel';
// Modules
import { SharedModule } from '../../shared/shared.module';
// Components
import { BlockBrandsB2cComponent } from './block-brands-b2c/block-brands-b2c.component';
import { BlockSlideshowComponent } from './block-slideshow/block-slideshow.component';
import { BlockBrandsComponent } from './block-brands/block-brands.component';

@NgModule({
  declarations: [
    BlockBrandsComponent,
    BlockSlideshowComponent,
    BlockBrandsB2cComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    CarouselModule.forRoot(),
    NgOptimizedImage,
  ],
  exports: [
    BlockBrandsComponent,
    BlockSlideshowComponent,
    BlockBrandsB2cComponent,
  ],
})
export class BlocksModule {}
