export interface ILogisticPromiseRequest {
  location: string;
  regionCode: string;
  articles: ILogisticProduct[];
}

export interface ILogisticProduct {
  sku: string;
  quantity: number;
}
