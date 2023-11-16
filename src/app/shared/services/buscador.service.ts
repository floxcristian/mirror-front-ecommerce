// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { /*BehaviorSubject, */ Subject } from 'rxjs';
// Interfaces
import { Flota, MarcaModeloAnio } from '../interfaces/flota';

export interface BusquedaData {
  filtro?: Flota;
  marcaModeloAnio?: MarcaModeloAnio;
  word?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BuscadorService {
  // private fs = false;
  //private filtroSeleccionado = new BehaviorSubject<boolean>(this.fs);
  //private buscador = new Subject<BusquedaData>();
  private buscadorExterno = new Subject<BusquedaData>();
  private buscadorFiltrosVisibles = new Subject<boolean>();
  //private buscadorFiltrosExternosVisibles = new Subject<boolean>();

  // buscador$ = this.buscador.asObservable();
  buscadorExterno$ = this.buscadorExterno.asObservable();
  buscadorFiltrosVisibles$ = this.buscadorFiltrosVisibles.asObservable();
  /*buscadorFiltrosExternosVisibles$ =
    this.buscadorFiltrosExternosVisibles.asObservable();*/

  /*
  buscar(data: BusquedaData): void {
    this.buscador.next(data);
  }*/

  /*
  filtrosExternosVisibles(visibles: boolean) {
    this.buscadorFiltrosExternosVisibles.next(visibles);
  }*/

  /*
  setFiltro(filtro: boolean): void {
    this.filtroSeleccionado.next(filtro);
  }*/

  filtrosVisibles(visibles: boolean): void {
    this.buscadorFiltrosVisibles.next(visibles);
  }

  /*
  isFiltroSeleccionado(): boolean {
    return this.filtroSeleccionado.getValue();
  }*/
}
