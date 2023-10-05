import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { TrackingStep } from '../../../../shared/interfaces/tracking'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-page-tracking',
  templateUrl: './page-tracking.component.html',
  styleUrls: ['./page-tracking.component.scss'],
})
export class PageTrackingComponent implements OnInit {
  formBuscar!: FormGroup
  innerWidth: number
  OVEstados: TrackingStep[] = []
  OV: string | null = ''
  loadingShippingAll: boolean = false
  OVEstado: any = []
  EstadoOV: any = []
  DetalleOV: any = {}
  usuario: any
  constructor(
    private localS: LocalStorageService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.usuario = this.localS.get('usuario')
  }

  ngOnInit() {
    if (this.route.snapshot.params['ov'] !== undefined) {
      this.OV = this.route.snapshot.paramMap.get('ov')
    }
  }

  onPageChange(pageNumber: any): void {
    window.scrollTo({ top: 0 })
  }
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth
    window.scrollTo({ top: 0 })
  }
}
