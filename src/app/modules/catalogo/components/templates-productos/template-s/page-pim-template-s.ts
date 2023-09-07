import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CartService } from '../../../../../shared/services/cart.service';
import { isVacio } from '../../../../../shared/utils/utilidades';

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
  @Input() plana: IPlaneTemp = {} as IPlaneTemp;
  @Input() tipo: any = '';
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

  constructor(public cart: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(this.folio);
    switch (this.tipo) {
      case 'Vendedor':
        this.carro = false;
        break;
      case 'Distribuidor':
        this.precios = false;
        this.carro = false;
        break;
    }

    this.plana.productos.sku = this.plana.productos.producto;
    if (this.plana.productos.tipo == 'producto' && this.precios) {
      // Precio 1
      let objPrecio = {
        desde: '1',
        hasta: '1',
        precio: this.plana.productos.precio,
      };
      if (
        this.plana.productos.rut == 0 &&
        this.plana.productos.precioEsp == 0
      ) {
        objPrecio.precio = this.plana.productos.precio;
      }
      if (
        this.plana.productos.rut != 0 &&
        this.plana.productos.precio != this.plana.productos.precioEsp
      ) {
        objPrecio.precio = this.plana.productos.precioEsp;
        this.precioEspecial = true;
      }

      if (this.plana.productos.precio == this.plana.productos.precioEsp) {
        objPrecio.precio = this.plana.productos.precio;
      }

      //Precio normal con dto.
      if (
        this.plana.productos.rut == 0 &&
        this.plana.productos.precio > this.plana.productos.precioEsp
      ) {
        this.precioAnterior = this.plana.productos.precio;
        objPrecio.precio = this.plana.productos.precioEsp;
        this.precioEspecial = true;
      }

      this.preciosLista.push(objPrecio);
      // Precio escala último y penúltimo
      if (this.plana.productos.precioEscala) {
        this.preciosEscala = this.plana.productos.preciosScal;
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
        this.plana.productos.precio =
          this.plana.productos.precio / (1 + this.IVA);
      }
    }
    return producto;
  }
}
