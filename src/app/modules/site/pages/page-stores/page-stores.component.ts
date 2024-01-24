// Angular
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Models
import { ICollapsableStore, IZoneGroup } from './collapsable-store.interface';
// Services
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ConfigService } from '@core/config/config.service';
import { IConfig, IStoresPage } from '@core/config/config.interface';
import { ScriptService } from '@core/utils-v2/script/script.service';
// Env
import { environment } from '@env/environment';
@Component({
  selector: 'app-stores',
  templateUrl: './page-stores.component.html',
  styleUrls: ['./page-stores.component.scss'],
})
export class PageStoresComponent {
  selectedStore!: ICollapsableStore;
  config: IConfig;
  orderedStores: IZoneGroup[] = [];
  // orden de como se mostraran las zonas en la vista
  zoneOrder = ['ZONA NORTE', 'ZONA CENTRO', 'ZONA SUR'];

  markerPositions: google.maps.LatLngLiteral[] = [];
  options: google.maps.MapOptions = {
    disableDefaultUI: false,
    // tipos de mapas: roadmap, satellite, hybrid, terrain
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    zoomControl: true,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  center: google.maps.LatLngLiteral = {
    lat: -33.54864395765844,
    lng: -70.70984971059704,
  };
  zoom = 15;
  isMapLoaded: boolean = false;

  constructor(
    // Services V2
    private readonly geolocationService: GeolocationServiceV2,
    private readonly configService: ConfigService,
    private readonly scriptService: ScriptService
  ) {
    this.config = this.configService.getConfig();
  }

  ngOnInit(): void {
    this.scriptService.loadScript(environment.gmapScript).then(() => {
      this.isMapLoaded = true;
    });
    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        const storesByZone = stores as ICollapsableStore[];
        const groupedStores = this.groupByZone(storesByZone);
        this.orderedStores = this.orderZones(groupedStores, this.zoneOrder);
        if (
          this.orderedStores.length > 0 &&
          this.orderedStores[0].stores.length > 0
        ) {
          this.showStoreDetail(this.orderedStores[0].stores[0], false);
        }
      },
    });
  }

  /**
   * Mostrar información de la tienda seleccionada.
   * @param store
   */
  showStoreDetail(store: any, move: boolean): void {
    this.selectedStore = store as ICollapsableStore;
    this.updatePosition(this.selectedStore);
    let x = document.querySelector('#informacionTienda');
    if (move) {
      if (x) {
        x.scrollIntoView();
      }
    }
  }

  groupByZone(stores: ICollapsableStore[]) {
    return stores.reduce((acc: any, store) => {
      const zoneKey = store.zoneGroup.toLowerCase().replace(/\s+/g, '-'); // "ZONA NORTE" -> "zona-norte"
      if (!acc[zoneKey]) {
        acc[zoneKey] = {
          title: store.zoneGroup,
          stores: [],
        };
      }
      acc[zoneKey].stores.push(store);
      return acc;
    }, {});
  }

  orderZones(
    groupedStores: Record<string, any>,
    zoneOrder: string[]
  ): IZoneGroup[] {
    return zoneOrder
      .filter((zone) => groupedStores[zone.toLowerCase().replace(/\s+/g, '-')])
      .map((zone) => ({
        title: zone,
        stores: groupedStores[zone.toLowerCase().replace(/\s+/g, '-')].stores,
      }));
  }

  updatePosition(event: any) {
    const { lat, lng } = this.formatCoordinates(event.lat, event.lng);
    this.center = { lat, lng };
    this.markerPositions = [];
    this.markerPositions.push(this.center);
  }

  formatCoordinates(lat: number, lng: number) {
    const getDivisor = (num: number) => {
      const digits = Math.abs(num).toString().length;
      return Math.pow(10, digits - 2);
    };
    const latDivisor = getDivisor(lat);
    const lngDivisor = getDivisor(lng);
    return {
      lat: lat / latDivisor,
      lng: lng / lngDivisor,
    };
  }
}
