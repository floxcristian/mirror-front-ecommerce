export interface ICatalogsResponse {
    data: ICatalog[]
  }
  
export interface ICatalogResponse {
    data: ICatalog
}
  export interface ICatalog {
    _id: string
    body: IBody[]
    skus: string[]
    fileProducts: IFileProduct[]
    fileCategories: IFileCategory[]
    fileSbus: IFileBus[]
    name: string
    author: string
    expirationDate: string
    activationDate: string
    distribution: string
    catalogType: string
    targetText: string
    status: string
    frontPageUrl: string
    dynamic: boolean
    modified: boolean
    customerDocumentId: string
    netPrice: boolean
    generic: boolean
    proposalNumber: number
    licensePlate: string
    createdAt: string
    updatedAt: string
  }
  
  export interface IBody {
    id: string
    class?: string
    frontPageUrl?: string
    banner: any
    editableTitle?: string
    header?: string
    footer?: string
    products?: IProductCatalog[]
    content?: any[] //nunca trae algo
    leftSide?: ILeftSide[]
    rightSide?: IRightSide[]
    leftTitle?: string
    rightTitle?: string
    tag?: string
  }
  
  export interface IProductCatalog {
    id: number
    category: string
    sbu: string
    type: string
    product: string
    name: string
    attributes: IAttribute[]
    date: number
    disabled: boolean
    precio: number
    scalePrice: IScalePrice[]
    selected: boolean
    sku: string
  }
  
  export interface IAttribute {
    name: string
    value: string | number | any[]
    order: number
  }
  
  export interface IScalePrice {
    desde: string
    hasta: string
    precio: number
  }
  
  export interface ILeftSide {
    id: string
    type: string
    size: number
    products: IProduct3[]
  }

  export interface IRightSide {
    id: string
    type: string
    size: number
    products: IProduct3[]
  }

  export interface IFileProduct {
    id: number
    category: string
    sbu: string
    type: string
    product: string
    name: string
    attributes: IAttribute[]
    date?: number
    disabled?: boolean
    precio?: number
    scalePrice?: IScalePrice[]
    selected?: boolean
    images?: string[][] | number[][] // en duda
  }

  export interface IFileCategory {
    sbu: string
    category: string
    line: string
    filters: string[]
    products: IProduct2[]
  }
  
  export interface IProduct2 {
    sku: string
    category: string
    estado: string
    line: string
    brand?: string
    name: string
    sbu: string
    description?: string
    filters: IFilter[]
    image: boolean
    stock: number
  }
  
  export interface IFilter {
    name: string
    value: string | number | any[]
    order: number
  }
  
  export interface IFileBus {
    sbu: string
    category: string
    line: string
    filters: string[]
    products: IProduct2[]
  }

  export interface IProduct2 {
    sku: string
    category: string
    estado: string
    line: string
    brand?: string
    name: string
    sbu: string
    description?: string
    filters: IFilter[]
    image: boolean
    stock: number
  }

  export interface IProduct3 {
    name: string
    url:string
    type:string
    thumbnails:string
    _id:string
    createdAt:string
    updatedAt:string
    __v:number
    date:number
    disabled:boolean
  }
