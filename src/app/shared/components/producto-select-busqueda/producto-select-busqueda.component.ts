import { distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subject, Observable, of, concat } from 'rxjs';
import { Articulo } from '../../interfaces/articulos.response';
import { LogisticsService } from '../../services/logistics.service';

@Component({
  selector: 'app-producto-select-busqueda',
  templateUrl: './producto-select-busqueda.component.html',
  styleUrls: ['./producto-select-busqueda.component.scss'],
})
export class ProductoSelectBusquedaComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() multiple = true;
  @Input() placeholder = 'Escriba 3 o más caracteres';

  articuloLoading = false;
  articuloInput$ = new Subject<string>();
  articulosSelect$!: Observable<Articulo[]>;

  @Input() nuevosArticulos: Articulo[] = [];
  articulos: Articulo[] = [];
  @Output() articulosSeleccionados = new EventEmitter<Articulo[]>();

  constructor(private logisticService: LogisticsService) {}

  ngOnInit(): void {
    this.buscarArticulo();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (
      changes['nuevosArticulos'] &&
      this.nuevosArticulos &&
      this.nuevosArticulos instanceof Array
    ) {
      if (this.hayCambios()) {
        if (this.nuevosArticulos.length === 0) {
          this.articulos = [];
        } else if (Object.keys(this.nuevosArticulos).length > 1) {
          // Vienen todos los atributos
          const search = this.nuevosArticulos.map((x) => x.sku).join(',');
          this.articuloInput$.next(search);
          this.articulos = [...this.nuevosArticulos];
        } else {
          // Vienen solo los sku
          const search = this.nuevosArticulos.map((x) => x.sku).join(',');
          this.articuloInput$.next(search);
          const response = await this.logisticService
            .articulos(search)
            .toPromise();
          if (response) {
            this.articulosSelect$ = of(response.data);
            this.articulos = [...response.data];
            this.articulosCambiados();
          }
        }
      }
    }
  }

  hayCambios(): boolean {
    if (
      !this.articulos &&
      this.nuevosArticulos &&
      this.nuevosArticulos.length > 0
    ) {
      return true;
    }
    if (this.articulos.length !== this.nuevosArticulos.length) {
      return true;
    }
    const skus = this.nuevosArticulos.map((a) => a.sku);
    for (let i = 0; i < this.articulos.length; i++) {
      if (!skus.includes(this.articulos[i].sku)) {
        return true;
      }
    }
    return false;
  }

  buscarArticulo() {
    this.articulosSelect$ = concat(
      of([]), // Inicial
      this.articuloInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.articuloLoading = true)),
        switchMap((search) =>
          this.logisticService.articulos(search).pipe(
            map((r) => r.data),
            tap(() => (this.articuloLoading = false))
          )
        )
      )
    );
  }

  compararArticulo(a: any, b: any) {
    return a.sku === b.sku;
  }

  articulosCambiados() {
    this.articulosSeleccionados.emit(this.articulos);
  }

  ngOnDestroy() {
    if (this.articuloInput$) {
      this.articuloInput$.unsubscribe();
    }
  }
}
