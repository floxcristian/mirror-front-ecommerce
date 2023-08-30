export interface BuscadorB2B {
  indicadores: Indicadores | null;
  collapsed?: boolean | null;
  vinBuscado?: string | null;
}

export interface Indicadores {
  dia: string;
  dolar?: IndicadorEconomico;
  uf?: IndicadorEconomico;
  utm?: IndicadorEconomico;
}

export interface IndicadorEconomico {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  serie: Serie[];
}

export interface Serie {
  fecha: string;
  valor: number;
}
