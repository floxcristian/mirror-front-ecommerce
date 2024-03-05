import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-inicio-sesion',
  templateUrl: './page-inicio-sesion.component.html',
  styleUrls: ['./page-inicio-sesion.component.scss'],
})
export class PageInicioSesionComponent implements OnInit {
  innerWidth: number;
  ruta: any;
  constructor(
    private localStorage: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    let pagina = this.localStorage.get('ruta');
    this.ruta = pagina;
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
