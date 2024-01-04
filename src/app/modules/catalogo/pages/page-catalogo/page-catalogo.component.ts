import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { StorageKey } from '@core/storage/storage-keys.enum';
import { CatalogService } from '@core/services-v2/catalog.service';
import { ICatalog } from '@core/models-v2/catalog/catalog-response.interface';

@Component({
  selector: 'app-page-catalogo',
  templateUrl: './page-catalogo.component.html',
  styleUrls: ['./page-catalogo.component.scss'],
})
export class PageCatalogoComponent implements OnInit {
  lstCatalogos!: any[];

  constructor(
    private localS: LocalStorageService,
    private router: Router,
    //ServicesV2
    private readonly catalogoService:CatalogService
  ) {}

  async ngOnInit() {
    let params = {
      type:'Web',
      data:1,
      status:'Publicado'
    }
    this.catalogoService.getCatalogs(params).subscribe({
      next:(res)=>{
        console.log(res)
        this.lstCatalogos = res.data.reverse()
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  verCatalogo(catalogo: ICatalog) {
    this.localS.set(StorageKey.catalogo, catalogo);
    if (
      typeof catalogo !== 'undefined' &&
      catalogo.hasOwnProperty('dynamic')
    ) {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo-flip']);
    } else {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo']);
    }
  }
}
