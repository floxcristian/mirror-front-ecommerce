import { IPaymentButton } from '@core/config/config.interface';

export type IFormattedPaymentButton = IPaymentButton & { selected: boolean };
