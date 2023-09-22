import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { StoresService } from '../../../../shared/services/stores.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-stores',
  templateUrl: './page-select-catalog.component.html',
  styleUrls: ['./page-select-catalog.component.scss'],
})
export class PageSelectCatalogComponent {
  isCollapsed = false;
  rows: any[] = [];
  innerWidth: number;
  tienda: any;

  constructor(
    private stores: StoresService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.stores.obtieneTiendas().subscribe(
      (r: any) => {
        this.rows = r.data.map((result: any) => {
          return result;
        });
        this.rows.sort((a: any, b: any) => (a['zona'] > b['zona'] ? 1 : -1));
      },
      (error) => {
        console.log(error);
        // this.toastr.error('Error de conexión, para obtener tiendas');
      }
    );
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
