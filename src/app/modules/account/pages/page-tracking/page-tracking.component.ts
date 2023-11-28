import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TrackingStep } from '../../../../shared/interfaces/tracking';
import { isPlatformBrowser } from '@angular/common';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/states-v2/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';

@Component({
  selector: 'app-page-tracking',
  templateUrl: './page-tracking.component.html',
  styleUrls: ['./page-tracking.component.scss'],
})
export class PageTrackingComponent implements OnInit {
  formBuscar!: FormGroup;
  innerWidth: number;
  OVEstados: TrackingStep[] = [];
  OV: string | null = '';
  loadingShippingAll: boolean = false;
  OVEstado: any = [];
  EstadoOV: any = [];
  DetalleOV: any = {};
  usuario: ISession | null;
  constructor(
    //  private localS: LocalStorageService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionStorage: SessionStorageService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    // this.usuario = this.localS.get('usuario');
    this.usuario = this.sessionStorage.get();
  }

  ngOnInit() {
    if (this.route.snapshot.params['ov'] !== undefined) {
      this.OV = this.route.snapshot.paramMap.get('ov');
    }
  }

  onPageChange(pageNumber: any): void {
    window.scrollTo({ top: 0 });
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    window.scrollTo({ top: 0 });
  }
}
