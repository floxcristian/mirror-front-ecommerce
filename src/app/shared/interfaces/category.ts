export interface Category {
    title: string;
    url: any;
    id?: string;
    products?: number;
    image?:string;
    subcategories?: Category[];
}

