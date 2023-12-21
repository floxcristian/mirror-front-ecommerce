// Angular
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
// Pipes
import { SlugifyPipe } from '../pipes/slugify.pipe';
// Models
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
// Services
import { SessionService } from '@core/states-v2/session.service';
import { CustomerAddressApiService } from '@core/services-v2/customer-address/customer-address-api.service';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  path = './inicio';
  modalBuscador: any = null;
  urlProduct: any[] = [];
  simpleDtOptions: any;

  constructor(
    public slugify: SlugifyPipe,
    public decimal: DecimalPipe,
    private router: Router,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly customerAddressService: CustomerAddressApiService
  ) {
    this.setDataTableBasic();
  }

  setDataTableBasic() {
    this.simpleDtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      retrieve: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
      },
      columnDefs: [
        {
          targets: 'no-sort',
          orderable: false,
        },
      ],
    };
  }

  product(
    id: string,
    nombre: string = 'Nombre del producto',
    paramsCategory: any = false
  ) {
    this.urlProduct = [
      '/',
      'inicio',
      'productos',
      'ficha',
      `${this.slugify.transform(nombre)}-${id}`,
    ];

    if (paramsCategory !== false) {
      if (paramsCategory.firstCategory) {
        this.urlProduct.push(paramsCategory.firstCategory);
      }
      if (paramsCategory.secondCategory) {
        this.urlProduct.push(paramsCategory.secondCategory);
      }

      if (paramsCategory.thirdCategory) {
        this.urlProduct.push(paramsCategory.thirdCategory);
      }
    }

    const url = this.router.createUrlTree(this.urlProduct);
    return url.toString();
  }

  url(url: string): string {
    return this.path + url;
  }

  limpiaAtributos(product: IArticleResponse): void {
    if (!product.attributes) {
      return;
    }
    const att = product.attributes.filter((val: any) => {
      if (val.nombre === 'CERTIFICADO PDF') {
        // product.certificadoPdf = val.valor;
      }

      // tslint:disable-next-line: triple-equals
      if (val.interno == '0' && val.nombre !== 'CALIDAD') {
        return val;
      }
    });

    // product.atributos = att;
  }

  getUrlImagenMiniatura(product: any) {
    if (Object.keys(product.images).length > 0) {
      if (product.images[0] == undefined) {
        if (product.images['250'].length > 0) return product.images['250'][0];
        else return 'assets/images/products/no-image-listado-2.jpg';
      } else {
        if (product.images[0]['250'].length > 0)
          return product.images[0]['250'][0];
        else return 'assets/images/products/no-image-listado-2.jpg';
      }
    } else return 'assets/images/products/no-image-listado-2.jpg';
  }

  getUrlImagenMiniatura150(product: any) {
    if (Object.keys(product.images).length > 0) {
      if (product.images[0] == undefined) {
        if (product.images['150'].length > 0) return product.images['150'][0];
        else return 'assets/images/products/no-image-listado-2.jpg';
      } else {
        if (product.images[0]['150'].length > 0)
          return product.images[0]['150'][0];
        else return 'assets/images/products/no-image-listado-2.jpg';
      }
    } else return 'assets/images/products/no-image-listado-2.jpg';
  }

  returnUrlNoImagen() {
    return 'assets/images/products/no-image-ficha.jpg';
  }

  setModalRefBuscador(modalRef: any) {
    this.modalBuscador = modalRef;
  }

  hideModalRefBuscador() {
    if (this.modalBuscador != null) {
      this.modalBuscador.hide();
    }
  }

  errorLoadImage($event: any) {
    $event.target.src = 'assets/images/products/no-imagen.jpg';
  }

  replaceSlash(str: any) {
    return str.replace(/\//g, '');
  }

  replaceAll(str: any, char: any, char2 = ' ') {
    return str.replace(char, char2);
  }

  setQuality(product: IArticleResponse) {
    if (
      typeof product !== 'undefined' &&
      typeof product.attributes !== 'undefined' &&
      product.attributes !== null
    ) {
      return (
        product.attributes.find((item: any) => item.nombre === 'CALIDAD') || {
          valor: 0,
        }
      );
    } else {
      return { valor: 0 };
    }
  }

  limpiarNombres(str: any) {
    if (str !== undefined) {
      return str.replace(/['"]+/g, '');
    } else return null;
  }
}
