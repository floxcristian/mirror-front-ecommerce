export interface FiltroMagicoFilterParam {
    filterKey: string,
    key?: string, 
    params: (string | Date | any)[]
}

export interface FilterNewFilterParam {
    tag: string;
    internalTag: string;
    nuevosFiltros: FiltroMagicoFilterParam[]; // Filtros
    sender: any; // el que lo envía
}