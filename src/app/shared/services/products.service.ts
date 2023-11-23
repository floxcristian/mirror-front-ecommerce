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
    return this.http.get(environment.apiElastic2, { params });
  }

  buscaListadoProducto(params: any) {
    console.log('buscaListadoProducto [página productos/:sku]: ', params);
    return this.http.get(environment.apiElastic2, {
      params,
    });
  }

  buscaPorVimNum(params: any) {
    console.log('buscaPorVimNum: ', params);
    return this.http.get(`${environment.apiElastic}chassis`, { params });
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
    return this.http.get(environment.apiCatalogo + `ficha/${sku}`, { params });
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

  getHomePageB2b(params: any) {
    return this.http.get(environment.apiElastic + 'homepage-b2b', { params });
  }
  getHomePageB2c(params: any) {
    return this.http.get(environment.apiElastic + 'homepage-b2c', { params });
  }

  getEspeciales(params: any) {
    return this.http.get(environment.apiElastic + 'especiales', { params });
  }

  enviarCorreoSolicitudProductoSinStock(params: any) {
    return this.http.post(
      environment.urlNotificaciones + '/solicitudProductoSinStockNotificacion',
      params
    );
  }
}
