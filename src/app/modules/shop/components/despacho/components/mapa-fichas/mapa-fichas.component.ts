// Angular
import { Component, Input, OnInit } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
// Services
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
  options!: google.maps.MapOptions;
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
      this.options = {
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        zoomControl: true,
        //draggable: false,
        //disableDoubleClickZoom: true,
        //scrollwheel: false,
      };
      this.isMapLoaded = true;
    });
    if (this.selectedStore) {
      this.updatePosition(this.selectedStore);
    }
  }

  updatePosition({ lat, lng }: IStore): void {
    this.center = { lat, lng };
    this.markerPositions = [];
    this.markerPositions.push(this.center);
  }
}
