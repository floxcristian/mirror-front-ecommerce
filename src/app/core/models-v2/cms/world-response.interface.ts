export interface IWorldResponse {
  data: Iworld[];
}

export interface Iworld {
  active: boolean;
  url: string;
  title: string;
  description: string;
  alt: string;
  target: string;
  order: number;
  imageTablet: string;
  imageMobile: string;
  imageOverlay: string;
  styleColor: IStyleColor;
  createdAt: string;
  updatedAt: string;
}
export interface IStyleColor {
  backgroundColor: string;
}
