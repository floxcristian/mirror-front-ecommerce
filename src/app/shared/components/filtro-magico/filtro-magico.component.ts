import { searchGroupItemFiltroMagico } from './functions/search-group-item.filtro-magico'
import { FilterNewFilterParam } from './interfaces/filtro-magico-filter-param.interface'
import { FilterBridgeService } from './services/filter-bridge/filter-bridge.service'
import { Observable, of, Subscription } from 'rxjs'
import {
  FiltrosMagicos,
  FiltroMagico,
} from './interfaces/filtro-magico.interface'
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-filtro-magico',
  templateUrl: './filtro-magico.component.html',
  styleUrls: ['./filtro-magico.component.scss'],
})
export class FiltroMagicoComponent implements OnInit {
  @Input('filtros') filtrosMagicos!: FiltrosMagicos

  /**
   * ESTOS PARÁMETROS INPUT A CONTINUACIÓN SON DE USO INTERNO PARA EL DATATABLE
   */
  // Solo para identificarlo en filter-bridge (uso interno)
  @Input('id') id: string = ''
  @Input() emitirFiltrosDefecto: boolean = true
  // en una relación master-slave, el master busca los valores de los select y alimenta a los slaves
  @Input() isMaster: boolean = true
  @Input() closeOnSelect: boolean = false

  @Output() onFiltrosCambiados = new EventEmitter<any>()
  @Output() onFiltrosDefectoEjecutados = new EventEmitter<any>()
  @Output() onBotonFiltrar = new EventEmitter<any>()
  @Output() onFiltrosModelCambiados = new EventEmitter<any>()

  internalId: string
  // Resultado de los filtros a enviarse al exterior
  filtrosModel: any = {}
  // Cada arreglo de los select se almacena aquí
  filtrosValores: any = {}
  // Bind que se hace de lo seleccionado al component html ng-select
  filtrosBind: any = {}

  // Define desde dónde puede comenzar la fecha 'hasta' de cada rango-fecha
  rangosFechaMinimos: any = {}
  minYear = 1910 // Solo filtra si el año es al menos 'minYear'

  filterValores$!: Subscription
  filterSubcription$!: Subscription
  filterNewParams$!: Subscription

  searchGroupItemFiltroMagicoFn = searchGroupItemFiltroMagico

  constructor(private filterBridgeService: FilterBridgeService) {
    this.internalId = uuidv4()
  }

  async ngOnInit(): Promise<void> {
    this.subscribeToBindChanges()
    if (this.isMaster) {
      this.subscribeToNewFilterParams()
    }
    this.prepararDatosVacios()
    if (this.isMaster) {
      await this.prepararValoresFiltrosAsMaster()
    } else {
      await this.prepararValoresFiltrosAsSlave()
    }
    await this.aplicarFiltrosDefecto()
  }

  ngOnDestroy(): void {
    this.unsubscribeToChanges()
  }

  prepararDatosVacios() {
    for (let i = 0; i < this.filtrosMagicos.filtros.length; i++) {
      const f = this.filtrosMagicos.filtros[i]
      if (
        f.tipo === 'dropdown-input' ||
        f.tipo === 'dropdown-select-multiple'
      ) {
        this.filtrosModel[f.key] = { dropdown: null, valor: null }
        if (f.tipo === 'dropdown-select-multiple') {
          this.filtrosValores[f.key] = []
        }
      } else if (f.tipo === 'rango-fechas') {
        this.filtrosModel[f.key] = { desde: null, hasta: null }
        this.filtrosBind[f.key] = {
          desde: null,
          hasta: null,
          llamarFiltro: true,
        }
      } else {
        this.filtrosModel[f.key] = null
      }
    }
  }

  async prepararValoresFiltrosAsMaster() {
    let promises = []
    for (let i = 0; i < this.filtrosMagicos.filtros.length; i++) {
      const f = this.filtrosMagicos.filtros[i]
      if (f.tipo === 'select' || f.tipo === 'select-multiple') {
        promises.push(this.valores(f.valoresSelect).toPromise())
      } else if (
        f.tipo === 'dropdown-input' ||
        f.tipo === 'dropdown-select-multiple'
      ) {
        if (f.tipo === 'dropdown-select-multiple') {
          promises.push(this.valores(f.valoresSelect).toPromise())
        }
        if (
          f.defectoDropdown !== null ||
          typeof f.defectoDropdown !== 'undefined'
        ) {
          promises.push(this.valores(f.valoresDropdown).toPromise())
        }
      }
    }
    let index = 0
    const result = await Promise.all(promises)
    for (let i = 0; i < this.filtrosMagicos.filtros.length; i++) {
      const f = this.filtrosMagicos.filtros[i]
      if (f.tipo === 'select' || f.tipo === 'select-multiple') {
        this.filtrosBind[f.key] = []
        this.filtrosValores[f.key] = result[index++]
      } else if (
        f.tipo === 'dropdown-input' ||
        f.tipo === 'dropdown-select-multiple'
      ) {
        this.filtrosModel[f.key] = { dropdown: null, valor: null }
        if (f.tipo === 'dropdown-select-multiple') {
          this.filtrosBind[f.key] = []
          this.filtrosValores[f.key] = result[index++]
        }
        if (
          f.defectoDropdown !== null ||
          typeof f.defectoDropdown !== 'undefined'
        ) {
          const valoresDropdown = result[index++]
          this.filtrosModel[f.key].dropdown =
            valoresDropdown[f.defectoDropdown || 0]
        }
      }
    }
    this.filterBridgeService.pushFiltroValores(
      this.id,
      this.internalId,
      this.filtrosModel,
      this.filtrosValores,
      this,
    )
  }

  async prepararValoresFiltrosAsSlave() {
    if (this.id) {
      const filtroMagicoKeys = this.filtrosMagicos.filtros.map((f) => f.key)
      this.filterValores$ = this.filterBridgeService
        .getFilterValores()
        .subscribe((data) => {
          if (this.id === data.tag && this.internalId !== data.internalTag) {
            Object.keys(data.filtrosValores).forEach((key) => {
              if (filtroMagicoKeys.includes(key)) {
                this.filtrosValores[key] = data.filtrosValores[key]
              }
            })
            Object.keys(data.filtrosModal).forEach((key) => {
              if (filtroMagicoKeys.includes(key)) {
                if (
                  data.filtrosModal[key] &&
                  data.filtrosModal[key].hasOwnProperty('dropdown')
                ) {
                  this.filtrosModel[key] = data.filtrosModal[key]
                }
              }
            })
          }
        })
    }
  }

  async aplicarFiltrosDefecto() {
    for (let i = 0; i < this.filtrosMagicos.filtros.length; i++) {
      const f = this.filtrosMagicos.filtros[i]
      if (!f.valorDefecto) {
        continue
      }
      const data = await f.valorDefecto()
      if (!data) {
        continue
      }
      if (f.tipo === 'select' || f.tipo === 'select-multiple') {
        const params = (data.params || []).map((x: any) => x.toString())
        const filtered = data.key
          ? (this.filtrosValores[f.key] || []).filter((resp: any) =>
              params.includes(resp[data.key].toString()),
            )
          : (this.filtrosValores[f.key] || []).filter((resp: any) =>
              params.includes(resp.toString()),
            )
        if (filtered.length > 0) {
          this.filtrosModel[f.key] =
            f.tipo === 'select' ? filtered[0] : filtered
          this.filtrosBind[f.key] =
            f.tipo === 'select' ? filtered[0] : filtered
        }
      } else if (f.tipo === 'rango-fechas') {
        this.filtrosBind[f.key] = {
          desde: data.params[0].toISOString().slice(0, 10),
          hasta: data.params[1]
            ? data.params[1].toISOString().slice(0, 10)
            : undefined,
          llamarFiltro: false,
        }
        this.filtrosModel[f.key] = {
          desde: this.filtrosBind[f.key]['desde'],
          hasta: this.filtrosBind[f.key]['hasta'],
        }
      } else if (f.tipo === 'producto-multiple') {
        this.filtrosBind[f.key] = [...data.params]
      } else if (f.tipo === 'select-search-multiple') {
        this.filtrosBind[f.key] = [...data.params]
        this.filtrosModel[f.key] = [...data.params]
      }
    }
    if (this.emitirFiltrosDefecto) {
      this.filtrosCambiados(true)
      this.onFiltrosDefectoEjecutados.emit(this.filtrosModel)
    } else {
      this.onFiltrosModelCambiados.emit(this.filtrosModel)
    }
  }

  subscribeToNewFilterParams() {
    if (this.id) {
      this.filterNewParams$ = this.filterBridgeService
        .getNewFilterParam()
        .subscribe(async (response: FilterNewFilterParam) => {
          if (
            this.id === response.tag &&
            this.internalId !== response.internalTag
          ) {
            for (let i = 0; i < this.filtrosMagicos.filtros.length; i++) {
              const f = this.filtrosMagicos.filtros[i]
              let dataArr = response.nuevosFiltros.filter(
                (x) => x.filterKey === f.key,
              )
              if (!dataArr || dataArr.length === 0) {
                continue
              }
              let data = dataArr[0]
              if (f.tipo === 'select' || f.tipo === 'select-multiple') {
                const params = data.params.map((x) => x.toString())
                const filteredValores = data.key
                  ? (this.filtrosValores[f.key] || []).filter((resp: any) =>
                      params.includes(resp[data.key || ''].toString()),
                    )
                  : (this.filtrosValores[f.key] || []).filter((resp: any) =>
                      params.includes(resp.toString()),
                    )
                if (filteredValores.length > 0) {
                  this.filtrosModel[f.key] =
                    f.tipo === 'select' ? filteredValores[0] : filteredValores
                  this.filtrosBind[f.key] =
                    f.tipo === 'select' ? filteredValores[0] : filteredValores
                }
              } else if (f.tipo === 'rango-fechas') {
                this.filtrosBind[f.key] = {
                  desde: data.params[0].toISOString().slice(0, 10),
                  hasta: data.params[1].toISOString().slice(0, 10),
                  llamarFiltro: false,
                }
                this.filtrosModel[f.key] = {
                  desde: this.filtrosBind[f.key]['desde'],
                  hasta: this.filtrosBind[f.key]['hasta'],
                }
              }
            }
            this.filtrosCambiados()
          }
        })
    }
  }

  valores(valores: any): Observable<any> {
    if (valores instanceof Array) {
      return of(valores)
    }
    return valores
  }

  selectChanged(key: string, $event: any) {
    this.filtrosModel[key] = $event
    this.filtrosCambiados()
  }

  selectSearchChanged(key: string, $event: any) {
    this.filtrosModel[key] = $event
    this.filtrosBind[key] = $event
    this.filtrosCambiados()
  }

  dropdownChanged(key: string, item: any, $event: any) {
    this.filtrosModel[key].dropdown = item
    if (this.filtrosModel[key].valor || this.filtrosModel[key].valor == '0') {
      this.filtrosCambiados()
    }
    $event.stopPropagation()
  }

  dropdownInputChanged(key: string, $event: any) {
    this.filtrosModel[key].valor = $event
    this.filtrosCambiados()
  }

  rangoFechaInputChanged(key: string, fechaKey: string, $event: any) {
    if ($event != null) {
      const date = new Date($event)
      // Solo considera aquellos años que son superiores a minYear
      if (date.getFullYear() < this.minYear) {
        return
      }
    }
    // Evita llamado cuando se elimina fecha de la lista
    if (
      this.filtrosBind[key].desde === null &&
      this.filtrosBind[key].hasta === null
    ) {
      return
    }
    // Evita llamado extra al iniciar datatable
    if (!this.filtrosBind[key].llamarFiltro && fechaKey === 'hasta') {
      this.filtrosBind[key].llamarFiltro = true
      return
    }
    if (this.filtrosBind[key].llamarFiltro) {
      this.filtrosModel[key][fechaKey] = $event
      if (fechaKey === 'desde') {
        this.rangosFechaMinimos[key] = $event || '1980-01-01'
      }
      this.filtrosCambiados()
    }
  }

  filtrosCambiados(pushBindChanges: boolean = true) {
    this.onFiltrosCambiados.emit(this.filtrosModel)
    this.onFiltrosModelCambiados.emit(this.filtrosModel)
    if (pushBindChanges) {
      this.pushBindChanges()
    }
  }

  filtrar(pushBindChanges: boolean = true) {
    this.onBotonFiltrar.emit(this.filtrosModel)
    this.onFiltrosModelCambiados.emit(this.filtrosModel)
    if (pushBindChanges) {
      this.pushBindChanges()
    }
  }

  subscribeToBindChanges() {
    if (this.id) {
      this.filterSubcription$ = this.filterBridgeService
        .getFilterSubject()
        .subscribe((data) => {
          if (this.id === data.tag && this.internalId !== data.internalTag) {
            this.applyNewFilters(data.filtros, data.bind)
          }
        })
    }
  }

  pushBindChanges() {
    if (this.id && this.filterSubcription$) {
      this.filterBridgeService.pushFilter(
        this.id,
        this.internalId,
        this.filtrosModel,
        this.filtrosBind,
        this,
      )
    }
  }

  applyNewFilters(filtros: any, bind: any) {
    const filtrosArr = Array.isArray(filtros) ? filtros : [filtros]
    const bindArr = Array.isArray(bind) ? bind : [bind]

    for (const f of this.filtrosMagicos.filtros) {
      for (let j = 0; j < filtrosArr.length; j++) {
        filtros = filtrosArr[j]
        bind = bindArr[j]

        if (filtros.hasOwnProperty(f.key)) {
          this.filtrosModel[f.key] = filtros[f.key]
        }
        if (bind.hasOwnProperty(f.key)) {
          if (f.tipo === 'select' || f.tipo === 'producto') {
            this.filtrosBind[f.key] =
              bind[f.key] instanceof Array ? [...bind[f.key]] : bind[f.key]
          } else if (
            f.tipo === 'select-multiple' ||
            f.tipo === 'producto-multiple' ||
            f.tipo === 'select-search-multiple'
          ) {
            this.filtrosBind[f.key] = [...bind[f.key]]
          } else if (f.tipo === 'dropdown-input') {
            this.filtrosModel[f.key].dropdown = filtros[f.key].dropdown
            this.filtrosBind[f.key] = bind[f.key]
          } else if (f.tipo === 'dropdown-select-multiple') {
            this.filtrosModel[f.key].dropdown = filtros[f.key].dropdown
            this.filtrosBind[f.key] = [...bind[f.key]]
          } else if (f.tipo === 'rango-fechas') {
            this.filtrosModel[f.key]['desde'] = bind[f.key]['desde']
            this.filtrosBind[f.key]['desde'] = bind[f.key]['desde']
            this.filtrosModel[f.key]['hasta'] = bind[f.key]['hasta']
            this.filtrosBind[f.key]['hasta'] = bind[f.key]['hasta']
          }
        }
      }
    }

    if (this.isMaster) {
      this.filtrosCambiados(false)
    }
  }

  unsubscribeToChanges() {
    if (this.filterSubcription$) {
      this.filterSubcription$.unsubscribe()
    }
    if (this.filterValores$) {
      this.filterValores$.unsubscribe()
    }
    if (this.filterNewParams$) {
      this.filterNewParams$.unsubscribe()
    }
  }

  onRespuestaBusqueda(
    filtro: FiltroMagico,
    $event: { search: string; response: any },
  ) {
    if (filtro.hooks && filtro.hooks.onRespuestaBusqueda) {
      filtro.hooks.onRespuestaBusqueda($event.search, $event.response)
    }
  }
}
