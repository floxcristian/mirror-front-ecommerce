import { IUserEssentials, IUserOptionals } from './login-response.interface';

type ISessionEssentials = {
  login_temp: boolean;
  ultimoCierre?: moment.Moment;
};

export type ISession = IUserEssentials &
  Partial<IUserOptionals> &
  ISessionEssentials;
