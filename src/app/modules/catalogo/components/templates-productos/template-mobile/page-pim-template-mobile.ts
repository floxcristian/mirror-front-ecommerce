import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@env/environment';
import { isVacio } from '../../../../../shared/utils/utilidades';
import { ILeftSide, IRightSide } from '@core/models-v2/catalog/catalog-response.interface';
import { CartService } from '@core/services-v2/cart.service';

@Component({
  selector: 'app-template-mobile',
  templateUrl: './page-pim-template-mobile.html',
  styleUrls: ['./page-pim-template-mobile.scss'],
})
export class PagePimTemplateMobile implements OnInit {
  @Input() plana!: ILeftSide | IRightSide;
  @Input() tipo: string = '';
  @Input() iva: any = true;
  @Input() folio = null;
  preciosEscala: any[] = [];
  preciosLista: any[] = [];
  addingToCart:boolean = false;
  precioEspecial: boolean = false;
  precios: boolean = true;
  carro: boolean = true;
  imagen: boolean = true;
  noTieneIMGPreferida: boolean = false;
  img:number = 1;
  esWeb: boolean = false;
  isVacio = isVacio;
  IVA = environment.IVA || 0.19;

  constructor(
    private cd: ChangeDetectorRef,
    //ServicesV2
    private readonly cartService:CartService
    ) {}

  ngOnInit() {
    this.comprobarIMGPreferida();
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

      if (this.plana.products.precio == this.plana.products.precioEsp) {
        objPrecio.precio = this.plana.products.precio;
      }
      //Precio normal con dto.
      if (
        this.plana.products.rut == '0' &&
        (this.plana.products.precio || 0) > (this.plana.products.precioEsp || 0)
      ) {
        objPrecio.precio = this.plana.products.precioEsp;
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
      this.preciosLista.forEach((element) => {
        element = this.calculaIVA(element);
      });
    }
    if (
      this.tipo === 'Web' ||
      this.tipo === 'Vendedor' ||
      this.tipo == 'Automatico'
    ) {
      this.esWeb = true;
    }
  }

  existeIMG() {
    this.imagen = false;
  }

  comprobarIMGPreferida() {
    if (this.plana.products.images) {
      if (this.plana.products.images[1]) {
        for (let i = 0; i < this.plana.products.images[1].length; i++) {
          if (this.plana.products.images[1][i] == 1) {
            this.img = i + 1;
          }
        }
      }
      if (
        !this.plana.products.images[1] &&
        this.plana.products.images[0]
      ) {
        for (let i = 0; i < this.plana.products.images[0].length; i++) {
          if (this.plana.products.images[0][i] == 1) {
            this.img = i + 1;
          }
        }
      }
    }
  }
  calculaIVA(producto: any) {
    if (!isVacio(this.iva)) {
      if (!this.iva) {
        producto.precio = producto.precio / (1 + this.IVA);
        this.plana.products.precio =
          (this.plana.products.precio || 0) / (1 + this.IVA);

        //producto.precioComun = producto.precioComun / (1 + this.IVA);
      }
    }
    return producto;
  }
  abrirEnlace(link: any, folio: any) {
    if (folio) window.open(link, '_blank');
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
  }
}
