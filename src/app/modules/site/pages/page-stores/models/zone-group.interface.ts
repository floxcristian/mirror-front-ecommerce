import { IStore } from '@core/services-v2/geolocation/models/store.interface';

export interface IZoneGroup {
  title: string;
  stores: IStore[];
}
