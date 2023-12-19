export interface IProductsFromFileResponse {
  notFound: IProductFromFile[];
  registered: IRegisteredProductFromFile[];
}

export interface IProductFromFile {
  line: number;
  message: string;
  sku: string;
}

export type IRegisteredProductFromFile = IProductFromFile & {
  name: string;
  preview: string;
};
