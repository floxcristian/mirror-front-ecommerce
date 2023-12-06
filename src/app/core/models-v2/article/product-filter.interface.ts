export interface IProductFilterBase {
  name: string;
}

export interface IProductFilterCategory extends IProductFilterBase {
  type: 'categories';
  collapsed?: boolean;
  options: {
    items?: {
      type: 'parent' | 'current' | 'child';
      count: number;
      name: string;
      url?: string[];
      open?: boolean;
      queryParams: any;
      // checked?: any;
      children?: IChildren;
    }[];
  };
}

export interface IChildren {
  url: string[];
  type: 'parent' | 'current' | 'child';
  open?: boolean;
  queryParams: any;
  name: string;
  coutn: number;
  children?: IChildren[];
}

export interface IProductFilterPrice extends IProductFilterBase {
  type: 'price';
  collapsed?: boolean;
  options: {
    min: number;
    max: number;
    from: number;
    to: number;
  };
}

export interface IProductFilterCheckbox extends IProductFilterBase {
  type: 'checkbox';
  collapsed?: boolean;
  name: string;
  options: {
    items: {
      label: string;
      count: number;
      checked: boolean;
      disabled: boolean;
    }[];
  };
}

export interface IProductFilterCheckboxFlota extends IProductFilterBase {
  type: 'checkboxFlota';
  collapsed?: boolean;
  options: {
    items: {
      label: string;
      chassis: string;
      tipo: string;
      count: number;
      checked: boolean;
      disabled: boolean;
    }[];
  };
}

export interface IProductFilterRadio extends IProductFilterBase {
  type: 'radio';
  collapsed?: boolean;
  options: {
    name: string;
    items: {
      label: string;
      count: number;
      checked: boolean;
      disabled: boolean;
    }[];
  };
}

export interface IProductFilterColor extends IProductFilterBase {
  type: 'color';
  collapsed?: boolean;
  options: {
    items: {
      label: string;
      count: number;
      color: string;
      checked: boolean;
      disabled: boolean;
      white: boolean;
      light: boolean;
    }[];
  };
}

export type IProductFilter =
  | IProductFilterCategory
  | IProductFilterPrice
  | IProductFilterCheckbox
  | IProductFilterCheckboxFlota
  | IProductFilterRadio
  | IProductFilterColor;
