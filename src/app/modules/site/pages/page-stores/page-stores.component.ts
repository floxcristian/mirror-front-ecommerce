// Angular
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Models
import { ICollapsableStore } from './collapsable-store.interface';
// Services
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ConfigService } from '@core/config/config.service';
import { IConfig, IStoresPage } from '@core/config/config.interface';

@Component({
  selector: 'app-stores',
  templateUrl: './page-stores.component.html',
  styleUrls: ['./page-stores.component.scss'],
})
export class PageStoresComponent {
  stores: ICollapsableStore[] = [];
  selectedStore!: ICollapsableStore;
  isCollapsed!: boolean;
  innerWidth: number;
  //pageConfig!: IStoresPage;
  config: IConfig;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly geolocationService: GeolocationServiceV2,
    private readonly configService: ConfigService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.config = this.configService.getConfig();
  }

  ngOnInit(): void {
    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        this.stores = stores.map((store) => ({ ...store, isCollapsed: true }));
        if (this.stores.length) {
          this.selectedStore = this.stores[0];
        }
      },
    });
  }

  /**
   * Mostrar información de la tienda seleccionada.
   * @param store
   */
  showStoreDetail(store: ICollapsableStore): void {
    if (this.innerWidth < 427) {
      store.isCollapsed = !store.isCollapsed;
    } else {
      this.selectedStore = store;
    }
    let x = document.querySelector('#informacionTienda');
    if (x) {
      x.scrollIntoView();
    }
  }

  onResize(event: any): void {
    this.innerWidth = event.target.innerWidth;
  }
}
