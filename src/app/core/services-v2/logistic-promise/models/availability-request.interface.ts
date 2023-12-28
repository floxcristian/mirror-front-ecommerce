import { IProductRequest } from './product-request.interface';

export interface IAvailabilityRequest {
  location: string;
  regionCode: string;
  articles: IProductRequest[];
}
