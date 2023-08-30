import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product } from '../../../shared/interfaces/product';
import { BlockHeaderGroup } from '../../../shared/interfaces/block-header-group';
import { DirectionService } from '../../../shared/services/direction.service';

@Component({
  selector: 'app-block-category-carousel',
  templateUrl: './block-category-carousel.component.html',
  styleUrls: ['./block-category-carousel.component.sass'],
})
export class BlockCategoryCarouselComponent implements OnChanges {
  @Input() header!: string;
  @Input() layout: 'grid-4' | 'grid-4-sm' | 'grid-5' | 'horizontal' = 'grid-4';
  @Input() rows = 1;
  @Input() categories: any[] = [];
  @Input() groups: BlockHeaderGroup[] = [];
  @Input() withSidebar = false;
  @Input() loading = false;
  @Input() subTitle = '';

  @Output() groupChange: EventEmitter<BlockHeaderGroup> = new EventEmitter();

  //   columns: Product[][] = [];
  columns: any[][] = [];

  carouselDefaultOptions: any = {
    items: 4,
    margin: 14,
    nav: false,
    dots: false,
    loop: false,
    stagePadding: 1,
    rtl: this.direction.isRTL(),
  };

  carouselOptionsByLayout: any = {
    'grid-4': {
      responsive: {
        1110: { items: 4, margin: 14 },
        930: { items: 4, margin: 10 },
        690: { items: 3, margin: 10 },
        400: { items: 2, margin: 10 },
        0: { items: 1 },
      },
    },
    'grid-4-sm': {
      responsive: {
        820: { items: 4, margin: 14 },
        640: { items: 3, margin: 10 },
        400: { items: 2, margin: 10 },
        0: { items: 1 },
      },
    },
    'grid-5': {
      responsive: {
        1110: { items: 5, margin: 12 },
        930: { items: 4, margin: 10 },
        690: { items: 3, margin: 10 },
        400: { items: 2, margin: 10 },
        0: { items: 1 },
      },
    },
    horizontal: {
      items: 3,
      responsive: {
        1110: { items: 3, margin: 14 },
        930: { items: 3, margin: 10 },
        690: { items: 2, margin: 10 },
        0: { items: 1 },
      },
    },
  };

  get carouselOptions(): any {
    return Object.assign(
      {},
      this.carouselDefaultOptions,
      this.carouselOptionsByLayout[this.layout]
    );
  }

  constructor(private direction: DirectionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const properties = Object.keys(changes);

    if (properties.includes('categories') || properties.includes('row')) {
      this.columns = [];
      if (this.rows > 0) {
        const categories = this.categories;
        while (categories.length > 0) {
          this.columns.push(categories.splice(0, this.rows));
        }
      }
    }
  }
}
