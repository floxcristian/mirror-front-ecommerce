import { Component, SimpleChanges, OnChanges } from '@angular/core';
// import { ProductsService } from '../../../../shared/services/products.service';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../../../shared/services/root.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { Data } from '../../../../shared/components/card-dashboard-no-chart/card-dashboard-no-chart.component';
import { GraficoVentaValorada } from '../../../../shared/interfaces/graficoVentaValorada';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { isVacio } from '../../../../shared/utils/utilidades';
import { GraficoVentasPorUen } from '../../../../shared/interfaces/graficoVentaPorUen';
// import { runInDebugContext } from 'vm';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent {
  // graficos
  chartHistorySale: any;
  usuario: Usuario;

  ventaMes: any;
  detalleVenta: any;

  miCredito!: Data[];
  misFacturas!: Data[];

  chartOptions = {
    cutoutPercentage: 30,
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
  };
  innerWidth: number;
  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1;

  ESTADO = { BUSCANDO: 1, OK: 2, NO_ENCONTRADO: 3, ERROR: 4 };
  lineEstado = this.ESTADO.BUSCANDO;
  lineChartData: ChartDataSets[] = [];
  lineChartLabels!: Label[];
  lineChartOptions: ChartOptions = {};

  barEstado = this.ESTADO.BUSCANDO;
  barChartData: ChartDataSets[] = [];
  barChartLabels!: Label[];
  barChartOptions: ChartOptions = {};

  constructor(
    // private productService: ProductsService,
    private clientService: ClientsService,
    private toastr: ToastrService,
    private root: RootService,
    private currency: CurrencyFormatPipe
  ) {
    this.innerWidth = window.innerWidth;

    this.usuario = this.root.getDataSesionUsuario();

    this.loadChart();
  }

  loadChart() {
    const rut = this.usuario.rut;

    this.clientService
      .graficoVentaValorada({
        rutCliente: rut,
        anio: this.anio,
      })
      .subscribe(
        (resp: any) => {
          const data: GraficoVentaValorada[] = resp.data;

          const ventaActual = data.find((m) => {
            return m._id.anio === this.anio && m._id.mes === this.mes;
          });

          const hoy = new Date();
          hoy.setMonth(hoy.getMonth() - 1);
          const anioAnterior = hoy.getFullYear();
          const mesAnterior = hoy.getMonth() + 1;
          const ventaAnterior = data.find(
            (m) => m._id.anio === anioAnterior && m._id.mes === mesAnterior
          );

          this.ventaMes = !isVacio(ventaActual)
            ? ventaActual?.total.$numberDecimal
            : 0;
          const ventaMesAnterior = !isVacio(ventaAnterior)
            ? ventaAnterior?.total.$numberDecimal
            : 0;

          const porcentaje = Math.round(
            ventaMesAnterior !== 0
              ? (this.ventaMes * 100) / (ventaMesAnterior || 0)
              : 0
          );

          this.detalleVenta = {
            text: 'Desde el mes pasado',
            value: porcentaje - 100,
            icon: porcentaje - 100 >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down',
            textClass: porcentaje - 100 >= 0 ? 'text-success' : 'text-danger',
          };

          this.lineChartLabels = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
          ];
          this.cargaDatosVentaValorada(data);
        },
        (error: any) => {
          console.log(error);
          this.lineEstado = this.ESTADO.ERROR;
        }
      );

    this.clientService
      .graficoVentasPorUen({ anio: this.anio, mes: this.mes, rutCliente: rut })
      .subscribe(
        (resp: any) => {
          console.log(resp.data);
          const data: GraficoVentasPorUen[] = resp.data;

          this.barChartLabels = data.map((r) => r._id);

          this.cargaDatosVentaPorUen(data);
        },
        (error: any) => {
          console.log(error);
          this.barEstado = this.ESTADO.ERROR;
        }
      );

    this.clientService.buscarSaldo(rut).subscribe(
      (r: any) => {
        const utilizado = r.utilizado;
        const asignado = r.credito;
        const pUtilizado =
          asignado !== 0 ? Math.round((utilizado * 100) / asignado) : 0;
        const pSaldo = pUtilizado !== 0 ? Math.round(100 - pUtilizado) : 0;

        this.miCredito = [
          {
            label: 'Asignado',
            valor: asignado,
          },
          {
            label: 'Utilizado',
            valor: utilizado,
            porcentaje: pUtilizado,
          },
          {
            label: 'Saldo',
            valor: asignado - utilizado,
            porcentaje: pSaldo,
          },
        ];
      },
      (error) => {
        console.log(error);
        this.toastr.error(
          'Error de comunicación para obtener pendientes de entrega'
        );
      }
    );

    this.clientService.buscarFacturas(rut).subscribe(
      (r: any) => {
        const porVencer = r.deudaPorVencer;
        const vencido = r.deudaVencida;
        const totalDeuda = r.deudaVencida + r.deudaPorVencer;
        const pVencido =
          totalDeuda !== 0 ? Math.round((vencido * 100) / totalDeuda) : 0;
        const pPorVencer = Math.round(100 - pVencido);

        this.misFacturas = [
          {
            label: 'Por Vencer',
            valor: porVencer,
            porcentaje: pPorVencer,
          },
          {
            label: 'Vencido',
            valor: vencido,
            porcentaje: pVencido,
          },
          {
            label: 'Total adeudado',
            valor: totalDeuda,
          },
        ];
      },
      (error) => {
        console.log(error);
        this.toastr.error(
          'Error de comunicación para obtener pendientes de entrega'
        );
      }
    );
  }

  cargaDatosVentaValorada(data: GraficoVentaValorada[]) {
    const anioConsultado = [];
    const anioAnterior = [];
    let max = 0;

    for (let i = 1; i < 13; i++) {
      const datoConsultado = data.find(
        (r) => r._id.anio === this.anio && r._id.mes === i
      );
      if (datoConsultado) {
        max =
          datoConsultado.total.$numberDecimal > max
            ? Math.trunc(datoConsultado.total.$numberDecimal)
            : max;
        anioConsultado.push(datoConsultado.total.$numberDecimal);
      } else {
        anioConsultado.push(null);
      }
      const datoAnterior = data.find(
        (r) => r._id.anio === this.anio - 1 && r._id.mes === i
      );
      if (datoAnterior) {
        max =
          datoAnterior.total.$numberDecimal > max
            ? Math.trunc(datoAnterior.total.$numberDecimal)
            : max;
        anioAnterior.push(datoAnterior.total.$numberDecimal);
      } else {
        anioAnterior.push(null);
      }
    }

    this.lineChartData = [
      {
        data: anioConsultado,
        label: this.anio.toString(),
        yAxisID: 'y-axis-0',
        datalabels: {
          align: (context: Context) => {
            const data1 = context.dataset.data[context.dataIndex];
            const data2 =
              context.chart.data.datasets[1].data[context.dataIndex];
            return data1 > data2 ? 'end' : 'start';
          },
          formatter: (value: any, context: any) => {
            if (value >= 1000000) {
              return (
                (Math.round((value / 1000000) * 100) / 100).toString() + ' MM'
              );
            }
          },
        },
      },
      {
        data: anioAnterior,
        label: (this.anio - 1).toString(),
        yAxisID: 'y-axis-0',
        datalabels: {
          align: (context: Context) => {
            const data1 = context.dataset.data[context.dataIndex];
            const data2 =
              context.chart.data.datasets[0].data[context.dataIndex];
            return data1 > data2 ? 'end' : 'start';
          },
          formatter: (value: any, context: any) => {
            if (value >= 1000000) {
              return (
                (Math.round((value / 1000000) * 100) / 100).toString() + ' MM'
              );
            }
          },
        },
      },
    ];
    /* calcula scala eje Y */
    const steps = 5;

    const digitos = max.toString().length - 1;
    const newMax =
      (Math.trunc(max / Math.pow(10, digitos)) + 1) * Math.pow(10, digitos);

    this.lineChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          backgroundColor: (context: Context) => {
            return context.dataset.borderColor.toString();
          },
          borderRadius: 4,
          color: 'white',
          formatter: Math.round,
        },
      },
      aspectRatio: 3 / 1,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Meses',
            },
          },
        ],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'left',
            ticks: {
              min: 0,
              max: newMax,
              stepSize: Math.ceil(newMax / steps),
            },
            scaleLabel: {
              display: true,
              labelString: 'Pesos ($)',
            },
          },
        ],
      },
    };
    this.lineEstado = this.ESTADO.OK;
  }

  cargaDatosVentaPorUen(data: GraficoVentasPorUen[]) {
    let max = 0;

    data.forEach((e) => {
      max =
        e.total.$numberDecimal > max ? Math.trunc(e.total.$numberDecimal) : max;
    });

    this.barChartData = [
      {
        data: data.map((r) => r.total.$numberDecimal),
        datalabels: {
          formatter: (value: any, context: any) => {
            if (value >= 1000000) {
              return (
                (Math.round((value / 1000000) * 100) / 100).toString() + ' MM'
              );
            } else {
              return Math.round(value);
            }
          },
        },
      },
    ];
    /* calcula scala eje X */
    const steps = 5;

    const digitos = max.toString().length - 1;
    const newMax =
      (Math.trunc(max / Math.pow(10, digitos)) + 1) * Math.pow(10, digitos);

    this.barChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          backgroundColor: (context: Context) => {
            return context.dataset.borderColor.toString();
          },
          borderRadius: 4,
          font: {
            size: 11,
          },
          color: 'white',
          formatter: Math.round,
        },
      },
      aspectRatio: 3 / 1,
      scales: {
        xAxes: [
          {
            ticks: {
              min: 0,
              max: newMax,
              stepSize: Math.ceil(newMax / steps),
            },
            scaleLabel: {
              display: true,
              labelString: 'Pesos ($)',
            },
          },
        ],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Categorías',
            },
          },
        ],
      },
    };
    this.barEstado = this.ESTADO.OK;
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
