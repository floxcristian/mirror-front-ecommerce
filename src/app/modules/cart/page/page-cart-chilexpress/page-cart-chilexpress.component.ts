import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChilexpressService } from '../../services/chilexpress.service';

@Component({
  selector: 'app-page-cart-chilexpress',
  templateUrl: './page-cart-chilexpress.component.html',
  styleUrls: ['./page-cart-chilexpress.component.scss'],
})
export class PageCartChilexpressComponent implements OnInit {
  @Input() shippingStore: any;
  @Output() chilexpress: EventEmitter<any> = new EventEmitter();
  constructor(private chilexpresService: ChilexpressService) {}
  expressRegion: any = [];
  comuna: any = [];
  idRegion: any = null;
  contryName: any = null;
  sucursales: any = [];
  load = false;

  async ngOnInit() {
    this.load = true;
    let consulta: any = await this.chilexpresService.getRegiones().toPromise();
    this.expressRegion = consulta.regions;
    this.idRegion = consulta.regions[0].regionId;
    await this.seleccionarRegion();

    this.getChilexpress(this.sucursales[0]);
  }

  ngOnChanges() {}

  async seleccionarRegion() {
    this.contryName = null;
    this.comuna = [];
    if (this.idRegion != null) {
      let params = {
        Type: 0,
        RegionCode: this.idRegion,
      };
      let consulta: any = await this.chilexpresService
        .getSucursales(params)
        .toPromise();
      let oficinas: any = consulta.offices;
      this.comuna = this.uniqueByKey(oficinas, 'countyName');
      this.contryName = this.comuna[0].countyName;
      await this.mostrarSucursal();
    }
  }
  //¨haciendo unico el valor para las comunas
  uniqueByKey(array: any, key: string) {
    return [...new Map(array.map((x: any) => [x[key], x])).values()];
  }

  async mostrarSucursal() {
    this.sucursales = [];
    this.load = true;
    let params = {
      Type: 0,
      RegionCode: this.idRegion,
      CountyName: this.contryName,
    };

    let consulta: any = await this.chilexpresService
      .getSucursales(params)
      .toPromise();
    this.sucursales = consulta.offices;
    this.load = false;
  }

  getChilexpress(item: any) {
    this.chilexpress.emit(item);
  }
}
