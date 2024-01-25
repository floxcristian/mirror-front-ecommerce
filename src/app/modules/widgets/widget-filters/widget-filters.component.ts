// Angular
import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Libs
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';
// Interfaces
import { ProductFilter } from '../../../shared/interfaces/product-filter';
import { ICategory } from '../../shop/pages/page-category/category.interface';
import { Params } from '@angular/router';
import { IWidgetFilter } from './widget-filter.interface';

@Component({
  selector: 'app-widget-filters',
  templateUrl: './widget-filters.component.html',
  styleUrls: ['./widget-filters.component.scss'],
})
export class WidgetFiltersComponent {
  @Input() filters: ProductFilter[] = [];
  @Input() filtrosOculto!: boolean;
  @Input() mensaje!: string;
  @Input() marca_tienda!: string;
  @Input() removableCategory: ICategory[] = [];
  @Input() set removableFilters(filters: Params) {
    this.removableFiltersArray = Object.keys(filters).map((field) => ({
      field,
      value: filters[field],
    }));
  }

  @Output() filtersSelected: EventEmitter<any> = new EventEmitter();
  @Output() clearCategory: EventEmitter<boolean> = new EventEmitter();
  @Output() clearAll: EventEmitter<boolean> = new EventEmitter();

  removableFiltersArray: IWidgetFilter[] = [];

  isPlatformBrowser = isPlatformBrowser(this.platformId);
  isCollapsed = false;
  id: string;

  modalRef!: BsModalRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private modalService: BsModalService
  ) {
    this.id = uuidv4();
    console.log('WidgetFiltersComponent constructor');
  }

  openUserForm(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  marcaCheckBox(): void {
    const prefix = 'filter_';
    const filters: any = {};

    this.filters.map((item) => {
      if (item.type === 'checkbox') {
        // const value = [];
        item.options.items.map((v: any) => {
          if (v.checked) {
            filters[prefix + item.name] = v.label;
            return;
          }
        });
      }
      if (item.type === 'checkboxFlota') {
        const values: any[] = [];
        item.options.items.map((v: any) => {
          if (v.checked) {
            values.push(v.chassis);
          }
        });
        if (values.length) {
          filters['chassis'] = values;
        }
      }
    });
    const obj: any = {
      selected: filters,
      all: this.filters,
    };
    this.filtersSelected.emit(obj);
  }

  marcarCategorias(item: any): void {
    item.checked = true;
  }

  removeFilter(filter: any): void {
    this.filters.map((item) => {
      if (item.type === 'checkbox') {
        if (filter.field === 'filter_' + item.name) {
          item.options.items.map((value: any) => {
            if (value.label === filter.value) {
              value.checked = false;
            }
          });
        }
      }
      if (item.type === 'checkboxFlota') {
        item.options.items.map((value: any) => {
          if (value.chassis === filter.value) {
            value.checked = false;
          }
        });
      }
    });
    this.marcaCheckBox();
  }

  removeCategory(): void {
    this.clearCategory.emit(true);
  }

  removeAllFilters(): void {
    this.clearAll.emit(true);
  }
}
