import {
  IUserEssentials,
  IUserOptionals,
} from '../../services-v2/auth/models/login-response.interface';

type ISessionEssentials = {
  login_temp: boolean;
  ultimoCierre?: moment.Moment;
};

export type ISession = IUserEssentials &
  Partial<IUserOptionals> &
  ISessionEssentials;
