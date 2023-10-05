export interface ProductFilterBase {
  name: string
}

export interface ProductFilterCategory extends ProductFilterBase {
  type: 'categories'
  collapsed?: boolean
  options: {
    items?: {
      type: 'parent' | 'current' | 'child'
      count: number
      name: string
      url?: any
      queryParams: any
      children: any
      checked?: boolean
    }[]
  }
}

export interface ProductFilterPrice extends ProductFilterBase {
  type: 'price'
  collapsed?: boolean
  options: {
    min: number
    max: number
    from: number
    to: number
  }
}

export interface ProductFilterCheckbox extends ProductFilterBase {
  type: 'checkbox'
  collapsed?: boolean
  options: {
    items: {
      label: string
      count: number
      checked: boolean
      disabled: boolean
    }[]
  }
}

export interface ProductFilterCheckboxFlota extends ProductFilterBase {
  type: 'checkboxFlota'
  collapsed?: boolean
  options: {
    items: {
      label: string
      chassis: string
      tipo: string
      count: number
      checked: boolean
      disabled: boolean
    }[]
  }
}

export interface ProductFilterRadio extends ProductFilterBase {
  type: 'radio'
  collapsed?: boolean
  options: {
    name: string
    items: {
      label: string
      count: number
      checked: boolean
      disabled: boolean
    }[]
  }
}

export interface ProductFilterColor extends ProductFilterBase {
  type: 'color'
  collapsed?: boolean
  options: {
    items: {
      label: string
      count: number
      color: string
      checked: boolean
      disabled: boolean
      white: boolean
      light: boolean
    }[]
  }
}

export type ProductFilter =
  | ProductFilterCategory
  | ProductFilterPrice
  | ProductFilterCheckbox
  | ProductFilterCheckboxFlota
  | ProductFilterRadio
  | ProductFilterColor
