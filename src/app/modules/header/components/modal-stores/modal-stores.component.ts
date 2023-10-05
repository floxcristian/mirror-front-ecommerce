import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  EventEmitter,
  AfterViewInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core'
import { LogisticsService } from '../../../../shared/services/logistics.service'
import { ResponseApi } from '../../../../shared/interfaces/response-api'
import { TiendaLocation } from '../../../../shared/interfaces/geo-location'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { GeoLocationService } from '../../../../shared/services/geo-location.service'
import { Router } from '@angular/router'
import { combineLatest, Subscription } from 'rxjs'
import { first, take } from 'rxjs/operators'

@Component({
  selector: 'app-modal-stores',
  templateUrl: './modal-stores.component.html',
  styleUrls: ['./modal-stores.component.scss'],
})
export class ModalStoresComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTemplate', { static: false }) modalTemplate!: ElementRef
  @Input() modalRef!: BsModalRef
  @Output() template = new EventEmitter<any>()

  tiendas!: TiendaLocation[]
  tienda!: TiendaLocation | undefined
  tiendaTemporal!: TiendaLocation
  geoLocationServicePromise!: Subscription
  subscriptions: Subscription[] = []
  i = 0

  constructor(
    private logisticsService: LogisticsService,
    private geoLocationService: GeoLocationService,
    private router: Router,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.tienda = this.geoLocationService.getTiendaSeleccionada()

    this.logisticsService.obtenerTiendas().subscribe((r: ResponseApi) => {
      this.tiendas = r.data
    })
    this.geoLocationServicePromise =
      this.geoLocationService.localizacionObs$.subscribe(
        (r) => (this.tienda = this.geoLocationService.getTiendaSeleccionada()),
      )
    /* this.logisticsService.$stores.subscribe(r => {
      this.tiendas = r.data;
    }); */
  }

  ngAfterViewInit(): void {
    this.template.emit(this.modalTemplate)
  }

  ngOndestroy() {
    this.geoLocationServicePromise
      ? this.geoLocationServicePromise.unsubscribe()
      : ''
  }

  estebleceTienda() {}

  cambiarTienda() {
    const tienda = this.tiendaTemporal
    const coord = {
      lat: this.tiendaTemporal.lat,
      lon: this.tiendaTemporal.lon,
    }

    this.geoLocationService.cambiarTiendaCliente(coord, tienda)
    this.tienda = this.geoLocationService.getTiendaSeleccionada()
    this.modalRef.hide()
    // window.location.reload();
  }

  cambiarTiendaMasCercana() {}
}
