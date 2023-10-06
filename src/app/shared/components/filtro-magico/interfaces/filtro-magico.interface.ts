import { Observable } from 'rxjs';

export interface FiltrosMagicos {
  /**
   * Filtros a aplicar
   */
  filtros: FiltroMagico[];
  /**
   * Mostrar Botón filtrar?
   */
  mostrarBotonFiltrar?: boolean;
}

export interface FiltroMagico {
  /**
   * Identificador único del filtro (Solo dentro del componente)
   */
  key: string;
  /**
   * Nombre (label) del Filtro
   */
  nombre: string;
  /**
   * Atributo 'class' a asignar al contenedor <div></div>
   */
  class?: string;
  /**
   * Tipo de Filtro
   */
  tipo:
    | 'select'
    | 'select-multiple'
    | 'select-search-multiple'
    | 'producto'
    | 'producto-multiple'
    | 'dropdown-input'
    | 'dropdown-select-multiple'
    | 'rango-fechas';
  /**
   * Mostrar Label?
   */
  mostrarLabel?: boolean;
  /**
   * Lista de valores, puede ser de un observable u arreglo, si o si traerá.
   * Solo necesario si tipo es de tipo 'select', 'select-multiple'
   */
  valoresSelect?: Observable<any> | Promise<any> | Array<any>;
  /**
   * Solo si es 'select-search-multiple'
   */
  valoresSelectSearch?: (search: string) => Observable<any>;
  /**
   * Solo si es de tipo 'select', 'select-multiple', 'select-search-multiple'
   */
  opcionSelect?: (valor: any) => string;
  /**
   * Solo si es de tipo 'select-multiple'
   * Atributo a agrupar en el select
   */
  groupBy?: string;
  /**
   * Solo si es 'select-search-multiple', indica con qué atributo se realizará la comparación interna
   */
  valoresSelectSearchKey?: string;
  /**
   * Valor por defecto a aplicar en el select o input.
   * ==> NOTA: Por ahora solo funciona con select, ejemplo:
   * { key: 'codigo', params: ['EST CENTRAL'] }
   * Suponga que el select de tiendas es: [{codigo: 'ARICA', nombre: 'ARICA'}, {codigo: 'EST CENTRAL', nombre: 'ESTACION CENTRAL'}]
   * como 'key' es 'codigo' entonces los 'params' serán filtrados de acuerdo al atributo 'codigo' del arreglo.
   * Luego se filtrarán solo los que tengan el 'codigo' presente en 'params'.
   * Finalmente, si es select único se dejará el primero y si es múltiple, se dejarán todos.
   */
  valorDefecto?: () => { key?: string; params: string[] } | any;

  /**
   * Lista de valores, puede ser de un observable u arreglo, si o si traerá.
   * Solo necesario si tipo es 'dropdown-input' o 'dropdown-select
   */
  valoresDropdown?: Observable<any> | Array<any> | any;
  /**
   * Índice por defecto del dropdown
   */
  defectoDropdown?: number;
  /**
   * Solo si se estableció valoresDropdown
   */
  opcionDropdown?: (valor: any) => string;
  /**
   * Width del dropdown, por defecto son 100px, solo si el tipo incluye un dropdown
   */
  widthDropdown?: string;

  /**
   * Solo si es de tipo 'dropdown-input'
   */
  tipoInput?: string;

  /**
   * Hooks del filtro mágico
   */
  hooks?: FiltroMagicoHooks;
}

export interface FiltroMagicoHooks {
  /**
   * Solo válido para 'select-search-multiple'
   * Se ejecuta cada vez que se busca un valor en el input.
   */
  onRespuestaBusqueda?: (search: string, response: any) => void;
}
