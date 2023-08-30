import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GeoLocationService } from './geo-location.service';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlApi = environment.apiImplementosCatalogo;

  constructor(
    private http: HttpClient,
    private root: RootService,
    private geoLocationService: GeoLocationService
  ) {}

  buscarProductosElactic(texto: any) {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const usuario = this.root.getDataSesionUsuario();

    const params: any = {
      word: texto,
      sucursal,
      rut: usuario.rut,
    };
    return this.http.get(environment.apiElastic2 + `-web`, { params });
  }

  buscaListadoProducto(params: any) {
    return this.http.get(environment.apiElastic2 + '-web', {
      params,
    });
  }

  buscaPorVimNum(params: any) {
    return this.http.get(environment.apiElastic2 + '/chassis', { params });
  }

  getStockProduct(sku: any) {
    /* se agrega tipo 2 para que muestre el stock de seguridad */
    return this.http.get(
      environment.apiImplementosCarro + `stockb2b?sku=${sku}&tipo=2`
    );
  }

  getdisponibilidadSku(sku: any) {
    return this.http.get(
      environment.apiImplementosCarro + `stockficha?sku=${sku}`
    );
  }

  obtieneDetalleProducto(sku: any, params: any = null) {
    return this.http.get(this.urlApi + `catalogo/ficha/${sku}`, { params });
  }

  obtieneProducto(sku: any, params: any = null) {
    let consulta = null;
    consulta = this.http.get(this.urlApi + `catalogo/ficha/${sku}`, { params });
    return consulta;
  }
  getRecommendedProducts(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/recomendadoproducto',
      { params }
    );
  }

  getRecommendedProductsList(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/productosasugerir',
      { params }
    );
  }

  getMatrixProducts(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/matrizproducto',
      { params }
    );
  }

  getRelatedProducts(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/relacionadoproducto',
      { params }
    );
  }

  getRelatedProductsFromList(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/relacionadoproducto',
      { params }
    );
  }

  getPropularProducts(params: any) {
    return this.http.get(
      environment.apiImplementosCatalogo + 'catalogo/popularesproducto',
      { params }
    );
  }

  getHomePage(params: any) {
    return this.http.get(environment.apiElastic + 'homepageCms', { params });
  }

  getHomePageB2b(params: any) {
    return this.http.get(environment.apiElastic + 'homepage-b2b', { params });
  }

  getEspeciales(params: any) {
    return this.http.get(environment.apiElastic + 'especiales', { params });
  }

  getFicha(sku: any) {
    return this.http.get(
      environment.apiCMS + 'products/descripcion-ficha?sku=' + sku
    );
  }

  buscarporPrecio(params: any) {
    return this.http.get(environment.apiElastic, { params });
  }

  subir_imagen(files: any) {
    let fd = new FormData();
    fd.append('file', files.file);
    fd.append('tipo', files.tipo);

    var call = `${environment.apiImplementosCatalogo}catalogo/subirImagen`;

    return this.http.post(call, fd);
  }
}
