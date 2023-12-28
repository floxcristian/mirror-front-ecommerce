// Angular
import { Component, Input, OnInit } from '@angular/core';
// Rxjs
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
// Env
import { environment } from '@env/environment';
// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
declare const L: any;

@Component({
  selector: 'app-mapa-fichas',
  templateUrl: './mapa-fichas.component.html',
  styleUrls: ['./mapa-fichas.component.scss'],
})
export class MapaFichasComponent implements OnInit {
  @Input() selectedStore!: IStore;
  @Input() stock!: number;

  accessToken = environment.tokenMapbox;
  map: any;
  Layer: any;

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((event) => {});
    this.initMap();
  }

  ngOnChange(): void {
    window.dispatchEvent(new Event('resize'));
  }

  private initMap(): void {
    window.dispatchEvent(new Event('resize'));
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
        this.accessToken,
      {
        maxZoom: 18,
        id: 'mapbox/streets-v12',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.accessToken,
      }
    ).addTo(map);
    this.map = map;
    this.getpointer();
  }

  /**
   * Setear marcador de la tienda en el mapa.
   */
  private getpointer(): void {
    const feature = {
      type: 'Feature',
      properties: this.selectedStore,
      geometry: {
        type: 'Point',
        coordinates: [this.selectedStore.lng, this.selectedStore.lat],
      },
    };

    this.Layer = L.geoJson({ type: 'FeatureCollection', features: [feature] });
    this.map.addLayer(this.Layer);
    this.map.fitBounds(this.Layer.getBounds());
  }
}
