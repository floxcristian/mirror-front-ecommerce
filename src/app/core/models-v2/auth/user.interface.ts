export interface IEcommerceUser {
  username?: string;
  userType?: number;
  active: boolean;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  segment?: string;
  businessLine?: string;
  city?: string;
  documentId: string;
  avatar: string;
  country: string;
  b2bRequestStatus?: string;
  phone: string;
  userRole: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  companies?: string[];
  creditLine?: IEcommerceUserCreditLine;
  preferences?: IEcommerceUserPreferences;
  loginTemp: boolean;
}

export interface IEcommerceUserPreferences {
  iva: boolean;
}

export interface IEcommerceUserCreditLine {
  enabled: boolean;
  requiresConfirmation: boolean;
  fromAmount: number;
  toAmount: number;
}
