import { Component, Input, OnInit } from '@angular/core';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ChartDataset, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-card-dashboard-horizontal-bar-chart',
  templateUrl: './card-dashboard-horizontal-bar-chart.component.html',
  styleUrls: ['./card-dashboard-horizontal-bar-chart.component.scss'],
})
export class CardDashboardHorizontalBarChartComponent implements OnInit {
  @Input() titulo: any;
  @Input() iconClass: any;
  @Input() iconContainerClass: any;
  @Input() estado: any;

  @Input() barChartData!: ChartConfiguration['data'];
  barChartPlugins = [ChartDataLabels];
  @Input() barChartOptions: ChartOptions = {};
  barChartLegend = false;
  barChartType: any = 'bar';
  ESTADO = { BUSCANDO: 1, OK: 2, NO_ENCONTRADO: 3, ERROR: 4 };

  constructor() {}

  ngOnInit() {}
}
