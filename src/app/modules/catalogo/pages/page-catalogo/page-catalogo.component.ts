import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-catalogo',
  templateUrl: './page-catalogo.component.html',
  styleUrls: ['./page-catalogo.component.scss']
})
export class PageCatalogoComponent implements OnInit {
  lstCatalogos!: any[];

  constructor(private catalogoService: CatalogoService, private localS: LocalStorageService, private router: Router) {}

  async ngOnInit() {
    let consulta = await this.catalogoService.obtenerCatalogos('Publicado');
    this.lstCatalogos = consulta.reverse();
  }

  verCatalogo(catalogo:any) {
    this.localS.set('catalogo', catalogo);
    if (typeof catalogo !== 'undefined' && catalogo.hasOwnProperty('dinamico'))
    {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo-flip']);
    }else{
      this.router.navigate(['/', 'catalogos', 'ver-catalogo']);
    }
  }
}
