import { Component, OnInit, Input } from '@angular/core'
import { ProductsService } from '../../services/products.service'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrls: ['./product-stock.component.scss'],
})
export class ProductStockComponent implements OnInit {
  codSku!: string
  stores: any[] = []
  loadingData = true
  @Input() modalRef!: BsModalRef

  @Input() set sku(value: any) {
    this.loadData(value)
  }

  storesDespacho = [
    'WEB-CD1', //ALMACEN WEB
    'CDD-CD1', //CENTRO DE DISTRIBUCION
  ]
  existenciaDespacho = false
  existenciaRetiro = false
  cantidadDespacho = 0
  cantidadRetiro = 0

  constructor(private productsService: ProductsService) {}

  ngOnInit() {}

  loadData(sku: any) {
    this.stores = []
    this.loadingData = true

    this.productsService.getStockProduct(sku).subscribe((r: any) => {
      this.loadingData = false
      this.cantidadDespacho = 0
      this.cantidadRetiro = 0
      r = r.filter(function (item: any) {
        return item.tienda !== 'EPYSA EQUIPOS LAMPA'
      })

      r = r.filter(function (item: any) {
        return item.tienda !== 'HUECHURABA'
      })

      for (let elem of r) {
        this.setIsDespachoDomicilio(elem)
        this.setNombreMostrar(elem)
      }

      this.stores = r
    })
  }

  setIsDespachoDomicilio(elem: any) {
    if (this.storesDespacho.includes(elem.id)) {
      elem.despacho = true
      this.cantidadDespacho = this.cantidadDespacho + parseInt(elem.cantidad)
    } else {
      elem.despacho = false
      this.cantidadRetiro = this.cantidadRetiro + parseInt(elem.cantidad)
    }
  }
  setNombreMostrar(elem: any) {
    if (elem.id == 'P MONTT2') {
      elem.tienda = elem.tienda.replace(' 2', '')
    }
    elem.tienda2 = elem.tienda.replace('RETIRO EN TIENDA ', '')
  }
}
