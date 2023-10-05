import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'
import { CartService } from '../../../../../shared/services/cart.service'

interface IAttributeTemp {
  valor: string
}

interface IPlaneTemp {
  productos: {
    sku: any
    url: string
    tipo: any
    precio: any
    cantidad: any
    cyber: any
    producto: any
    rut: any
    precioEsp: any
    imagenes: any[]
    precioEscala: any[]
    preciosScal: any
    atributos: IAttributeTemp[]
  }
}

@Component({
  selector: 'app-template-m',
  templateUrl: './page-pim-template-m.html',
  styleUrls: ['./page-pim-template-m.scss'],
})
export class PagePimTemplateM implements OnInit {
  @Input() plana: IPlaneTemp = {} as IPlaneTemp
  @Input() tipo: any = ''
  preciosEscala: any[] = []
  preciosLista: any[] = []
  addingToCart = false
  precioEspecial: boolean = false
  existeImagen1 = true
  existeImagen2 = true
  precios: boolean = true
  carro: boolean = true
  imagen: boolean = true
  ordenImg1 = 1
  ordenImg2 = 2
  ordenImg3 = 3
  visibleImg1 = true
  visibleImg2 = true
  visibleImg3 = true

  constructor(
    public cart: CartService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.ordenarIMG()
    this.quitarIMG()
    switch (this.tipo) {
      case 'Vendedor':
        this.carro = false
        break
      case 'Distribuidor':
        this.precios = false
        this.carro = false
        break
    }
    this.plana.productos.sku = this.plana.productos.producto
    //console.log(' this.plana.productos: ',  this.plana.productos);
    if (this.plana.productos.tipo == 'producto' && this.precios) {
      // Precio 1
      let objPrecio = {
        desde: '1',
        hasta: '1',
        precio: this.plana.productos.precio,
      }
      if (
        this.plana.productos.rut == 0 &&
        this.plana.productos.precioEsp == 0
      ) {
        objPrecio.precio = this.plana.productos.precio
      }
      if (
        this.plana.productos.rut != 0 &&
        this.plana.productos.precio != this.plana.productos.precioEsp
      ) {
        objPrecio.precio = this.plana.productos.precioEsp
        this.precioEspecial = true
      }
      if (
        this.plana.productos.rut != 0 &&
        this.plana.productos.precio != this.plana.productos.precioEsp
      ) {
        objPrecio.precio = this.plana.productos.precio
      }
      if (this.plana.productos.precio == this.plana.productos.precioEsp) {
        objPrecio.precio = this.plana.productos.precio
      }

      //Precio normal con dto.
      if (
        this.plana.productos.rut == 0 &&
        this.plana.productos.precio > this.plana.productos.precioEsp
      ) {
        objPrecio.precio = this.plana.productos.precio
        this.precioEspecial = true
      }

      this.preciosLista.push(objPrecio)

      // Precio escala último y penúltimo
      if (this.plana.productos.precioEscala) {
        this.preciosEscala = this.plana.productos.preciosScal
        let contador = this.preciosEscala.length
        if (contador >= 2) {
          this.preciosLista.push(this.preciosEscala[contador - 2])
          if (this.preciosEscala[contador - 1].hasta === 'y mas.') {
            this.preciosEscala[contador - 1].hasta =
              this.preciosEscala[contador - 1].desde
            this.preciosEscala[contador - 1].desde = 'Desde'
            this.preciosLista.push(this.preciosEscala[contador - 1])
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1])
          }
        }
        if (contador === 1) {
          if (this.preciosEscala[contador - 1].hasta === 'y mas.') {
            this.preciosEscala[contador - 1].hasta =
              this.preciosEscala[contador - 1].desde
            this.preciosEscala[contador - 1].desde = 'Desde'
            this.preciosLista.push(this.preciosEscala[contador - 1])
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1])
          }
        }
      }
    }
  }

  addToCart(producto: any): void {
    producto.sku = producto.producto
    producto.images = [
      {
        150: [`https://images.implementos.cl/img/150/${producto.sku}-1.jpg`],
      },
    ]
    if (this.addingToCart) {
      return
    }
    this.addingToCart = true

    this.cart.add(producto, 1).subscribe({
      complete: () => {
        this.addingToCart = false
        this.cd.markForCheck()
      },
    })
  }

  onImgError(img: any) {
    switch (img) {
      case 'img1':
        this.existeImagen1 = false
        break
      case 'img2':
        this.existeImagen2 = false
        break
    }
  }

  existeIMG() {
    //console.log('ERROR');
    this.imagen = false
  }

  ordenarIMG() {
    if (this.plana.productos.imagenes && this.plana.productos.imagenes[1]) {
      let imgs = this.plana.productos.imagenes[1]
      for (let i = 0; i <= imgs.length; i++) {
        if (imgs[i] == 1) {
          this.ordenImg1 = i + 1
        }
      }
      if (this.ordenImg1 == 1) {
        this.ordenImg2 = 2
        this.ordenImg3 = 3
        return
      }
      if (this.ordenImg1 == 2) {
        this.ordenImg2 = 1
        this.ordenImg3 = 3
        return
      }
      if (this.ordenImg1 == 3) {
        this.ordenImg2 = 1
        this.ordenImg3 = 2
        return
      }
    }
  }

  //PARCHE MEJORAR RENDIMEINTO
  quitarIMG() {
    if (this.plana.productos.imagenes && this.plana.productos.imagenes[0]) {
      let imgs = this.plana.productos.imagenes[0]
      for (let i = 0; i < imgs.length; i++) {
        if (!imgs[i]) {
          if (i == 0) {
            if (this.ordenImg1 == 1) {
              this.visibleImg1 = false
            }
            if (this.ordenImg2 == 1) {
              this.visibleImg2 = false
            }
            if (this.ordenImg3 == 1) {
              this.visibleImg3 = false
            }
          }
          if (i == 1) {
            if (this.ordenImg1 == 2) {
              this.visibleImg1 = false
            }
            if (this.ordenImg2 == 2) {
              this.visibleImg2 = false
            }
            if (this.ordenImg3 == 2) {
              this.visibleImg3 = false
            }
          }
          if (i == 2) {
            if (this.ordenImg1 == 3) {
              this.visibleImg1 = false
            }
            if (this.ordenImg2 == 3) {
              this.visibleImg2 = false
            }
            if (this.ordenImg3 == 3) {
              this.visibleImg3 = false
            }
          }
        }
      }
    }
  }
}
