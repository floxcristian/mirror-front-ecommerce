import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules (third-party)

// modules
import { SharedModule } from '../../shared/shared.module';

// blocks
import { BlockBannerComponent } from './block-banner/block-banner.component';
import { BlockBrandsComponent } from './block-brands/block-brands.component';
import { BlockCategoriesComponent } from './block-categories/block-categories.component';
import { BlockFeaturesComponent } from './block-features/block-features.component';
import { BlockMapComponent } from './block-map/block-map.component';
import { BlockProductColumnsComponent } from './block-product-columns/block-product-columns.component';
import { BlockProductsCarouselComponent } from './block-products-carousel/block-products-carousel.component';
import { BlockProductsComponent } from './block-products/block-products.component';
import { BlockSlideshowComponent } from './block-slideshow/block-slideshow.component';

// components
import { BlockHeaderComponent } from './components/block-header/block-header.component';

import { BlockSearchAplicationComponent } from './block-search-aplication/block-search-aplication.component';
import { BlockSearchAplicationSliderComponent } from './block-search-aplication-slider/block-search-aplication-slider.component';
import { BlockCategoryCarouselComponent } from './block-category-carousel/block-category-carousel.component';
import { BlockProductCatalogComponent } from './block-product-catalog/block-product-catalog.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BlockNewsletterComponent } from './block-newsletter/block-newsletter.component';
import { BlockVideoCarouselComponent } from './block-video-carousel/block-video-carousel.component';
import { BlockConceptsComponent } from './block-concepts/block-concepts.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BlockBrandsB2cComponent } from './block-brands-b2c/block-brands-b2c.component';

@NgModule({
  declarations: [
    // blocks
    BlockBannerComponent,
    BlockBrandsComponent,
    BlockCategoriesComponent,
    BlockFeaturesComponent,
    BlockMapComponent,
    BlockProductColumnsComponent,
    BlockProductsCarouselComponent,
    BlockProductsComponent,
    BlockSlideshowComponent,
    // components
    BlockHeaderComponent,
    BlockSearchAplicationComponent,
    BlockSearchAplicationSliderComponent,
    BlockCategoryCarouselComponent,
    BlockProductCatalogComponent,
    BlockNewsletterComponent,
    BlockVideoCarouselComponent,
    BlockConceptsComponent,
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
    BlockBannerComponent,
    BlockBrandsComponent,
    BlockCategoriesComponent,
    BlockFeaturesComponent,
    BlockMapComponent,
    BlockProductColumnsComponent,
    BlockProductsCarouselComponent,
    BlockProductsComponent,
    BlockSlideshowComponent,
    BlockSearchAplicationComponent,
    BlockCategoryCarouselComponent,
    BlockProductCatalogComponent,
    BlockNewsletterComponent,
    BlockVideoCarouselComponent,
    BlockConceptsComponent,
    BlockHeaderComponent,
    BlockBrandsB2cComponent,
  ],
})
export class BlocksModule {}
