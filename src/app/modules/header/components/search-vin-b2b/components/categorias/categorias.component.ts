import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { isVacio } from '../../../../../../shared/utils/utilidades';
import { Flota } from '../../../../../../shared/interfaces/flota';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit, OnChanges {
  @Input() collapsed!: boolean;
  @Input() categorias!: any[];
  @Input() chassis!: string;
  @Input() numeroParte!: string;
  @Input() filtro!: Flota;
  @Input() word!: string;
  @Input() patente!: string;
  @Input() marca!: string;
  @Input() modelo!: string;
  @Input() anio!: string;
  @Output() clickCategoria = new EventEmitter<any>();

  queryParams: any = {};

  /* imagenes provisorias */
  imagenes = [
    'suspension.png',
    'insumos.png',
    'iluminacion.png',
    'amarres.jpg',
    'seguridad.png',
    'llantas_y_neumaticos.png',
    'suspension.png',
    'insumos.png',
    'iluminacion.png',
    'amarres.jpg',
    'seguridad.png',
    'llantas_y_neumaticos.png',
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = {};
    if (this.chassis !== '') {
      this.queryParams = { ...this.queryParams, ...{ chassis: this.chassis } };
    }
    if (!isVacio(this.filtro)) {
      // if (this.filtro.alias !== '') {
      //     this.queryParams = { ...this.queryParams, ...{ flota: this.filtro.alias} };
      // } else {
      this.queryParams = {
        ...this.queryParams,
        ...{ chassis: this.filtro.vehiculo?.chasis },
      };
      // }
    }
    if (this.numeroParte !== '') {
      this.queryParams = {
        ...this.queryParams,
        ...{ numeroParte: this.numeroParte },
      };
    }
    if (this.patente !== '') {
      this.queryParams = { ...this.queryParams, ...{ patente: this.patente } };
    }
    if (this.marca !== '') {
      this.queryParams = { ...this.queryParams, ...{ marca: this.marca } };
    }
    if (this.modelo !== '') {
      this.queryParams = { ...this.queryParams, ...{ modelo: this.modelo } };
    }
    if (this.anio !== '') {
      this.queryParams = { ...this.queryParams, ...{ anio: this.anio } };
    }
  }

  ngOnInit() {}

  click() {
    this.clickCategoria.emit(true);
  }
}
