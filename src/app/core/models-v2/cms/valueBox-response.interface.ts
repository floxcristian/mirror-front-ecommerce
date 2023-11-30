export interface IValueBoxResponse {
  data: IValueBox[];
}

export interface IValueBox {
  image: string;
  title: string;
  subtext1: string;
  subtext2: string;
  active: boolean;
  url: string;
  order: number;
}
