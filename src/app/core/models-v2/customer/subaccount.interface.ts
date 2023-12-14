import { IEcommerceUser } from '../auth/user.interface';

export interface UploadSubAccountResult {
  duplicated: UploadSubAccountResultDetail[];
  registered: UploadSubAccountResultDetail[];
}

export interface UploadSubAccountResultDetail {
  line: number;
  message: string;
  user: IEcommerceUser;
}
