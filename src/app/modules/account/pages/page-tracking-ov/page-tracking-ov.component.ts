import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { OmsService } from '@core/services-v2/oms.service';
import { Iorder } from '@core/models-v2/oms/order.interface';

@Component({
  selector: 'app-page-tracking-ov',
  templateUrl: './page-tracking-ov.component.html',
  styleUrls: ['./page-tracking-ov.component.scss'],
})
export class PageTrackingOvComponent implements OnInit {
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  persons!: Iorder[];
  loadData:boolean = false;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(
    // Services V2
    // private readonly sessionService: SessionService,
    private readonly omsService:OmsService
  ) {}

  ngOnInit(): void {
    this.resultado_busqueda();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {}

  async resultado_busqueda() {
    this.loadData = true;

    //utilizacion de dtOption para filtrar datos/
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 15, 20],
        [10, 15, 20],
      ],
      serverSide: true,
      responsive: true,
      searching: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
        processing: 'Cargando Ordenes de ventas..',
      },

      ajax: (dataTablesParameters: any, callback) => {
        //datos set de ordenamiento//
        this.loadData = true;
        this.persons = [];
        let page_actual = dataTablesParameters.start === 0 ? 1 : (dataTablesParameters.start/dataTablesParameters.length)+1
        let sort_column = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        let sort_asc_desc = dataTablesParameters.order[0].dir === 'asc' ? 1 : -1
        let sort_real = sort_column+'|'+sort_asc_desc
        let params2 = {search: dataTablesParameters.search.value, page:page_actual, limit:dataTablesParameters.length, sort:sort_real}
        this.omsService.getOrders(params2).subscribe({
          next:(res) =>{
            this.persons = res.data;
            this.persons.map((r: any) => {
              r.expanded = false;
            });
            this.loadData = false;
            callback({
              recordsTotal: res.total,
              recordsFiltered: res.total,
              data: [],
            });
          },
          error:(err)=>{
            console.log(err)
          }
        })
      },
      columns: [
        { data: 'trackingNumber', width: '15%' },
        { data: 'cartNumber' },
        { data: 'status.status', width: '15%' },
        { data: 'pickupBranch.name' },
        { data: 'shipping.shippingType', width: '15%' },
        { data: 'payment.salesAmount' },
        { data: 'shipping.requestedDate' },
      ],
    };
  }

  buscarOv(item: any) {
    if (item.expanded == true) item.expanded = false;
    else item.expanded = true;
  }
}
