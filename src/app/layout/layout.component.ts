// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// Storage
import { LocalStorageService } from 'angular-2-local-storage';
// Services
import { RootService } from '../shared/services/root.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  isB2B: boolean = false
  // fbclid: string = ''
  fbclid:any
  gclid: string = ''
  // utm_campaign: string = ''
  utm_campaign:any

  constructor(
    private readonly rootService: RootService,
    private readonly route: ActivatedRoute,
    private readonly localS: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.scrollTop();
    this.isB2B = this.checkIsB2b();
    this.getQueryParams();
  }

  /**
   * Hace scroll top.
   */
  scrollTop(): void {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }

  /**
   * Verifica si el usuario es B2B.
   * @returns
   */
  checkIsB2b(): boolean {
    const { user_role: userRole } = this.rootService.getDataSesionUsuario();
    return ['supervisor', 'comprador'].includes(userRole || '');
  }

  /**
   * Obtener parámetros de la url para tracking
   * + Estos parámetros solo son enviados cuando se ingresa a la web desde una campaña de marketing?
   */
  getQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('[params on layout]: ', params);

      if (params['utm_campaign']) {
        this.utm_campaign = params['utm_campaign'];
        this.localS.set('utm_campaign', this.utm_campaign);
      } else this.utm_campaign = undefined;

      if (params['gclid']) {
        this.gclid = params['gclid'];
        this.localS.set('gclid', this.gclid);
      }

      if (params['fbclid']) {
        this.fbclid = params['fbclid'];
        this.localS.set('fbclid', this.fbclid);
      } else this.fbclid = undefined;
    });
  }
}
