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
import { tap, map, switchMap } from 'rxjs/operators';
//import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable, of } from 'rxjs';
import { MapsAPILoader, MouseEvent } from '@agm/core';
declare var google: any;

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
  @Input() tienda!: DireccionMap;
  @Input() autocompletado!: boolean;
  @Input() infoWindowContent!: string;
  @ViewChild('search', { static: true }) public searchElementRef!: ElementRef;

  lat: number = 0;
  lng: number = 0;
  zoom: number = 15;
  showSearchBar: boolean = true;
  geocoder: any;
  @Output() public geolocalizacion = new EventEmitter<any>();
  @Output() public clearAdress = new EventEmitter<any>();
  @Output() public setDireccion = new EventEmitter<any>();

  constructor(
    private mapLoader: MapsAPILoader,
    private ref: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this.autocompletado === true) {
      this.showSearchBar = false;

      this.zoom = 3;
      this.lat = -36.79975467819392;
      this.lng = -71.49897587245773;

      this.mapsAPILoader.load().then(() => {
        //this.setCurrentLocation();

        this.geocoder = new google.maps.Geocoder();
        let autocomplete = new google.maps.places.Autocomplete(
          this.searchElementRef.nativeElement,
          {
            types: ['address'],
            componentRestrictions: { country: 'cl' },
          }
        );

        autocomplete.setFields(['address_component', 'geometry']);

        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.setDireccion.emit([
              place.address_components,
              place.geometry.location,
            ]);
            //set latitude, longitude and zoom
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 17;
          });
        });
      });
    }
  }
  async ngOnChanges() {
    if (this.tienda && this.tienda.direccion != '') {
      this.geocodeAddress(
        `${this.tienda.direccion} ${this.tienda.zona}`
      ).subscribe((location) => {
        this.searchElementRef.nativeElement.value = this.tienda.direccion;
        this.lat = Number(this.tienda.lat);
        this.lng = Number(this.tienda.lon);
        this.geolocalizacion.emit({ lat: this.lat, lng: this.lng });
      });
    }
  }

  geocodeAddress(location: string): Observable<any> {
    return this.waitForMapsToLoad().pipe(
      switchMap(() => {
        return new Observable((observer) => {
          this.geocoder.geocode(
            { address: location },
            (results: any, status: any) => {
              if (status == google.maps.GeocoderStatus.OK) {
                observer.next({
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                });
              } else {
                observer.next({ lat: 0, lng: 0 });
              }
              observer.complete();
            }
          );
        });
      })
    );
  }

  private initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return fromPromise(this.mapLoader.load()).pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  markerDragEnd($event: MouseEvent) {
    if (this.autocompletado === true) {
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
      this.getAddress(this.lat, this.lng);
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.setDireccion.emit([
              results[0].address_components,
              { lat: latitude, lng: longitude },
            ]);
            this.zoom = 17;
            this.searchElementRef.nativeElement.value =
              results[0].formatted_address;
          } else {
            window.alert('No se han encontrado resultados.');
          }
        } else {
          console.log('Geocoder error: ' + status);
        }
      }
    );
  }

  clearSearch() {
    this.searchElementRef.nativeElement.value = '';
    this.clearAdress.emit();
  }
}
