// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { IZoneGroup } from '../models/zone-group.interface';
// Constants
import { ZONE_ORDER } from '../constants/zones';

export class StoreUtilService {
  /**
   * Formatear zona como key para un objeto.
   * @param zone
   * @returns
   */
  static formatZoneKey = (zone: string) =>
    zone.toLowerCase().replace(/\s+/g, '-');
  /**
   * Agrupar tiendas por zona.
   * @param stores
   * @returns
   */
  private static groupStoresByZone(
    stores: IStore[]
  ): Record<string, IZoneGroup> {
    return stores.reduce((acc: Record<string, IZoneGroup>, store) => {
      const zoneKey = StoreUtilService.formatZoneKey(store.zoneGroup);
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

  /**
   * Obtener tiendas ordenadas por zona.
   * @param groupedStores
   * @returns
   */
  static getOrderedStoresByZone(stores: IStore[]): IZoneGroup[] {
    const groupedStores = StoreUtilService.groupStoresByZone(stores);
    console.log('[-] groupedStores: ', groupedStores);
    return ZONE_ORDER.filter((zone) =>
      StoreUtilService.formatZoneKey(zone)
    ).map((zone) => ({
      title: zone,
      stores: groupedStores[StoreUtilService.formatZoneKey(zone)].stores,
    }));
  }

  /**
   * Formatear coordenandas a formato de punto decimal.
   * @param lat
   * @param lng
   * @returns
   */
  static formatCoordinates(
    lat: number,
    lng: number
  ): { lat: number; lng: number } {
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
