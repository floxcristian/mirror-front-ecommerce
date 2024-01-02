export interface IConfig {
  country: string;
  document: IDocument;
  phoneCodes: IPhoneCodes;
  storesPage: IStoresPage;
}

export interface IPhoneCodes {
  mobile: IPhoneItem;
  landline: IPhoneItem;
}

export interface IPhoneItem {
  code: string;
  lengthRule: number;
}

export interface IStoresPage {
  title: string;
  subtitle: string;
}

export interface IDocument {
  name: string;
  sample: string;
}
