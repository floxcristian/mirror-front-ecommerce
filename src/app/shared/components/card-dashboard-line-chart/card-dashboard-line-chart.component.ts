import { Component, Input, OnInit } from '@angular/core';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Color, Label } from 'ng2-charts';

@Component({
    selector: 'app-card-dashboard-line-chart',
    templateUrl: './card-dashboard-line-chart.component.html',
    styleUrls: ['./card-dashboard-line-chart.component.scss']
})
export class CardDashboardLineChartComponent implements OnInit {
    @Input() titulo:any;
    @Input() iconClass:any;
    @Input() iconContainerClass:any;
    @Input() estado:any;

    @Input() lineChartData: ChartDataset[] = [];
    lineChartPlugins = [ChartDataLabels];
    // @Input() lineChartLabels: Label[] = [];
    @Input() lineChartLabels: any[] = [];
    @Input() lineChartOptions: ChartOptions = {};
    // lineChartColors: Color[] = [
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
    lineChartColors: any[] = [
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
    lineChartLegend = true;
    lineChartType: ChartType = 'line';

    ESTADO = { BUSCANDO: 1, OK: 2, NO_ENCONTRADO: 3, ERROR: 4 };

    constructor() { }

    ngOnInit() {}

}
