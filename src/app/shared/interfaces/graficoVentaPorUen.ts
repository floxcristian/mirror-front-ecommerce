export interface GraficoVentasPorUen {
  _id: string;
  total: {
    $numberDecimal: number;
  };
  totalMargen: {
    $numberDecimal: number;
  };
  skus: number;
}
