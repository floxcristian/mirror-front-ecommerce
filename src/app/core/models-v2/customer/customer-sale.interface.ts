export interface ISalesMonthResponse {
  data: ISalesMonth[];
}

export interface ISalesMonth {
  year: number;
  month: number;
  total: number;
}

export interface ISalesBySbuResponse {
  data: ISalesBySbu[];
}

export interface ISalesBySbu {
  name: string;
  total: number;
  skus: number;
}

export interface IDebtSales {
  dueCustomerSales: any[];
  overdueCustomerSales: any[];
  totalDueAmount: number;
  totalOverdueAmount: number;
}
