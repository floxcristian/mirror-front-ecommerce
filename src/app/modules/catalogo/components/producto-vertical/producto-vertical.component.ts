import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAttribute } from '@core/models-v2/catalog/catalog-response.interface';
import { IScalePrice } from '@core/models-v2/cms/special-reponse.interface';

interface IProductTemp {
  // preciosScal: IScalePrice[]
  preciosScal: any[]
  precioEscala: boolean;
  precio: number;
  sku: string;
  rut: string;
  precioEsp: number;
  cyber: number;
  cyberMonday:number;
  attributes: IAttribute[];
}

@Component({
  selector: 'app-producto-vertical',
  templateUrl: './producto-vertical.component.html',
  styleUrls: ['./producto-vertical.component.scss'],
})
export class ProductoVerticalComponent implements OnInit {
  @Input() producto!: IProductTemp;
  @Output() agregarCarro: EventEmitter<any> = new EventEmitter();
  @Input() innerWidth!: number;
  @Input() tipoCatalogo!: string;
  precios: boolean = true;
  carro: boolean = true;
  constructor() {}

  ngOnInit() {
    switch (this.tipoCatalogo) {
      case 'Vendedor':
        this.carro = false;
        break;
      case 'Distribuidor':
        this.precios = false;
        this.carro = false;
        break;
    }
  }
  async addToCart(producto: any) {
    this.agregarCarro.emit(producto);
  }
}
