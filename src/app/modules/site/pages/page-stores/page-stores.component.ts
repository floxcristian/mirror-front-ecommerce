import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { StoresService } from '../../../../shared/services/stores.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-stores',
  templateUrl: './page-stores.component.html',
  styleUrls: ['./page-stores.component.scss'],
})
export class PageStoresComponent {
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
          result.colapse = true;
          return result;
        });
        this.rows[0] ? (this.tienda = this.rows[0]) : null;
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error de conexión, para obtener tiendas');
      }
    );
  }

  mostrarTienda(tienda: any) {
    if (this.innerWidth < 427) {
      tienda.colapse = !tienda.colapse;
    } else {
      // this.tienda = null;
      this.tienda = tienda;
    }
    let x = document.querySelector('#informacionTienda');
    if (x) {
      x.scrollIntoView();
    }
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
