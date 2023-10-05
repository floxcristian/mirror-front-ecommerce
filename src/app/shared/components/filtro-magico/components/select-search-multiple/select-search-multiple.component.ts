import { distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators'
import { Output, EventEmitter, SimpleChanges } from '@angular/core'
import { Subject, Observable, concat, of } from 'rxjs'
import { Component, OnInit, OnChanges, Input } from '@angular/core'

/**
 * Select especial como el de producto, pero universal.
 * OBLIGATORIO:
 * Necesita cumplir con ciertos requisitos el servicio de backend (consultar José Espinoza).
 * - La respuesta debe tener el _id o un identificador como primer campo.
 * - El servicio debe admitir una lista separada por coma en el search.
 * Es más que nada para que el bind surta efecto
 */
@Component({
  selector: 'app-select-search-multiple',
  templateUrl: './select-search-multiple.component.html',
  styleUrls: ['./select-search-multiple.component.scss'],
})
export class SelectSearchMultipleComponent implements OnInit, OnChanges {
  @Input() multiple = true

  loading = false
  input$ = new Subject<string>()
  valoresSelect$!: Observable<any[]>

  @Input() valoresSelectSearch!:
    | ((search: string) => Observable<any>)
    | undefined
  @Input() opcionSelect!: ((valor: any) => string) | undefined
  @Input() opcionKey: string | undefined = ''

  @Input() nuevosValores!: any[]
  valores!: any[]
  @Output() valoresSeleccionados = new EventEmitter<any[]>()

  @Output() respuestaBusqueda = new EventEmitter<{
    search: string
    response: any
  }>()

  constructor() {}

  ngOnInit(): void {
    this.buscarValor()
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (
      changes['nuevosValores'] &&
      this.nuevosValores &&
      this.nuevosValores instanceof Array
    ) {
      if (this.hayCambios()) {
        if (this.nuevosValores.length === 0) {
          this.valores = []
        } else if (Object.keys(this.nuevosValores).length > 1) {
          let search = ''
          if (this.nuevosValores[0][this.opcionKey || '']) {
            search = this.nuevosValores
              .map((x) => x[this.opcionKey || ''])
              .join(',')
          } else {
            search = this.nuevosValores.map((x) => x).join(',')
          }
          this.input$.next(search)
          this.valores = [...this.nuevosValores]
        } else {
          let search = ''
          if (this.nuevosValores[0][this.opcionKey || '']) {
            search = this.nuevosValores
              .map((x) => x[this.opcionKey || ''])
              .join(',')
          } else {
            search = this.nuevosValores.map((x) => x).join(',')
          }
          this.input$.next(search)
          const response = await this.valoresSelectSearch?.(search).toPromise()
          if (response.data) {
            this.valoresSelect$ = of(response.data)
            this.valores = [...response.data]
          } else {
            this.valoresSelect$ = of(response)
            this.valores = [...response]
          }
        }
      }
    }
  }

  hayCambios(): boolean {
    if (!this.valores && this.nuevosValores && this.nuevosValores.length > 0) {
      return true
    }
    if (this.valores.length !== this.nuevosValores.length) {
      return true
    }
    const keys = this.nuevosValores.map((a) => a[this.opcionKey || ''])
    for (let i = 0; i < this.valores.length; i++) {
      if (!keys.includes(this.valores[i][this.opcionKey || ''])) {
        return true
      }
    }
    return false
  }

  buscarValor() {
    this.valoresSelect$ = concat(
      of([]), // Inicial
      this.input$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((search) =>
          (this.valoresSelectSearch?.(search) as Observable<any>).pipe(
            tap(() => (this.loading = false)),
            map((response) => {
              this.respuestaBusqueda.emit({
                search: search,
                response: response,
              })
              return response
            }),
          ),
        ),
      ),
    )
  }

  compararValor(a: any, b: any) {
    const keys = Object.keys(a)
    if (keys.length > 0) {
      const key = keys[0]
      return a[key] === b[key]
    }
    return false
  }

  valoresCambiados() {
    this.valoresSeleccionados.emit(this.valores)
  }
}
