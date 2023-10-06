import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
declare const L: any;

@Component({
  selector: 'app-map-chilexpress',
  templateUrl: './map-chilexpress.component.html',
  styleUrls: ['./map-chilexpress.component.scss'],
})
export class MapChilexpressComponent implements OnInit {
  map: any;
  Layer: any;
  index = 0;
  popup: any = L.popup();
  @Input() sucursales: any = [];
  @Output() fechasShipping: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((event) => {});
    this.initMap();
  }
  ngOnChange() {
    window.dispatchEvent(new Event('resize'));
  }

  private initMap(): void {
    window.dispatchEvent(new Event('resize'));
    let accessToken =
      'pk.eyJ1Ijoic3VwZXJzYngwMCIsImEiOiJjaWpsZ3FsN3QwMDIydGhtNTh4aGhubG5xIn0.i2J0k0mBZhIi7W-bsPTJiQ';
    let map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
        accessToken,
      {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken,
      }
    ).addTo(map);

    this.map = map;
    this.getpointer();
  }

  getpointer() {
    let jsonFeatures: any = [];

    for (let i = 0; i < this.sucursales.length; i++) {
      let item: any = this.sucursales[i];
      item.id = i;
      let lat = item.latitude;
      let lon = item.longitude;

      let feature = {
        type: 'Feature',
        properties: item,
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
      };

      jsonFeatures.push(feature);
    }

    let geoJson = { type: 'FeatureCollection', features: jsonFeatures };

    this.Layer = L.geoJson(geoJson);

    this.map.addLayer(this.Layer);
    this.map.fitBounds(this.Layer.getBounds());

    this.Layer.on('click', (e: any) => {
      this.getPromesas(e.layer.feature.properties.id);
    });
    this.getPromesas(this.index);
  }

  getPromesas(i: any) {
    this.index = i;
    let item = this.sucursales[i];
    this.fechasShipping.emit(item);
    this.map.setView([item.latitude, item.longitude], 17);
  }

  onMapClick(e: any) {
    this.popup
      .setContent('You clicked the map at ' + e.latlng.toString())
      .openOn(this.map);
  }
}
