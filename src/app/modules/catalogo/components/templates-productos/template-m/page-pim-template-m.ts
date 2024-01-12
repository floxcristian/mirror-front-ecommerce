import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ILeftSide, IRightSide } from '@core/models-v2/catalog/catalog-response.interface';
import { CartService } from '@core/services-v2/cart.service';

@Component({
  selector: 'app-template-m',
  templateUrl: './page-pim-template-m.html',
  styleUrls: ['./page-pim-template-m.scss'],
})
export class PagePimTemplateM implements OnInit {
  @Input() plana!: ILeftSide | IRightSide;
  @Input() tipo: string = '';
  preciosEscala: any[] = [];
  preciosLista: any[] = [];
  addingToCart: boolean = false;
  precioEspecial: boolean = false;
  existeImagen1: boolean = true;
  existeImagen2: boolean = true;
  precios: boolean = true;
  carro: boolean = true;
  imagen: boolean = true;
  ordenImg1:number = 1;
  ordenImg2:number = 2;
  ordenImg3:number = 3;
  visibleImg1: boolean = true;
  visibleImg2: boolean = true;
  visibleImg3: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    //ServicesV2
    private readonly cartService:CartService) {}

  ngOnInit() {
    this.ordenarIMG();
    this.quitarIMG();
    switch (this.tipo) {
      case 'Vendedor':
        this.carro = false;
        break;
      case 'Distribuidor':
        this.precios = false;
        this.carro = false;
        break;
    }
    this.plana.products.sku = this.plana.products.product;
    if (this.plana.products.type == 'producto' && this.precios) {
      // Precio 1
      let objPrecio = {
        desde: '1',
        hasta: '1',
        precio: this.plana.products.precio,
      };
      if (
        this.plana.products.rut == '0' &&
        this.plana.products.precioEsp == 0
      ) {
        objPrecio.precio = this.plana.products.precio;
      }
      if (
        this.plana.products.rut != '0' &&
        this.plana.products.precio != this.plana.products.precioEsp
      ) {
        objPrecio.precio = this.plana.products.precioEsp;
        this.precioEspecial = true;
      }
      if (
        this.plana.products.rut != '0' &&
        this.plana.products.precio != this.plana.products.precioEsp
      ) {
        objPrecio.precio = this.plana.products.precio;
      }
      if (this.plana.products.precio == this.plana.products.precioEsp) {
        objPrecio.precio = this.plana.products.precio;
      }

      //Precio normal con dto.
      if (
        this.plana.products.rut == '0' &&
        (this.plana.products.precio || 0) > (this.plana.products.precioEsp || 0)
      ) {
        objPrecio.precio = this.plana.products.precio;
        this.precioEspecial = true;
      }

      this.preciosLista.push(objPrecio);

      // Precio escala último y penúltimo
      if (this.plana.products.precioEscala) {
        this.preciosEscala = this.plana.products.preciosScal || [];
        let contador = this.preciosEscala.length;
        if (contador >= 2) {
          this.preciosLista.push(this.preciosEscala[contador - 2]);
          if (this.preciosEscala[contador - 1].hasta === 'y mas.') {
            this.preciosEscala[contador - 1].hasta =
              this.preciosEscala[contador - 1].desde;
            this.preciosEscala[contador - 1].desde = 'Desde';
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          }
        }
        if (contador === 1) {
          if (this.preciosEscala[contador - 1].hasta === 'y mas.') {
            this.preciosEscala[contador - 1].hasta =
              this.preciosEscala[contador - 1].desde;
            this.preciosEscala[contador - 1].desde = 'Desde';
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          }
        }
      }
    }
  }

  onImgError(img: any) {
    switch (img) {
      case 'img1':
        this.existeImagen1 = false;
        break;
      case 'img2':
        this.existeImagen2 = false;
        break;
    }
  }

  existeIMG() {
    this.imagen = false;
  }

  ordenarIMG() {
    if (this.plana.products.images && this.plana.products.images[1]) {
      let imgs = this.plana.products.images[1];
      for (let i = 0; i <= imgs.length; i++) {
        if (imgs[i] == 1) {
          this.ordenImg1 = i + 1;
        }
      }
      if (this.ordenImg1 == 1) {
        this.ordenImg2 = 2;
        this.ordenImg3 = 3;
        return;
      }
      if (this.ordenImg1 == 2) {
        this.ordenImg2 = 1;
        this.ordenImg3 = 3;
        return;
      }
      if (this.ordenImg1 == 3) {
        this.ordenImg2 = 1;
        this.ordenImg3 = 2;
        return;
      }
    }
  }

  //PARCHE MEJORAR RENDIMEINTO
  quitarIMG() {
    if (this.plana.products.images && this.plana.products.images[0]) {
      let imgs = this.plana.products.images[0];
      for (let i = 0; i < imgs.length; i++) {
        if (!imgs[i]) {
          if (i == 0) {
            if (this.ordenImg1 == 1) {
              this.visibleImg1 = false;
            }
            if (this.ordenImg2 == 1) {
              this.visibleImg2 = false;
            }
            if (this.ordenImg3 == 1) {
              this.visibleImg3 = false;
            }
          }
          if (i == 1) {
            if (this.ordenImg1 == 2) {
              this.visibleImg1 = false;
            }
            if (this.ordenImg2 == 2) {
              this.visibleImg2 = false;
            }
            if (this.ordenImg3 == 2) {
              this.visibleImg3 = false;
            }
          }
          if (i == 2) {
            if (this.ordenImg1 == 3) {
              this.visibleImg1 = false;
            }
            if (this.ordenImg2 == 3) {
              this.visibleImg2 = false;
            }
            if (this.ordenImg3 == 3) {
              this.visibleImg3 = false;
            }
          }
        }
      }
    }
  }

  isString(value:any){
    if(typeof value === 'string')
    return value
    else return ''
  }

  addToCart(producto: any): void {
    producto.images = [
      {
        150: [`https://images.implementos.cl/img/150/${producto.sku}-1.jpg`],
      },
    ];
    if (this.addingToCart) {
        return;
    }
    this.addingToCart = true;
    this.cartService.add(producto,1).finally(() =>{
        this.addingToCart = false;
        this.cd.markForCheck();
    })

    // producto.sku = producto.producto;
    // producto.images = [
    //   {
    //     150: [`https://images.implementos.cl/img/150/${producto.sku}-1.jpg`],
    //   },
    // ];
    // if (this.addingToCart) {
    //   return;
    // }
    // this.addingToCart = true;

    // this.cart.add(producto, 1).subscribe({
    //   complete: () => {
    //     this.addingToCart = false;
    //     this.cd.markForCheck();
    //   },
    // });
  }

}
