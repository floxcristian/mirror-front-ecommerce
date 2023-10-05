import { Component, Input, OnInit } from '@angular/core'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { GeoLocationService } from '../../../../../shared/services/geo-location.service'
declare const L: any
@Component({
  selector: 'app-mapa-fichas',
  templateUrl: './mapa-fichas.component.html',
  styleUrls: ['./mapa-fichas.component.scss'],
})
export class MapaFichasComponent implements OnInit {
  map: any
  Layer: any
  index = 0
  popup: any = L.popup()
  @Input() tiendaSeleccionada: any
  @Input() stock: any = 0

  constructor() {}
  async ngOnInit() {
    await this.tiendaSeleccionada

    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((event) => {})
    this.initMap()
  }
  ngOnChange() {
    window.dispatchEvent(new Event('resize'))
  }

  private initMap(): void {
    window.dispatchEvent(new Event('resize'))
    const accessToken =
      'pk.eyJ1Ijoic3VwZXJzYngwMCIsImEiOiJjaWpsZ3FsN3QwMDIydGhtNTh4aGhubG5xIn0.i2J0k0mBZhIi7W-bsPTJiQ'
    const map = L.map('map').setView([51.505, -0.09], 13)

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
        accessToken,
      {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken,
      },
    ).addTo(map)

    this.map = map
    this.getpointer()
  }

  getpointer() {
    const array: any = []
    const jsonFeatures: any = []
    array.push(this.tiendaSeleccionada)

    for (let i = 0; i < array.length; i++) {
      const item: any = array[i]

      const lat = item.lat
      const lon = item.lon

      const feature = {
        type: 'Feature',
        properties: item,
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
      }

      jsonFeatures.push(feature)
    }

    const geoJson = { type: 'FeatureCollection', features: jsonFeatures }

    this.Layer = L.geoJson(geoJson)

    this.map.addLayer(this.Layer)
    this.map.fitBounds(this.Layer.getBounds())

    this.Layer.on('click', (e: any) => {})
  }

  onMapClick(e: any) {
    this.popup
      .setContent('You clicked the map at ' + e.latlng.toString())
      .openOn(this.map)
  }
}
