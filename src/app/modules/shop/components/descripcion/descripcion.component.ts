import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ProductsService } from '../../../../shared/services/products.service'

@Component({
  selector: 'app-descripcion',
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.scss'],
})
export class DescripcionComponent implements OnChanges {
  showDescription = false
  visible = false
  @Input() sku: any
  ficha: any[] = []
  constructor(private productService: ProductsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    await this.sku
    if (this.sku != null) {
      const consulta: any = await this.productService
        .getFicha(this.sku)
        .toPromise()
      this.ficha = consulta.data
      this.visible = consulta.data.length > 0
      this.configurar_descripcion()
    }
  }

  mostarDescripcion() {
    if (!this.showDescription) {
      this.showDescription = true
    } else {
      this.showDescription = false
    }
  }

  configurar_descripcion() {
    this.ficha.map((item: any) => {
      if (item.tipo == 'texto') {
        const separar: any = item.data.split('/n')
        let i = 0
        let html = ''
        separar.forEach((element: any) => {
          if (i == 0) {
            html = '<h5>' + element + '</h5><br/>'
          } else {
            html = html + element + '<br/>'
          }
          i = i + 1
        })
        item.data = html
      }
    })
  }
}
