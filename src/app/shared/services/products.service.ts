// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Services
import { GeoLocationService } from './geo-location.service';
import { RootService } from './root.service';
// Interfaces
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlApi = environment.apiCatalogo;

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
      environment.apiShoppingCart + `stockb2b?sku=${sku}&tipo=2`
    );
  }

  getdisponibilidadSku(sku: any) {
    return this.http.get(
      environment.apiShoppingCart + `stockficha?sku=${sku}`
    );
  }

  obtieneDetalleProducto(sku: any, params: any = null) {
    return this.http.get(this.urlApi + `ficha/${sku}`, { params });
  }

  getRecommendedProductsList(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCatalogo + 'productosasugerir',
      { params }
    );
  }

  getMatrixProducts(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCatalogo + 'matrizproducto',
      { params }
    );
  }

  getRelatedProducts(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCatalogo + 'relacionadoproducto',
      { params }
    );
  }
  getPropularProducts(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCatalogo + 'popularesproducto',
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
}
