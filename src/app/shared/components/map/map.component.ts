// Angular
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { GoogleMap, MapGeocoder } from '@angular/google-maps';
// Env
import { environment } from '@env/environment';
import { IMapStore } from './map-store.interface';
import { ScriptService } from '@core/utils-v2/script/script.service';

export interface DireccionMap {
  direccion: string;
  zona: string;
  lat?: string;
  lon?: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() titulo!: string;
  @Input() storeAddress!: string;
  @Input() storeZone!: string;
  @Input() autocompletado!: boolean;
  @Input() infoWindowContent!: string;
  @ViewChild('search', { static: true }) searchElementRef!: ElementRef;

  showSearchBar: boolean = true;
  markerPositions: google.maps.LatLngLiteral[] = [];
  options: google.maps.MapOptions = {
    disableDefaultUI: false,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;

  var_hybrid = google.maps.MapTypeId.HYBRID;
  var_roadmap = google.maps.MapTypeId.ROADMAP;
  @Output() public geolocalizacion = new EventEmitter<any>();
  @Output() public clearAdress = new EventEmitter<any>();
  @Output() public setDireccion = new EventEmitter<any>();
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  autocomplete!: google.maps.places.Autocomplete;
  isMapLoaded!: boolean;

  constructor(
    private ngZone: NgZone,
    private geocoder: MapGeocoder,
    private readonly scriptService: ScriptService
  ) {}

  ngOnInit() {
    this.scriptService.loadScript(environment.gmapScript).then(() => {
      this.buildMap();
      this.isMapLoaded = true;
    });
  }

  private buildMap(): void {
    if (this.autocompletado === true) {
      this.options.disableDefaultUI = true;
      this.markerOptions.draggable = true;
      this.showSearchBar = false;
      this.zoom = 3;
      this.center.lat = -36.79975467819392;
      this.center.lng = -71.49897587245773;
      this.map?.panTo(this.center);
      this.markerPositions = [];
      this.markerPositions.push({
        lat: -36.79975467819392,
        lng: -71.49897587245773,
      });

      const country = environment.country;
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address'],
          componentRestrictions: { country: country },
        }
      );
      this.autocomplete.setFields(['address_component', 'geometry']);
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult =
            this.autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) return;
          this.setDireccion.emit([
            place.address_components,
            place.geometry.location,
          ]);
          let center = {
            lat: place.geometry.location?.lat() || 0,
            lng: place.geometry.location?.lng() || 0,
          };
          this.zoom = 17;
          this.center = center;
          this.map.panTo(center);
          this.markerPositions = [];
          this.markerPositions.push(center);
        });
      });
    }
  }

  ngOnChanges(): void {
    if (this.storeAddress) {
      this.geocoder
        .geocode({
          address: `${this.storeAddress} ${this.storeZone}`,
        })
        .subscribe((location) => {
          this.searchElementRef.nativeElement.value = this.storeAddress;
          if (location.status === 'OK') {
            this.markerPositions = [];
            let center: google.maps.LatLngLiteral = {
              lat: location.results[0].geometry.location.lat(),
              lng: location.results[0].geometry.location.lng(),
            };
            this.center = center;
            this.map.panTo(center);
            this.markerPositions.push(center);
            this.geolocalizacion.emit({
              lat: location.results[0].geometry.location.lat(),
              lng: location.results[0].geometry.location.lng(),
            });
          } else {
            this.markerPositions = [];
            this.geolocalizacion.emit({ lat: 0, lng: 0 });
          }
        });
    }
  }

  markerDragEnd($event: google.maps.MapMouseEvent): void {
    if (this.autocompletado === true) {
      this.zoom = 17;
      let center: google.maps.LatLngLiteral = {
        lat: $event.latLng?.lat() || 0,
        lng: $event.latLng?.lng() || 0,
      };
      this.center = center;
      this.map.panTo(center);
      this.getAddress();
    }
  }

  getAddress(): void {
    this.geocoder.geocode({ location: this.center }).subscribe((location) => {
      if (location.status === 'OK') {
        if (location.results[0]) {
          this.setDireccion.emit([
            location.results[0].address_components,
            { lat: this.center.lat, lng: this.center.lng },
          ]);
          this.zoom = 17;
          this.searchElementRef.nativeElement.value =
            location.results[0].formatted_address;
        } else {
          window.alert('No se han encontrado resultados.');
        }
      } else {
        console.log('Geocoder error: ' + status);
      }
    });
  }

  clearSearch(): void {
    this.searchElementRef.nativeElement.value = '';
    this.clearAdress.emit();
  }
}
