export interface IConfig {
  country: string;
  document: IDocument;
  phone: {
    codes: string[];
  };
  storesPage: IStoresPage;
}

export interface IStoresPage {
  title: string;
  subtitle: string;
}

export interface IDocument {
  name: string;
  sample: string;
}
