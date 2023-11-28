import { IUserEssentials, IUserOptionals } from './login-response.interface';

type ISessionEssentials = {
  iva: boolean; // FIXME:..
  login_temp: boolean;
  ultimoCierre?: moment.Moment;
};

export type ISession = IUserEssentials &
  Partial<IUserOptionals> &
  ISessionEssentials;
