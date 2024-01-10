import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { environment } from '@env/environment';
import { CartService } from '../../../../../shared/services/cart.service';
import { isVacio } from '../../../../../shared/utils/utilidades';
import { ILeftSide, IRightSide } from '@core/models-v2/catalog/catalog-response.interface';

interface IAttributeTemp {
  valor: string;
}

interface IPlaneTemp {
  productos: {
    sku: any;
    url: string;
    tipo: any;
    precio: any;
    cantidad: any;
    cyber: any;
    producto: any;
    rut: any;
    precioEsp: any;
    imagenes: any[];
    precioEscala: any;
    preciosScal: any;
    atributos: IAttributeTemp[];
  };
}

@Component({
  selector: 'app-template-s',
  templateUrl: './page-pim-template-s.html',
  styleUrls: ['./page-pim-template-s.scss'],
})
export class PagePimTemplateS implements OnInit {
  // @Input() plana: IPlaneTemp = {} as IPlaneTemp;
  @Input() plana!: ILeftSide | IRightSide;
  @Input() tipo: any = '';
  @Input() iva: any = true;
  @Input() folio: any;
  @Input() minimo: any;

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

  constructor(public cart: CartService, private cd: ChangeDetectorRef) {}

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

    // this.plana.products.sku = this.plana.productos.producto; // utilizar product = sku
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
        this.precioAnterior = this.plana.products.precio;
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
    }
    this.preciosLista.forEach((element) => {
      element.precio = this.calculaIVA(element.precio);
    });
  }

  addToCart(producto: any): void {
    producto.sku = producto.producto;
    producto.images = [
      {
        150: [`https://images.implementos.cl/img/150/${producto.sku}-1.jpg`],
      },
    ];
    if (this.addingToCart) {
      return;
    }
    this.addingToCart = true;

    this.cart.add(producto, 1).subscribe({
      complete: () => {
        this.addingToCart = false;
        this.cd.markForCheck();
      },
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
}
