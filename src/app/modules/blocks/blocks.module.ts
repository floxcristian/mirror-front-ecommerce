import { NgModule } from '@angular/core';
// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from '../../shared/shared.module';

// blocks
import { BlockBrandsB2cComponent } from './block-brands-b2c/block-brands-b2c.component';
import { BlockSlideshowComponent } from './block-slideshow/block-slideshow.component';

//B2B
import { BlockBrandsComponent } from './block-brands/block-brands.component';

// components
import { BlockHeaderComponent } from './components/block-header/block-header.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
    // blocks
    BlockBrandsComponent,
    BlockSlideshowComponent,
    // components
    // BlockHeaderComponent,
    BlockBrandsB2cComponent,
  ],
  imports: [
    // modules (angular)
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    CarouselModule.forRoot(),
  ],
  exports: [
    // blocks
    BlockBrandsComponent,
    BlockSlideshowComponent,
    // BlockHeaderComponent,
    BlockBrandsB2cComponent,
  ],
})
export class BlocksModule {}
