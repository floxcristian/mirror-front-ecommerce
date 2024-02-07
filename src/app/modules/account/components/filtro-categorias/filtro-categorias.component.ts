import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IChildren } from '@core/models-v2/cms/categories-response.interface';
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-filtro-categorias',
  templateUrl: './filtro-categorias.component.html',
  styleUrls: ['./filtro-categorias.component.scss'],
})
export class FiltroCategoriasComponent implements OnInit {
  categorias: IChildren[] = [];
  categoria2: IChildren[] = [];
  categoria3: IChildren[] = [];
  level1: string | null = null;
  level2: string | null = null;
  level3: string | null = null;
  @Output() url: EventEmitter<any> = new EventEmitter();
  constructor(private readonly cmsService: CmsService) {}

  async ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.cmsService.getCategories().subscribe({
      next: (categories) => (this.categorias = categories),
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeSelect() {
    this.categoria2 = [];
    this.categoria3 = [];
    if (this.level1 != null) {
      let consulta: IChildren[] = this.categorias.filter(
        (item: IChildren) => item.url === this.level1
      );
      this.categoria2 = consulta[0].children;
    } else {
      this.level2 = null;
      this.level3 = null;
    }
  }
  changeSelect2() {
    this.categoria3 = [];

    if (this.level2 == null) {
      this.level3 = null;
    } else {
      let consulta: IChildren[] = this.categoria2.filter(
        (item: IChildren) => item.url === this.level2
      );
      this.categoria3 = consulta[0].children;
    }
  }

  Filtrar() {
    if (this.level2 != null && this.level3 != null) this.url.emit(this.level3);
    else if (this.level2 != null && this.level3 == null)
      this.url.emit(this.level2);
    else if (this.level2 == null && this.level3 == null)
      this.url.emit(this.level1);
  }
}
