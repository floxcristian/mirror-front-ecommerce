// Angular
import { Component, Input, OnInit } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { ScriptService } from '@core/utils-v2/script/script.service';
@Component({
  selector: 'app-mapa-fichas',
  templateUrl: './mapa-fichas.component.html',
  styleUrls: ['./mapa-fichas.component.scss'],
})
export class MapaFichasComponent implements OnInit {
  @Input() selectedStore!: IStore;
  @Input() stock!: number;
  @Input() productDropshipment: number = 0;

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
    //draggable: false,
    //disableDoubleClickZoom: true,
    //scrollwheel: false,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  center: google.maps.LatLngLiteral = {
    lat: -33.54864395765844,
    lng: -70.70984971059704,
  };
  zoom = 16;
  isMapLoaded!: boolean;

  constructor(private readonly scriptService: ScriptService) {}

  ngOnInit(): void {
    this.scriptService.loadScript(environment.gmapScript).then(() => {
      this.isMapLoaded = true;
    });
    if (this.selectedStore) {
      this.updatePosition(this.selectedStore);
    }
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
