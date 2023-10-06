import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  private fs = false;
  private filtroSeleccionado = new BehaviorSubject<boolean>(this.fs);

  private buscador = new Subject<BusquedaData>();
  private buscadorExterno = new Subject<BusquedaData>();
  private buscadorFiltrosVisibles = new Subject<boolean>();
  private buscadorFiltrosExternosVisibles = new Subject<boolean>();

  public buscador$ = this.buscador.asObservable();
  public buscadorExterno$ = this.buscadorExterno.asObservable();
  public buscadorFiltrosVisibles$ =
    this.buscadorFiltrosVisibles.asObservable();
  public buscadorFiltrosExternosVisibles$ =
    this.buscadorFiltrosExternosVisibles.asObservable();

  constructor() {}

  buscar(data: BusquedaData) {
    this.buscador.next(data);
  }

  buscarExterno(data: BusquedaData) {
    this.buscadorExterno.next(data);
  }

  filtrosVisibles(visibles: boolean) {
    this.buscadorFiltrosVisibles.next(visibles);
  }

  filtrosExternosVisibles(visibles: boolean) {
    this.buscadorFiltrosExternosVisibles.next(visibles);
  }

  setFiltro(filtro: boolean) {
    this.filtroSeleccionado.next(filtro);
  }

  isFiltroSeleccionado() {
    return this.filtroSeleccionado.getValue();
  }
}
