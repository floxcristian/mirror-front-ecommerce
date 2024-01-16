import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { environment } from '@env/environment';
import { isVacio } from '../../../../../shared/utils/utilidades';
import { ILeftSide, IRightSide } from '@core/models-v2/catalog/catalog-response.interface';
import { CartService } from '@core/services-v2/cart.service';

@Component({
  selector: 'app-template-s',
  templateUrl: './page-pim-template-s.html',
  styleUrls: ['./page-pim-template-s.scss'],
})
export class PagePimTemplateS implements OnInit {
  @Input() plana!: ILeftSide | IRightSide;
  @Input() tipo: string = '';
  @Input() iva: any = true;
  @Input() folio: any;

  precioAnterior!: any;
  preciosEscala: any[] = [];
  preciosLista: any[] = [];
  addingToCart = false;
  precioEspecial: boolean = false;
  precios: boolean = true;
  carro: boolean = true;
  imagen: boolean = true;
  isVacio = isVacio;
  IVA = environment.IVA || 0.19;

  constructor(
    private cd: ChangeDetectorRef,
    //ServicesV2
    private readonly cartService:CartService
  ) {}

  ngOnInit() {
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
        fromQuantity: '1',
        toQuantity: '1',
        price: this.plana.products.precio,
      };
      if (
        this.plana.products.rut == '0' &&
        this.plana.products.precioEsp == 0
      ) {
        objPrecio.price = this.plana.products.precio;
      }
      if (
        this.plana.products.rut != '0' &&
        this.plana.products.precio != this.plana.products.precioEsp
      ) {
        objPrecio.price = this.plana.products.precioEsp;
        this.precioEspecial = true;
      }

      if (this.plana.products.precio == this.plana.products.precioEsp) {
        objPrecio.price = this.plana.products.precio;
      }

      //Precio normal con dto.
      if (
        this.plana.products.rut == '0' &&
        (this.plana.products.precio || 0) > (this.plana.products.precioEsp || 0)
      ) {
        this.precioAnterior = this.plana.products.precio;
        objPrecio.price = this.plana.products.precioEsp;
        this.precioEspecial = true;
      }

      this.preciosLista.push(objPrecio);
      // Precio escala último y penúltimo
      if (this.plana.products.precioEscala) {
        this.preciosEscala = this.plana.products.preciosScal || [];
        let contador = this.preciosEscala.length;
        if (contador >= 2) {
          this.preciosLista.push(this.preciosEscala[contador - 2]);
          if (this.preciosEscala[contador - 1].toQuantity === 'y mas.') {
            this.preciosEscala[contador - 1].toQuantity =
              this.preciosEscala[contador - 1].fromQuantity;
            this.preciosEscala[contador - 1].fromQuantity = 'Desde';
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          }
        }
        if (contador === 1) {
          if (this.preciosEscala[contador - 1].toQuantity === 'y mas.') {
            this.preciosEscala[contador - 1].toQuantity =
              this.preciosEscala[contador - 1].fromQuantity;
            this.preciosEscala[contador - 1].fromQuantity = 'Desde';
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          } else {
            this.preciosLista.push(this.preciosEscala[contador - 1]);
          }
        }
      }
    }
    this.preciosLista.forEach((element) => {
      element.precio = this.calculaIVA(element.precio);
    });
  }

  existeIMG() {
    this.imagen = false;
  }
  calculaIVA(producto: any) {
    if (!isVacio(this.iva)) {
      if (!this.iva) {
        producto = producto / (1 + this.IVA);
        this.plana.products.precio =
          (this.plana.products.precio || 0) / (1 + this.IVA);
      }
    }
    return producto;
  }
  ngOnChanges(changes: SimpleChanges): void {}

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
