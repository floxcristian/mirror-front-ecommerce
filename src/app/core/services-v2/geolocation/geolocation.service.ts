// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Models
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IStore } from './models/store.interface';
// Services
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
import { GeolocationApiService } from './geolocation-api.service';

@Injectable({
  providedIn: 'root',
})
export class GeolocationServiceV2 {
  private selectedStoreSubject: Subject<ISelectedStore> = new Subject();
  readonly selectedStore$: Observable<ISelectedStore> =
    this.selectedStoreSubject.asObservable();

  // Necesito que sea `BehaviorSubject` para poder obtener el valor actual, ya que este mantiene el último valor emitido.
  private storesSubject: BehaviorSubject<IStore[]> = new BehaviorSubject<
    IStore[]
  >([]);
  readonly stores$: Observable<IStore[]> = this.storesSubject.asObservable();

  // FIXME: quitar dependencia de esta variable.
  geolocation!: ISelectedStore;

  constructor(
    private readonly geolocationApiService: GeolocationApiService,
    private readonly geolocationStorage: GeolocationStorageService
  ) {}

  /**
   * Establecer tienda.
   * @param params
   */
  setSelectedStore(params: {
    zone: string;
    code: string;
    city: string;
  }): void {
    const { zone, code, city } = params;
    this.geolocation = {
      zone,
      code,
      city,
      isChangeToNearestStore: false,
      isSelectedByClient: true,
    };
    this.geolocationStorage.set(this.geolocation);
    console.log('[selectedStoreSubject.next] desde [setSelectedStore].');
    this.selectedStoreSubject.next(this.geolocation);
  }

  /**
   * Obtener tienda seleccionada.
   * @returns
   */
  getSelectedStore(): ISelectedStore {
    //console.log('[getSelectedStore]');
    let geolocation = this.geolocationStorage.get();
    console.log('--geolocation');
    if (geolocation) {
      console.log('--1');
      this.geolocation = geolocation;
      return this.geolocation; //.tiendaSelecciona;
    } else {
      console.log('setDefaultLocation desde getSelectedStore');
      geolocation = this.setDefaultLocation();
      console.log('--2: ', geolocation);
      return geolocation; //.tiendaSelecciona;
    }
  }

  /**
   * Establecer tienda por defecto.
   * En storage y variable global (se debe quitar esta última).
   * @returns
   */
  setDefaultLocation(): ISelectedStore {
    console.log('setDefaultLocation...');
    const stores = this.storesSubject.value;
    const defaultStore = stores.find((store) => store.default);
    // FIXME: corregir el tipo...
    if (defaultStore) {
      this.geolocation = {
        isChangeToNearestStore: false,
        isSelectedByClient: false,
        zone: defaultStore.zone,
        code: defaultStore.code,
        city: defaultStore.city,
      };
    } else {
      const firstLocation = stores[0];
      console.log('firstLocation: ', firstLocation);
      this.geolocation = {
        isChangeToNearestStore: false,
        isSelectedByClient: false,
        zone: firstLocation.zone,
        code: firstLocation.code,
        city: firstLocation.city,
      };
    }

    this.geolocationStorage.set(this.geolocation);
    return this.geolocation;
  }

  /**
   * Se llama solo una vez en el app.component.
   */
  initGeolocation(): void {
    console.log('initGeolocation...');
    this.geolocationApiService.getStores().subscribe({
      next: (stores) => {
        this.storesSubject.next(stores);
        let geolocation = this.geolocationStorage.get();

        // FIXME: esto debe ir después de intentar setear la tienda más cercana.

        if (!geolocation) {
          console.log('setDefaultLocation desde initGeolocation...');
          geolocation = this.setDefaultLocation();
        }
        // Si el navegador soporta geolocalización automática y la tienda no fue seleccionada por el cliente.
        if (navigator.geolocation && !geolocation.isSelectedByClient) {
          this.setNearestStore();
        } else {
          console.log('[selectedStoreSubject.next] desde [initGeolocation].');
          this.selectedStoreSubject.next(this.geolocation);
        }
      },
    });
    /*
    let geolocation = this.geolocationStorage.get();
    if (geolocation) {
      this.geolocation = geolocation;
    } else {
      geolocation = this.setDefaultLocation();
    }*/
  }

  secondCallbackTimer!: ReturnType<typeof setTimeout>;

  /**
   * Establecer tienda más cercana.
   */
  private setNearestStore(): void {
    let isFirstCallback = true;
    console.log('[setNearestStore]===================');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (isFirstCallback) {
          isFirstCallback = false;
          const hasSecondCallback = await this.hasSecondCallback();
          if (hasSecondCallback) return;
        } else {
          clearTimeout(this.secondCallbackTimer);
        }

        const { latitude, longitude } = coords;
        this.geolocationApiService
          .getNearestStore(latitude, longitude)
          .subscribe({
            next: (res) => {
              this.geolocation = {
                isSelectedByClient: false,
                isChangeToNearestStore: this.geolocation.code !== res.code,
                zone: res.zone,
                code: res.code,
                city: res.city,
              };
              this.geolocationStorage.set(this.geolocation);
              console.log(
                '[selectedStoreSubject.next] desde [setNearestStore].'
              );
              this.selectedStoreSubject.next(this.geolocation);
            },
            error: () => {
              console.warn(
                'No se ha podido establecer la tienda más cercana.'
              );
              console.log(
                '[selectedStoreSubject.next] desde [setNearestStore(error)].'
              );
              this.selectedStoreSubject.next(this.geolocation);
            },
          });
      },
      async (err) => {
        console.log('err============================');
        if (isFirstCallback) {
          isFirstCallback = false;
          const hasSecondCallback = await this.hasSecondCallback();
          if (hasSecondCallback) return;
        } else {
          clearTimeout(this.secondCallbackTimer);
        }
        console.error(err);
        console.log(
          '[selectedStoreSubject.next] desde [setNearestStore(failed)].'
        );
        this.selectedStoreSubject.next(this.geolocation);
      }
    );
  }

  /**
   * Espera un segundo callback para el `navigator.geolocation.getCurrentPosition`.
   * @returns
   */
  private hasSecondCallback(): Promise<boolean> {
    const timeout = 500;
    return new Promise(async (resolve) => {
      this.secondCallbackTimer = setTimeout(() => resolve(false), timeout);
      await new Promise(async (innerResolve) => {
        setTimeout(() => innerResolve(null), timeout);
      });
      resolve(true);
    });
  }
}
