import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-filtro-categorias',
  templateUrl: './filtro-categorias.component.html',
  styleUrls: ['./filtro-categorias.component.scss'],
})
export class FiltroCategoriasComponent implements OnInit {
  categoria: any = [];
  categoria2: any = [];
  categoria3: any = [];
  level1 = null;
  level2 = null;
  level3 = null;
  @Output() url: EventEmitter<any> = new EventEmitter();
  constructor(private cmsService: CategoryService) {}

  async ngOnInit() {
    let consulta: any = await this.cmsService
      .obtieneCategoriasHeader()
      .toPromise();
    this.categoria = consulta.data;
  }

  changeSelect() {
    this.categoria2 = [];
    this.categoria3 = [];
    if (this.level1 != null) {
      let consulta: any = this.categoria.filter(
        (item: any) => item.url === this.level1
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
      let consulta: any = this.categoria2.filter(
        (item: any) => item.url === this.level2
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
