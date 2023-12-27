export interface IDeliveryAvailabilityResponse {
  type: string;
  suppliedSkus: string[];
  unsuppliedSkus: string[];
  unsuppliedArticles: any[];
  candidateWarehouses: string[];
  selectedWarehouseStrategy: string[];
  warehouseVariety: IWarehouseVariety;
  warehouses: IWarehouse;
  subOrders: ISubOrder[];
}

export type IWarehouseVariety = Record<string, number>;
export type IWarehouse = Record<string, IWarehouseItem>;

export interface IWarehouseItem {
  carrierCalendarFriday: boolean;
  carrierCalendarMonday: boolean;
  carrierCalendarSaturday: boolean;
  carrierCalendarSunday: boolean;
  carrierCalendarThursday: boolean;
  carrierCalendarTuesday: boolean;
  carrierCalendarWednesday: boolean;
  carrierCode: string;
  carrierInternal: boolean;
  carrierName: string;
  dropshipmentCode: number;
  serviceTypeCode: string;
  serviceTypeName: string;
  stock: Record<string, number>;
  tripCutOffTime: string;
  tripLeadTimeDays: number;
  tripMinFeeCost: string;
  tripPriority: number;
  tripRangeType: string;
  warehouse: string;
  warehouseLeadTimeDays: number;
}

export interface ISubOrder {
  number: number;
  identifier: string;
  warehouse: string;
  dropshipmentType: IDropshipmentType;
  totalWeight: number;
  articles: ISubOrderProduct[];
  tripDates: ITripDate[];
}

export interface IDropshipmentType {
  code: number;
  description: string;
}

export interface ISubOrderProduct {
  sku: string;
  quantity: number;
}

export interface ITripDate {
  pickingDate: Date;
  requestedDate: Date;
  price: number;
  identifier: string;
  warehouse: string;
  businessDays: number;
  serviceType: {
    code: string;
    description: string;
  };
  carrier: {
    code: string;
    description: string;
    internal: boolean;
  };
  dropshipmentType: {
    code: number;
    description: string;
  };
  scheduleEnabled: boolean;
  scheduleReference: string;
}
