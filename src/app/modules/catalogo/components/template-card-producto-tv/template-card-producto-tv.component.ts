import { Component, OnInit, Input } from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({
  selector: 'app-template-card-producto-tv',
  templateUrl: './template-card-producto-tv.component.html',
  styleUrls: ['./template-card-producto-tv.component.scss'],
})
export class TemplateCardProductoTvComponent implements OnInit {
  @Input() layout: any

  colsRe!: number
  customOptions!: OwlOptions
  productos: any[] = []
  contenido!: []

  constructor() {}

  async ngOnInit() {
    this.contenido = this.layout.contenido
    const cols = this.layout.col

    let itemSet = 1
    if (cols === 8 || cols === 6) {
      itemSet = 2
    } else if (cols === 12) {
      itemSet = 3
    }

    this.customOptions = {
      items: itemSet,
      autoplay: true,
      autoplayTimeout: this.layout.intervalo,
      loop: true,
      margin: 0,
      mouseDrag: true,
      nav: false,
      dots: false,
      smartSpeed: 3000,
      navSpeed: 1000,
      autoWidth: true,
    }

    const total = this.contenido.length
    console.log('total', total, this.customOptions)

    if (this.layout.height === 'height:290px') {
      this.colsRe = 3

      const div = this.contenido.length / this.colsRe
      const corte = Math.round(div)

      this.productos.push({ arr: this.contenido.slice(0, corte) })
      this.productos.push({ arr: this.contenido.slice(corte, corte * 2) })
      this.productos.push({ arr: this.contenido.slice(corte * 2, total) })
    } else {
      this.colsRe = 2

      const div = this.contenido.length / this.colsRe
      const corte = Math.round(div)

      this.productos.push({ arr: this.contenido.slice(0, corte) })
      this.productos.push({ arr: this.contenido.slice(corte, total) })
    }
  }

  numSequence(): Array<number> {
    return Array(this.colsRe)
  }
}
