// Angular
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer:Renderer2
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
      const body_e = this.renderer.selectRootElement('body',true) // safari
      this.renderer.setProperty(body_e,'scrollTop',0)
      const html_e = this.renderer.selectRootElement('html',true) //other
      this.renderer.setProperty(html_e,'scrollTop',0)
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
