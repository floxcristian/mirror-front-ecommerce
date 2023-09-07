import { Component, Inject, Input, PLATFORM_ID, Output, EventEmitter, TemplateRef, HostListener } from '@angular/core';
import { ProductFilter } from '../../../shared/interfaces/product-filter';
import { isPlatformBrowser } from '@angular/common';
import { DirectionService } from '../../../shared/services/direction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../shared/services/products.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as uuid from 'uuid/v4';


@Component({
    selector: 'app-widget-filters',
    templateUrl: './widget-filters.component.html',
    styleUrls: ['./widget-filters.component.scss']
})
export class WidgetFiltersComponent {
    @Input() filters: ProductFilter[]= [];

    @Input() filtrosOculto!: boolean;
    @Input() mensaje!: string;


    @Input() set removableFilters(arr:any) {
        this.removableFiltersArray = [];

        Object.keys(arr).map((field, index) => {
            const obj = {
                field,
                value: arr[field]
            };
            this.removableFiltersArray.push(obj);
        });
    }

    @Input() set removableFiltersFlota(arr:any){
        this.removableFiltersFlotaArray = [];

        Object.keys(arr).map((field, index) => {
            if (Array.isArray(arr[field])) {
                arr[field].map(e => {
                    const obj = {
                        field,
                        value: e
                    };
                    this.removableFiltersFlotaArray.push(obj);
                });
            } else {
                const obj = {
                    field,
                    value: arr[field]
                };
                this.removableFiltersFlotaArray.push(obj);
            }
        });
    }

    @Input() removableCategory: any = [];

    @Output() filtersSelected: EventEmitter<any> = new EventEmitter();
    @Output() clearCategory: EventEmitter<any> = new EventEmitter();
    @Output() clearAll: EventEmitter<any> = new EventEmitter();


    removableFiltersArray: any = [];
    removableFiltersFlotaArray: any = [];

    isPlatformBrowser = isPlatformBrowser(this.platformId);
    rightToLeft = false;
    isCollapsed = false;
    id: string;

    modalRef!: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private direction: DirectionService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private productsService: ProductsService
    ) {
        this.rightToLeft = this.direction.isRTL();
        this.id = uuid();
    }

    openUserForm(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    marcaCheckBox() {
        const prefix = 'filter_';
        const filters:any = {};

        this.filters.map(item => {
            if (item.type === 'checkbox') {
                // const value = [];
                item.options.items.map(v => {
                    if (v.checked) {
                        filters[prefix + item.name] = v.label;
                        return;
                    }
                });
            }
            if (item.type === 'checkboxFlota') {
                const values:any[] = [];
                item.options.items.map((v:any) => {
                    if (v.checked) {
                        values.push(v.chassis);
                    }
                });
                if (values.length > 0) {
                    filters['chassis'] = values;
                }
            }
        });
        const obj: any = {
            selected: filters,
            all: this.filters
        };
        this.filtersSelected.emit(obj);
    }

    marcarCategorias(item:any) {
        item.checked = true;
    }

    removeCategory(category:any) {
        this.clearCategory.emit(true);
    }

    removeFilter(filter:any) {
        this.filters.map(item => {
            if (item.type === 'checkbox') {
                if (filter.field === 'filter_' + item.name) {
                    item.options.items.map((value:any) => {
                        if (value.label === filter.value) {
                            value.checked = false;
                        }
                    });
                }
            }
            if (item.type === 'checkboxFlota') {
                item.options.items.map((value:any) => {
                    if (value.chassis === filter.value) {
                        value.checked = false;
                    }
                });
            }
        });
        this.marcaCheckBox();
    }
    removeAllFilter() {
        this.clearAll.emit(true);
    }
}

