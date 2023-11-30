export interface ISliderResponse {
  data: ISlider[];
}
export interface ISlider {
  order: number;
  title: string;
  text: string;
  alt: string;
  imageClassic: string;
  imageFull: string;
  imageTablet: string;
  imageMobile: string;
  buttonUrl: string;
  separator: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
