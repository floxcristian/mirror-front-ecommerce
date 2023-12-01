import { IArticle } from './special-reponse.interface';
export interface ICustomHomePage {
  data: IData[];
}
export interface IData {
  title: string;
  articles: IArticle[];
}
