import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { isVacio } from '../../../../../../shared/utils/utilidades'
import { MenuCategoriasB2cService } from '../../../../../../shared/services/menu-categorias-b2c.service'

@Component({
  selector: 'app-nivel2',
  templateUrl: './nivel2.component.html',
  styleUrls: ['./nivel2.component.scss'],
})
export class Nivel2Component implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject()
  @Input() items: any[] = []
  nivel2: any[] = []
  titulo = ''
  url = ''
  isOpen = false
  @Output() seleccionado: EventEmitter<void> = new EventEmitter()

  constructor(public menuCategorias: MenuCategoriasB2cService) {}

  ngOnInit() {
    this.menuCategorias.isOpenNivel2$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.isOpen = resp.visible
        if (!isVacio(resp.seleccion)) {
          this.nivel2 = resp.seleccion.menu
          this.titulo = resp.seleccion.label
          this.url = resp.seleccion.url
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null)
    this.destroy$.complete()
  }

  close() {
    this.menuCategorias.close(2)
  }

  seleccionar() {
    this.close()
    setTimeout(() => {
      this.seleccionado.emit()
    }, 300)
  }
}
