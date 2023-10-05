export interface GraficoVentaValorada {
  _id: {
    anio: number
    mes: number
  }
  total: {
    $numberDecimal: number
  }
}
