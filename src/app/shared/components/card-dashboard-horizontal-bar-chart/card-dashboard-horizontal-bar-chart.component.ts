import { Component, Input, OnInit } from '@angular/core';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-card-dashboard-horizontal-bar-chart',
  templateUrl: './card-dashboard-horizontal-bar-chart.component.html',
  styleUrls: ['./card-dashboard-horizontal-bar-chart.component.scss']
})
export class CardDashboardHorizontalBarChartComponent implements OnInit {
    @Input() titulo:any;
    @Input() iconClass:any;
    @Input() iconContainerClass:any;
    @Input() estado:any;

    @Input() barChartData: ChartDataset[] = [];
    barChartPlugins = [ChartDataLabels];
    // @Input() barChartLabels: Label[] = [];
    @Input() barChartLabels: any[] = [];
    @Input() barChartOptions: ChartOptions = {};
    // barChartColors: Color[] = [
    //     {
    //         backgroundColor: 'rgba(0,175,238,0.2)',
    //         borderColor: 'rgba(0,175,238,1)',
    //         pointBackgroundColor: 'rgba(148,159,177,1)',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    //     },
    //     {
    //         backgroundColor: 'rgba(77,83,96,0.2)',
    //         borderColor: 'rgba(77,83,96,1)',
    //         pointBackgroundColor: 'rgba(77,83,96,1)',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: 'rgba(77,83,96,1)',
    //     },
    // ];
    barChartColors: any[] = [
        {
            backgroundColor: 'rgba(0,175,238,0.2)',
            borderColor: 'rgba(0,175,238,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        },
        {
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
        },
    ];
    barChartLegend = false;
    // barChartType: ChartType = 'horizontalBar';
    barChartType: any = 'horizontalBar'
    ESTADO = { BUSCANDO: 1, OK: 2, NO_ENCONTRADO: 3, ERROR: 4 };

    constructor() { }

    ngOnInit() {}

}
