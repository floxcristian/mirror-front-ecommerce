// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '../../../environments/environment';
// Services
import { RootService } from './root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isVacio } from '../utils/utilidades';
// Interfaces
import { Usuario } from '../interfaces/login';
import { Flota } from '../interfaces/flota';
import { ResponseApi } from '../interfaces/response-api';
import { ArticuloFavorito } from '../interfaces/articuloFavorito';
import { Dominios } from '../interfaces/dominios';
import { CargosContactoResponse } from '../interfaces/cargoContacto';
import { TiposContactoResponse } from '../interfaces/tiposContacto';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
    private root: RootService,
    private localS: LocalStorageService
  ) {}

  buscarOvsGeneradas() {
    const estado = 'generado';
    const call =
      environment.apiShoppingCart +
      `busquedaAll?estado=${estado}&carroPorPagina=100000&pagina=1`;
    return this.http.get(call);
  }

  confirmarOV(idCarro: any) {
    return this.http.post(environment.apiShoppingCart + `confirmar`, {
      id: idCarro,
    });
  }

  cotizacionAOV(idCarro: any, usuario: any) {
    const data = {
      numero: idCarro,
      usuario,
    };

    return this.http.put(environment.apiShoppingCart + `cotizacionov`, data);
  }

  /* Recuperar contraseña */

  recuperarPassword(data: any) {
    return this.http.post(environment.apiCMS + `users/recover-pass`, data);
  }

  updatePassword(data: any) {
    const call = environment.apiCMS + `users/` + data.clientId;
    return this.http.patch(call, data);
  }

  updateIVA(data: any): Observable<ResponseApi> {
    const call = environment.apiCustomer + `actualizarIva`;
    return this.http.put<ResponseApi>(call, data);
  }

  /* Admin Usuarios */

  buscarUsuario(id: string) {
    const call = environment.apiCMS + `users/${id}`;
    return this.http.get(call);
  }

  crearUsuario(data: any) {
    const call = environment.apiCMS + `users/ingresar`;
    return this.http.post(call, data);
  }

  registrarUsuario(data: any) {
    const call = environment.apiCMS + `users/register`;
    return this.http.post(call, data);
  }

  updateUsuario(data: any) {
    const call = environment.apiCMS + `users/` + data._id;
    return this.http.patch(call, data);
  }

  deleteUsuario(data: any) {
    const call = environment.apiCMS + `users/` + data._id;
    return this.http.delete(call, data);
  }

  addAdreess(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${environment.apiCustomer}direccionCRM`,
      request
    );
  }

  async updateProfile(data: any) {
    let consulta = null;
    const endpoint = `${environment.apiCustomer}actualizarPerfil`;
    const params = `?rut=${data.rut}&nombre=${data.nombre}&apellido=${data.apellido}&correo=${data.correo}&telefono=${data.telefono}`;
    const url = `${endpoint}${params}`;
    consulta = await this.http.get(url).toPromise();

    return consulta;
  }

  async changePassword(data: any) {
    let consulta = null;
    const usuario: Usuario = this.root.getDataSesionUsuario();
    const params: any = {
      correo: usuario.username,
      passActual: data.password,
      passNueva: data.pwd,
    };

    const url = `${environment.apiCustomer}actualizarContrasenna`;
    consulta = await this.http.get(url, { params }).toPromise();

    return consulta;
  }

  async ValidarCorreo(data: any) {
    let consulta = null;
    const endpoint = `${environment.apiCustomer}buscarCorreo`;
    const params = `?correo=${data}`;
    const url = `${endpoint}${params}`;
    consulta = await this.http.get(url).toPromise();

    return consulta;
  }

  /* Aux */

  buscarComunas() {
    const call = environment.apiLogistic + `comunas`;
    return this.http.get(call);
  }

  buscarGiros() {
    const call = environment.apiCustomer + `giros`;
    return this.http.get(call);
  }

  /* home user's data */
  graficoVentaValorada(request: any) {
    let consulta = null;

    const url = `${environment.apiCustomer}graficos/ventaValorada?rutCliente=${request.rutCliente}&anio=${request.anio}`;
    consulta = this.http.get(url);

    return consulta;
  }

  graficoVentasPorUen(request: any) {
    let consulta = null;

    const url = `${environment.apiCustomer}tablas/ventasPorUen?rutCliente=${request.rutCliente}`;
    let params = '';
    if (!isVacio(request.anio)) {
      params = params + `&anio=${request.anio}`;
    }
    if (!isVacio(request.mes)) {
      params = params + `&mes=${request.mes}`;
    }
    consulta = this.http.get(url + params);

    return consulta;
  }

  buscarSaldo(rut: any) {
    const call = environment.apiCustomer + `saldo?rut=${rut}`;
    return this.http.get(call);
  }

  buscarFacturas(rut: any) {
    const call = environment.apiCustomer + `facturas?rut=${rut}`;
    return this.http.get(call);
  }

  register(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `nuevo`,
      data
    );
  }

  registerb2b(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `nuevob2b`,
      data
    );
  }
  validateCustomer(rut: any) {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `rut?rut=${rut}`
    );
  }

  validateCustomerb2b(rut: any) {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `rutb2b?rut=${rut}`
    );
  }
  getDataClient(data: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `GetDatosCliente`,
      data
    );
  }

  getCustomerDebt(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `deuda/listado`,
      data
    );
  }

  generatePayment(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `deuda/generaPago`,
      data
    );
  }

  // carro de compra
  getBusquedasVin(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `busquedasVin?rutCliente=${rut}`
    );
  }

  getFlota(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `flota?rutCliente=${rut}`
    );
  }

  setBusquedaVin(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `busquedaVin`,
      request
    );
  }

  setFlota(request: any) {
    return this.http.post(environment.apiCustomer + `flota`, request);
  }

  setConcurso(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `concurso`,
      data
    );
  }

  setCyberday(data: any) {
    return this.http.post(environment.apiCustomer + `ciberday`, data);
  }

  setFormularioCyber(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `formularioCyber`,
      data
    );
  }

  setDevolucion(data: any) {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `devolucion`,
      data
    );
  }

  setConcursoGiftCard(data: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `concursoGiftcard`,
      data
    );
  }

  deleteBusquedaVin(busqueda: Flota) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        idFlota: busqueda._id,
      },
    };
    return this.http.delete(environment.apiCustomer + `busquedaVin`, options);
  }

  deleteFlota(flota: Flota) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        idFlota: flota._id,
      },
    };
    return this.http.delete(environment.apiCustomer + `flota`, options);
  }

  updateFlota(request: any) {
    return this.http.put(environment.apiCustomer + `flota`, request);
  }

  getVehiculo(chassisPatente: string) {
    const httpParams = new HttpParams().set('chasis_patente', chassisPatente);

    return this.http.get<ResponseApi>(environment.apiCustomer + `vehiculo`, {
      params: httpParams,
    });
  }

  getListaArticulosFavoritos(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `favoritos/lista?rut=${rut}`
    );
  }

  setListaArticulosFavoritos(
    nombre: string,
    rut: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `favoritos/lista`,
      { nombre, rut }
    );
  }

  setArticulosFavoritos(
    sku: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `favoritos/sku/${idLista}`,
      { sku, rut }
    );
  }

  deleteArticulosFavoritos(
    sku: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        sku,
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/sku/${idLista}`,
      options
    );
  }

  deleteTodosArticulosFavoritos(
    sku: string,
    rut: string
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        sku,
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/sku`,
      options
    );
  }

  updateListaArticulosFavoritos(
    nombre: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}`,
      { nombre, rut }
    );
  }

  predeterminadaListaArticulosFavoritos(
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}/predeterminada`,
      { rut }
    );
  }

  deleteListaArticulosFavoritos(
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}`,
      options
    );
  }

  setArticulosFavoritosMasivo(
    formData: FormData,
    idLista: string
  ): Observable<ResponseApi> {
    let url: string;
    if (isVacio(idLista)) {
      url = 'favoritos/excel';
    } else {
      url = `favoritos/excel/${idLista}`;
    }
    return this.http.post<ResponseApi>(
      environment.apiCustomer + url,
      formData
    );
  }

  setArticulosFavoritosUnitario(
    request: any,
    idLista: string
  ): Observable<ResponseApi> {
    let url: string;
    if (isVacio(idLista)) {
      url = 'favoritos/skus';
    } else {
      url = `favoritos/skus/${idLista}`;
    }
    return this.http.post<ResponseApi>(environment.apiCustomer + url, request);
  }

  async cargaFavoritosLocalStorage(rut: string) {
    let favoritos: ArticuloFavorito;
    const resp: ResponseApi | undefined =
      await this.getListaArticulosFavoritos(rut).toPromise();
    if (resp?.data.length > 0) {
      favoritos = resp?.data[0];

      this.localS.set('favoritos', favoritos);
    } else {
      this.localS.set('favoritos', {
        _id: 0,
        rut,
        listas: [],
      });
    }
  }

  getCentrosCosto(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `centroCosto?rut=${rut}`
    );
  }

  setCentroCosto(request: any) {
    return this.http.post(environment.apiCustomer + `centroCosto`, request);
  }

  updateCentroCosto(
    nombre: string,
    rut: string,
    idCentro: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `centroCosto/${idCentro}`,
      { nombre, rut }
    );
  }

  deleteCentroCosto(rut: string, idCentro: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        rut,
      },
    };
    return this.http.delete(
      environment.apiCustomer + `centroCosto/${idCentro}`,
      options
    );
  }

  getDominiosFrecuentes(): Observable<Dominios> {
    return this.http.get<Dominios>(`${environment.apiCustomer}dominios`);
  }

  getCargosContacto(): Observable<CargosContactoResponse> {
    return this.http.get<CargosContactoResponse>(
      `${environment.apiCustomer}filtros/cargosContacto`
    );
  }

  actualizaDireccion(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiCustomer}direccionCRM`,
      request
    );
  }

  eliminaDireccion(
    request: any,
    rutCliente: string,
    recid: number
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: request,
    };
    return this.http.delete<ResponseApi>(
      `${environment.apiCustomer}direccionCRM/${rutCliente}/${recid}`,
      options
    );
  }

  nuevoContacto(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${environment.apiCustomer}contactoCRM`,
      request
    );
  }

  actualizaContacto(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiCustomer}contactoCRM`,
      request
    );
  }

  eliminaContacto(
    request: any,
    rutCliente: string,
    contactoId: string
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: request,
    };
    return this.http.delete<ResponseApi>(
      `${environment.apiCustomer}contactoCRM/${rutCliente}/${contactoId}`,
      options
    );
  }

  getContactos(params: any) {
    return this.http.post(
      environment.apiCustomer + 'filtros/ContactosCompradorb2b',
      params
    );
  }

  getBloqueo(rutCliente: string) {
    return this.http.get(
      `${environment.apiCustomer}bloqueo?rut=${rutCliente}`
    );
  }
}
