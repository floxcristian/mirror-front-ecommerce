import { FilterSubject } from './../../interfaces/filter-subject.interface'
import { FilterValor } from './../../interfaces/filter-valor.interface'
import {
  FiltroMagicoFilterParam,
  FilterNewFilterParam,
} from './../../interfaces/filtro-magico-filter-param.interface'
import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'

/**
 * @author José Espinoza
 * @description Servicio que permite la comunicación entre
 * un filtro master y varios esclavos
 */
@Injectable({
  providedIn: 'root',
})
export class FilterBridgeService {
  filterValores$ = new Subject<FilterValor>()
  filterSubject$ = new Subject<FilterSubject>()
  newFilterSubject$ = new Subject<FilterNewFilterParam>()

  constructor() {}

  /**
   * @author José Espinoza
   * @description Envía los valores obtenidos de los select, dropdown, etc al resto de observadores
   * Usado generalmente cuando el filtro magico master envia a los filtros magico slaves
   * los valores que deben ir en cada select.
   */
  pushFiltroValores(
    tag: any,
    internalTag: any,
    filtrosModal: any,
    filtrosValores: any,
    sender: any,
  ) {
    this.filterValores$.next({
      tag,
      internalTag,
      filtrosModal,
      filtrosValores,
      sender,
    })
  }

  getFilterValores() {
    return this.filterValores$
  }

  /**
   * @author José Espinoza
   * @description Envía los cambios ocurridos en un filtro mágico master o filtro mágico slave al resto de filtros mágicos suscritos.
   */
  pushFilter(
    tag: any,
    internalTag: any,
    filtros: any,
    bind: any,
    sender: any,
  ) {
    this.filterSubject$.next({ tag, internalTag, filtros, bind, sender })
  }

  getFilterSubject() {
    return this.filterSubject$
  }

  /**
   * @author José Espinoza
   * @description Se pueden enviar nuevos filtros desde fuera del datatable o filtro mágico para ser aplicados
   * en los filtros actuales. Se aplican similar a los filtros por defecto
   */
  pushNewFilterParams(
    tag: any,
    internalTag: any,
    nuevosFiltros: FiltroMagicoFilterParam[],
  ) {
    this.newFilterSubject$.next({
      tag,
      internalTag,
      nuevosFiltros,
      sender: null,
    })
  }

  getNewFilterParam() {
    return this.newFilterSubject$
  }
}
