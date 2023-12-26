// Angular
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
// Services
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';

@Component({
  selector: 'app-stores',
  templateUrl: './page-select-catalog.component.html',
  styleUrls: ['./page-select-catalog.component.scss'],
})
export class PageSelectCatalogComponent {
  innerWidth: number;
  stores: IStore[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit(): void {
    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        this.stores = stores.sort((a, b) => a.zone.localeCompare(b.zone));
      },
    });
  }

  onResize(event: any): void {
    this.innerWidth = event.target.innerWidth;
  }
}
