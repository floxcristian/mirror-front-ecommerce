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

export interface ICategoryDetail {
  url: string[];
  label: string;
  menu: IThirdLvl[];
}

export interface ISecondLvl {
  items: ISecondLvl2[];
}

export interface ISecondLvl2 {
  label: string;
  url: string[];
  items: IThirdLvl[];
}

export interface IThirdLvl {
  label: string;
  url: string[];
}
