// Angular
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
// Models
import { IConfig } from '@core/config/config.interface';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { IZoneGroup } from './models/zone-group.interface';
// Services
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ConfigService } from '@core/config/config.service';
import { ScriptService } from '@core/utils-v2/script/script.service';
import { StoreUtilService } from './services/store-util.service';
// Env
import { environment } from '@env/environment';
@Component({
  selector: 'app-stores',
  templateUrl: './page-stores.component.html',
  styleUrls: ['./page-stores.component.scss'],
})
export class PageStoresComponent {
  @ViewChild('informacionTienda',{ static: true }) _informacionTienda!: ElementRef
  storesByZone: IZoneGroup[] = [];
  selectedStore!: IStore;
  config: IConfig;

  markerPositions: google.maps.LatLngLiteral[] = [];
  options: google.maps.MapOptions = {
    disableDefaultUI: false,
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoom: 15,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  center: google.maps.LatLngLiteral = {
    lat: -33.54864395765844,
    lng: -70.70984971059704,
  };
  isMapLoaded!: boolean;

  constructor(
    // Services V2
    private readonly geolocationService: GeolocationServiceV2,
    private readonly configService: ConfigService,
    private readonly scriptService: ScriptService,
    private renderer:Renderer2
  ) {
    this.config = this.configService.getConfig();
  }

  ngOnInit(): void {
    this.scriptService
      .loadScript(environment.gmapScript)
      .then(() => (this.isMapLoaded = true));
    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        if (!stores.length) return;
        this.storesByZone = StoreUtilService.getOrderedStoresByZone(stores);
        if (this.storesByZone?.[0]?.stores?.length) {
          this.showStoreDetail(this.storesByZone[0].stores[0]);
        }
      },
    });
  }

  /**
   * Mostrar información de la tienda seleccionada.
   * @param store
   */
  showStoreDetail(store: IStore, focus: boolean = false): void {
    this.selectedStore = store;
    this.updatePosition(this.selectedStore);
    if (focus) {
      if (this._informacionTienda) {
        this.renderer.selectRootElement(this._informacionTienda.nativeElement,true).scrollIntoView()
      }
    }
  }

  /**
   * Centrar mapa y actualizar marcador.
   * @param store
   */
  private updatePosition({ lat, lng }: IStore): void {
    this.center = { lat, lng };
    this.markerPositions = [{ lat, lng }];
  }
}
