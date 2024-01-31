// Angular
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
// Services
import { LocalStorageService } from '../core/modules/local-storage/local-storage.service';
import { StorageKey } from '@core/storage/storage-keys.enum';

@Component({
  selector: 'app-layout',
  template: `<app-b2c />`,
})
export class LayoutComponent implements OnInit {
  fbclid: string | undefined = '';
  gclid: string = '';
  utm_campaign: string | undefined = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly localS: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.scrollTop();
    this.getQueryParams();
  }

  /**
   * Hace scroll top.
   */
  scrollTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.scrollTop = 0; // Safari
      document.documentElement.scrollTop = 0; // Other
    }
  }

  /**
   * Obtener parámetros de la url para tracking
   * + Estos parámetros solo son enviados cuando se ingresa a la web desde una campaña de marketing?
   */
  getQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['utm_campaign']) {
        this.utm_campaign = params['utm_campaign'];
        this.localS.set(StorageKey.utm_campaign, this.utm_campaign);
      } else this.utm_campaign = undefined;

      if (params['gclid']) {
        this.gclid = params['gclid'];
        this.localS.set(StorageKey.gclid, this.gclid);
      }

      if (params['fbclid']) {
        this.fbclid = params['fbclid'];
        this.localS.set(StorageKey.fbclid, this.fbclid);
      } else this.fbclid = undefined;
    });
  }
}
