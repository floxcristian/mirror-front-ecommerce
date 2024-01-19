export interface IConfig {
  country: string;
  url: string;
  document: IDocument;
  phoneCodes: IPhoneCodes;
  storesPage: IStoresPage;
  salesDebtPage: ISalesDebtPage;
  company: ICompany;
}

export interface ICompany {
  phone: string;
  formattedPhone: string;
  whatsapp: string;
  formattedWhatsapp: string;
  address: string;
  email: string;
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

export interface ISalesDebtPage {
  paymentButtons: IPaymentButton[];
}

export interface IPaymentButton {
  id: string;
  title: string;
  image: string;
}

export interface IDocument {
  name: string;
  sample: string;
}
