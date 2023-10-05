import { Component, Input, OnInit } from '@angular/core'
import {
  ChartDataset,
  ChartConfiguration,
  ChartOptions,
  ChartType,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

@Component({
  selector: 'app-card-dashboard-line-chart',
  templateUrl: './card-dashboard-line-chart.component.html',
  styleUrls: ['./card-dashboard-line-chart.component.scss'],
})
export class CardDashboardLineChartComponent implements OnInit {
  @Input() titulo: any
  @Input() iconClass: any
  @Input() iconContainerClass: any
  @Input() estado: any

  @Input() lineChartData!: ChartConfiguration['data']
  lineChartPlugins = [ChartDataLabels]
  @Input() lineChartOptions: ChartOptions = {}
  lineChartLegend = true
  lineChartType: ChartType = 'line'

  ESTADO = { BUSCANDO: 1, OK: 2, NO_ENCONTRADO: 3, ERROR: 4 }

  constructor() {}

  ngOnInit() {}
}
