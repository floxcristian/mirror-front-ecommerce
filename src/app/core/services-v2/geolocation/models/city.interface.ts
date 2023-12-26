export interface ICity {
  id: string;
  city: string;
  provinceCode: string;
  regionCode: string;
  localities: ILocality[];
}

export interface ILocality {
  id: string;
  initials: string;
  location: string;
}
