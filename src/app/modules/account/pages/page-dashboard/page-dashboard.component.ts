import { Component, Inject, PLATFORM_ID } from '@angular/core';
// import { ProductsService } from '../../../../shared/services/products.service';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../../../shared/services/root.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { Data } from '../../../../shared/components/card-dashboard-no-chart/card-dashboard-no-chart.component';
import { GraficoVentaValorada } from '../../../../shared/interfaces/graficoVentaValorada';
import { ChartDataset, ChartConfiguration, ChartOptions } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { isVacio } from '../../../../shared/utils/utilidades';
import { GraficoVentasPorUen } from '../../../../shared/interfaces/graficoVentaPorUen';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent {
  // graficos
  chartHistorySale: any;
  usuario: Usuario | any;

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
  lineChartData!: ChartConfiguration['data'];
  lineChartOptions: ChartOptions = {};

  barEstado = this.ESTADO.BUSCANDO;
  barChartData!: ChartConfiguration['data'];
  barChartLabels!: any[];
  barChartOptions: ChartOptions = {};
  isB2B: boolean = false;

  constructor(
    private clientService: ClientsService,
    private toastr: ToastrService,
    private root: RootService,
    private currency: CurrencyFormatPipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;

    this.usuario = this.root.getDataSesionUsuario();
    if (['supervisor', 'comprador'].includes(this.usuario.user_role))
      this.isB2B = true;
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
            icon:
              porcentaje - 100 >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down',
            textClass: porcentaje - 100 >= 0 ? 'text-success' : 'text-danger',
          };
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

    this.lineChartData = {
      labels: [
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
      ],
      datasets: [
        {
          data: anioConsultado,
          label: this.anio.toString(),
          yAxisID: 'yAxes',
          datalabels: {
            align: (context: Context) => {
              const data1 = context.dataset.data[context.dataIndex] || 0;
              const data2 =
                context.chart.data.datasets[1].data[context.dataIndex] || 0;
              return data1 > data2 ? 'end' : 'start';
            },
            formatter: (value: any, context: any) => {
              if (value >= 1000000) {
                return (
                  (Math.round((value / 1000000) * 100) / 100).toString() +
                  ' MM'
                );
              }
              return value;
            },
          },
          backgroundColor: 'rgba(0,175,238,0.2)',
          borderColor: 'rgba(0,175,238,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: true,
        },
        {
          data: anioAnterior,
          label: (this.anio - 1).toString(),
          yAxisID: 'yAxes',
          datalabels: {
            align: (context: Context) => {
              const data1 = context.dataset.data[context.dataIndex] || 0;
              const data2 =
                context.chart.data.datasets[0].data[context.dataIndex] || 0;
              return data1 > data2 ? 'end' : 'start';
            },
            formatter: (value: any) => {
              if (value >= 1000000) {
                return (
                  (Math.round((value / 1000000) * 100) / 100).toString() +
                  ' MM'
                );
              }
              return value;
            },
          },
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: 'rgba(77,83,96,1)',
          pointBackgroundColor: 'rgba(77,83,96,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(77,83,96,1)',
          fill: true,
        },
      ],
    };
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
            return context.dataset?.borderColor?.toString() || '';
          },
          borderRadius: 4,
          color: 'white',
          formatter: Math.round,
        },
      },
      // aspectRatio: 2,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Meses',
          },
        },
        yAxes: {
          position: 'left',
          min: 0,
          max: newMax,
          ticks: {
            stepSize: Math.ceil(newMax / steps),
          },
          display: true,
          title: {
            display: true,
            text: 'Pesos ($)',
          },
        },
      },
    };
    this.lineEstado = this.ESTADO.OK;
  }

  cargaDatosVentaPorUen(data: GraficoVentasPorUen[]) {
    let max = 0;

    data.forEach((e) => {
      max =
        e.total.$numberDecimal > max
          ? Math.trunc(e.total.$numberDecimal)
          : max;
    });

    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data: data.map((r) => r.total.$numberDecimal),
          datalabels: {
            formatter: (value: any, context: any) => {
              if (value >= 1000000) {
                return (
                  (Math.round((value / 1000000) * 100) / 100).toString() +
                  ' MM'
                );
              } else {
                return Math.round(value);
              }
            },
          },
          backgroundColor: 'rgba(0,175,238,0.2)',
          borderColor: 'rgba(0,175,238,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        },
      ],
    };
    /* calcula scala eje X */
    const steps = 5;

    const digitos = max.toString().length - 1;
    const newMax =
      (Math.trunc(max / Math.pow(10, digitos)) + 1) * Math.pow(10, digitos);

    this.barChartOptions = {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        datalabels: {
          backgroundColor: (context: Context) => {
            return context.dataset.borderColor?.toString() || '';
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
        x: {
          min: 0,
          max: newMax,
          ticks: {
            stepSize: Math.ceil(newMax / steps),
          },
          display: true,
          title: {
            display: true,
            text: 'Pesos ($)',
          },
        },
        y: {
          position: 'left',
          display: true,
          title: {
            display: true,
            text: 'Categorías',
          },
        },
      },
    };
    this.barEstado = this.ESTADO.OK;
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
