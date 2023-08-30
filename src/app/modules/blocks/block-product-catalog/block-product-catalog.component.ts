import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { BlockHeaderGroup } from '../../../shared/interfaces/block-header-group';
import { ProductsService } from '../../../shared/services/products.service';
import { Product } from '../../../shared/interfaces/product';

@Component({
  selector: 'app-block-product-catalog',
  templateUrl: './block-product-catalog.component.html',
  styleUrls: ['./block-product-catalog.component.scss'],
})
export class BlockProductCatalogComponent implements OnChanges {
  @Input() header!: string;
  @Input() layout: 'grid-4' | 'grid-4-sm' | 'grid-5' | 'horizontal' = 'grid-4';
  @Input() rows = 1;
  @Input() categories: any[] = [];
  @Input() groups: BlockHeaderGroup[] = [];
  @Input() withSidebar = false;
  @Input() loading = false;

  @Output() groupChange: EventEmitter<BlockHeaderGroup> = new EventEmitter();
  products: Product[] = [];
  cargandoCatalogo = false;

  constructor(private productService: ProductsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const properties = Object.keys(changes);

    if (properties.includes('categories') || properties.includes('row')) {
      this.categories.map((e) => (e.active = false));
      this.categories[0].active = true;
      this.loadCategory();
    }
  }

  selSubcategory(item: any) {
    this.categories.map((e) => (e.active = false));
    this.categories.map((e) => {
      if (e.title === item.title) {
        e.active = true;
        return;
      }
    });
    this.loadCategory();
  }

  loadCategory() {}
}
