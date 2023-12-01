export interface ILoginResponse {
  user: IUserResponse;
  token: ITokenResponse;
}

export type IUserResponse = IUserEssentials & IUserOptionals;

export interface ICreditLine {
  enabled: boolean;
  requiresConfirmation: boolean;
  fromAmount: number;
  toAmount: number;
}

export interface IPreferences {
  iva: boolean;
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type IUserRole =
  | 'superadmin'
  | 'supervisor'
  | 'comprador'
  | 'cms'
  | 'compradorb2c'
  | 'temp';

export interface IUserEssentials {
  documentId: string;
  email: string;
  userRole: IUserRole;
  preferences: IPreferences;
}

export interface IUserOptionals {
  username: string;
  password: string;
  userType: number;
  active: boolean;
  firstName: string;
  lastName: string;
  company: string;
  segment: string;
  businessLine: string;
  city: string;
  avatar: string;
  country: string;
  b2bRequestStatus: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  companies?: string[];
  creditLine: ICreditLine;
}
