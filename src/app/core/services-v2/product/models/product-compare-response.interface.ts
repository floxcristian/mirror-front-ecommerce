import { IArticleResponse } from '@core/models-v2/article/article-response.interface';

export type IProductCompare = Omit<
  IArticleResponse,
  'deliverySupply' | 'lineBoss' | 'url'
>;

export interface IProductCompareResponse {
  comparison: IComparison[];
  articles: IProductCompare[];
}

export interface IComparison {
  [key: string]: IComparisonItem[];
}

export interface IComparisonItem {
  sku: string;
  value: string;
}
