import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionStorageService } from '@core/storage/session-storage.service';

@Component({
  selector: 'app-page-tracking',
  templateUrl: './page-tracking.component.html',
  styleUrls: ['./page-tracking.component.scss'],
})
export class PageTrackingComponent implements OnInit {
  innerWidth: number;
  OV: string | null = '';
  usuario: ISession | null;
  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionStorage: SessionStorageService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.usuario = this.sessionStorage.get();
  }

  ngOnInit() {
    if (this.route.snapshot.params['ov'] !== undefined) {
      this.OV = this.route.snapshot.paramMap.get('ov');
    }
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    window.scrollTo({ top: 0 });
  }
}
