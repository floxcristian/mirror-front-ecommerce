// Angular
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// Services
import { LocalStorageService } from '../core/modules/local-storage/local-storage.service';
import { CategoryService } from '../shared/services/category.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  isB2B: boolean = false;
  fbclid: string | undefined = '';
  gclid: string = '';
  utm_campaign: string | undefined = '';
  tipo: string = 'b2c';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly localS: LocalStorageService,
    private categoriesService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.scrollTop();
    this.checkIsB2b();
    this.getQueryParams();
    this.categoriesService.obtieneCategoriasHeader().subscribe((r) => {});
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
   * Verifica si el usuario es B2B.
   * @returns
   */
  checkIsB2b() {
    // let { user_role: userRole } = this.rootService.getDataSesionUsuario();
    const session = this.sessionService.getSession();
    if (['supervisor', 'comprador'].includes(session.userRole))
      this.tipo = 'b2b';
  }

  /**
   * Obtener parámetros de la url para tracking
   * + Estos parámetros solo son enviados cuando se ingresa a la web desde una campaña de marketing?
   */
  getQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
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
