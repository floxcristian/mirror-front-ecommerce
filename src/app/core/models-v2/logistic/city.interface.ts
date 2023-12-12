export interface ICity {
  id: string;
  city: string;
  localities: ILocation[];
  provinceCode: string;
  regionCode: string;
}

export interface ILocation {
  id: string;
  initials: string;
  location: string;
}
