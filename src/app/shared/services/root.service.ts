import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { Product } from '../interfaces/product'
import { SlugifyPipe } from '../pipes/slugify.pipe'
import { HttpClient } from '@angular/common/http'
import { DecimalPipe } from '@angular/common'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'
import { Usuario } from '../interfaces/login'
import { Router } from '@angular/router'
// import * as uuid from 'uuid/v4';
import { v4 as uuidv4 } from 'uuid'
import { PreferenciasCliente } from '../interfaces/preferenciasCliente'
import { LogisticsService } from './logistics.service'
import { isVacio } from '../utils/utilidades'

@Injectable({
  providedIn: 'root',
})
export class RootService {
  path = './inicio'
  modalBuscador: any = null
  urlProduct: any[] = []
  public simpleDtOptions: any

  constructor(
    public slugify: SlugifyPipe,
    public decimal: DecimalPipe,
    private http: HttpClient,
    private localS: LocalStorageService,
    private router: Router,
    private logisticsService: LogisticsService,
  ) {
    this.setDataTableBasic()
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
    }
  }

  product(
    id: string,
    nombre: string = 'Nombre del producto',
    paramsCategory: any = false,
  ) {
    this.urlProduct = [
      '/',
      'inicio',
      'productos',
      'ficha',
      `${this.slugify.transform(nombre)}-${id}`,
    ]

    if (paramsCategory !== false) {
      if (paramsCategory.firstCategory) {
        this.urlProduct.push(paramsCategory.firstCategory)
      }
      if (paramsCategory.secondCategory) {
        this.urlProduct.push(paramsCategory.secondCategory)
      }

      if (paramsCategory.thirdCategory) {
        this.urlProduct.push(paramsCategory.thirdCategory)
      }
    }

    const url = this.router.createUrlTree(this.urlProduct)
    return url.toString()
  }

  getDataSesionUsuario() {
    const data: Usuario = this.localS.get('usuario') as any

    const id = uuidv4()

    if (data == null) {
      const dataTemp: Usuario = {
        login_temp: true,
        rut: '0',
        _id: id,
        email: id,
        user_role: 'temp',
      }
      this.localS.set('usuario', dataTemp)
      return dataTemp
    } else {
      return data
    }
  }

  async getPreferenciasCliente() {
    let preferencias: PreferenciasCliente = this.localS.get(
      'preferenciasCliente',
    ) as any
    if (isVacio(preferencias)) {
      preferencias = {
        direccionDespacho: null,
        centroCosto: null,
        numeroSolicitud: null,
      }
    }
    if (isVacio(preferencias.direccionDespacho)) {
      const usuario = this.getDataSesionUsuario()
      const resp: any = await this.logisticsService
        .obtieneDireccionesCliente(usuario.rut)
        .toPromise()
      if (resp.data.length > 0) {
        preferencias.direccionDespacho = resp.data[0]
      }
    }
    this.localS.set('preferenciasCliente', preferencias)
    return preferencias
  }

  post(): string {
    return `${this.path}/blog/post-classic`
  }

  url(url: string): string {
    return this.path + url
  }

  public limpiaTextos(producto: Product) {
    producto.nombre = producto.nombre.replace(/(^"|"$)/g, '')

    return producto
  }

  limpiaAtributos(product: Product): void {
    if (product.atributos == null) {
      return
    }
    const att = product.atributos.filter((val: any) => {
      if (val.nombre === 'CERTIFICADO PDF') {
        product.certificadoPdf = val.valor
      }

      // tslint:disable-next-line: triple-equals
      if (val.interno == '0' && val.nombre !== 'CALIDAD') {
        return val
      }
    })

    product.atributos = att
  }

  public getUrlImagenMiniaturaWidget(sku: any) {
    return environment.urlFotowidgetProductos + `${sku}.jpg?alt=media`
  }

  public getUrlImagenMiniatura(product: any) {
    if (Object.keys(product.images).length > 0) {
      if (product.images[0] == undefined) {
        if (product.images['250'].length > 0) return product.images['250'][0]
        else return 'assets/images/products/no-image-listado-2.jpg'
      } else {
        if (product.images[0]['250'].length > 0)
          return product.images[0]['250'][0]
        else return 'assets/images/products/no-image-listado-2.jpg'
      }
    } else return 'assets/images/products/no-image-listado-2.jpg'
  }

  public getUrlImagenMiniatura150(product: any) {
    if (Object.keys(product.images).length > 0) {
      if (product.images[0] == undefined) {
        if (product.images['150'].length > 0) return product.images['150'][0]
        else return 'assets/images/products/no-image-listado-2.jpg'
      } else {
        if (product.images[0]['150'].length > 0)
          return product.images[0]['150'][0]
        else return 'assets/images/products/no-image-listado-2.jpg'
      }
    } else return 'assets/images/products/no-image-listado-2.jpg'
  }

  public requestUrlImagenMiniatura(sku: any) {
    const urlVerificaImagen =
      environment.urlFotoListadoProductos + `${sku}.jpg`
    return this.http.get(urlVerificaImagen)
  }

  public getUrlImagenFicha(sku: any) {
    return environment.urlFotoFichaProducto + `${sku}.jpg?alt=media`
  }

  public requestUrlImagenFicha(sku: any) {
    const urlVerificaImagen = environment.urlFotoFichaProducto + `${sku}.jpg`
    return this.http.get(urlVerificaImagen)
  }

  public returnUrlNoImagen() {
    return 'assets/images/products/no-image-ficha.jpg'
  }

  public setModalRefBuscador(modalRef: any) {
    this.modalBuscador = modalRef
  }

  public hideModalRefBuscador() {
    if (this.modalBuscador != null) {
      this.modalBuscador.hide()
    }
  }

  public getModalRefBuscador() {
    return this.modalBuscador
  }

  errorLoadImage($event: any) {
    $event.target.src = 'assets/images/products/no-imagen.jpg'
  }

  public replaceSlash(str: any) {
    return str.replace(/\//g, '')
  }

  public replaceAll(str: any, char: any, char2 = ' ') {
    return str.replace(char, char2)
  }

  public setQuality(product: Product) {
    if (
      typeof product !== 'undefined' &&
      typeof product.atributos !== 'undefined' &&
      product.atributos !== null
    ) {
      return (
        product.atributos.find((item: any) => item.nombre === 'CALIDAD') || {
          valor: 0,
        }
      )
    } else {
      return { valor: 0 }
    }
  }

  public limpiarNombres(str: any) {
    if (str !== undefined) {
      return str.replace(/['"]+/g, '')
    } else return null
  }
}
