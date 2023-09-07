import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-template-menu-catalogo',
  templateUrl: './template-menu-catalogo.component.html',
  styleUrls: ['./template-menu-catalogo.component.scss']
})
export class TemplateMenuCatalogoComponent implements OnInit {
  @Input() tags: any;
  @Input() origen: any;
  @Input() nameOrigen: any;
  @Input() tipoCatalogo: any;
  @Input() tipoDispositivo: any;

  customOptions!: OwlOptions;
  constructor() {}

  async ngOnInit() {
    this.customOptions = {
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['<', '>'],
      responsive: {
        0: {
          items: 2
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 5
        }
      },
      nav: false
    };
  }

  irTag(index:any) {
    if (this.nameOrigen === 'ver-catalogo-flip') {
      if (this.tipoDispositivo !== 'smartphone') {
        this.origen.cambiarPaginaPreview(index * 2 - 2);
      } else {
        this.origen.cambiarPaginaPreview(index);
      }
    }
  }
}
