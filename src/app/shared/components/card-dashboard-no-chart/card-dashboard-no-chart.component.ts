import { Component, OnInit, Input } from '@angular/core'
import { isVacio } from '../../utils/utilidades'

export interface Data {
  label: string
  valor: number
  porcentaje?: number
}

@Component({
  selector: 'app-card-dashboard-no-chart',
  templateUrl: './card-dashboard-no-chart.component.html',
  styleUrls: ['./card-dashboard-no-chart.component.scss'],
})
export class CardDashboardNoChartComponent implements OnInit {
  @Input() titulo!: string
  @Input() data!: Data[]
  @Input() iconClass!: string
  @Input() iconContainerClass!: string

  isVacio = isVacio

  constructor() {}

  ngOnInit() {}
}
