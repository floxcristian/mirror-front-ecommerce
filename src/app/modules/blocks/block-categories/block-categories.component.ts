import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-block-categories',
  templateUrl: './block-categories.component.html',
  styleUrls: ['./block-categories.component.scss'],
})
export class BlockCategoriesComponent implements OnInit {
  @Input() header = '';
  @Input() layout: 'classic' | 'compact' = 'classic';
  @Input() categories: any[] = [];

  constructor() {}
  ngOnInit() {
    for (let i = 0; i < this.categories.length; i++) {
      const categoria = this.categories[i];

      for (let j = 0; j < categoria.subcategories.length; j++) {
        const subcategoria = categoria.subcategories[j];
        let ruta = ['/', 'inicio', 'productos', subcategoria.title];
        subcategoria.urlSub = ruta;
      }
    }
  }
}
