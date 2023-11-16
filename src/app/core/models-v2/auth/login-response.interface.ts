export interface ILoginResponse {
  user: IUser;
  token: IToken;
}

export interface IUser {
  username: string;
  password: string;
  userType: number;
  active: boolean;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  segment: string;
  businessLine: string;
  city: string;
  documentId: string;
  avatar: string;
  country: string;
  b2bRequestStatus: string;
  phone: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  companies?: string[];
  creditLine: ICreditLine;
  preferences: IPreferences;
}

export interface ICreditLine {
  enabled: boolean;
  requiresConfirmation: boolean;
  fromAmount: number;
  toAmount: number;
}

export interface IPreferences {
  iva: boolean;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}
