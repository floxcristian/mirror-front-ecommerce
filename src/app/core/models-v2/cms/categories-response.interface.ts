export interface ICategorieResponse {
  data: IChildren[];
}
export interface IChildren {
  title: string;
  id: number;
  products: number;
  url: string;
  children: IChildren[];
}
