import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { StorageKey } from '@core/storage/storage-keys.enum';
import { CatalogService } from '@core/services-v2/catalog.service';
import { ICatalog } from '@core/models-v2/catalog/catalog-response.interface';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-catalogo',
  templateUrl: './page-catalogo.component.html',
  styleUrls: ['./page-catalogo.component.scss'],
})
export class PageCatalogoComponent implements OnInit {
  lstCatalogos: ICatalog[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private localS: LocalStorageService,
    private router: Router,
    //ServicesV2
    private readonly catalogoService: CatalogService,
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      let params = {
        type: 'Web',
        data: 1,
        status: 'Publicado',
      };
      this.catalogoService.getCatalogs(params).subscribe({
        next: (res) => {
          this.lstCatalogos = res.data.reverse();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  verCatalogo(catalogo: ICatalog) {
    this.localS.set(StorageKey.catalogo, catalogo);
    if (
      typeof catalogo !== 'undefined' &&
      catalogo.hasOwnProperty('dynamic') &&
      catalogo.dynamic
    ) {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo-flip']);
    } else {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo']);
    }
  }
}
