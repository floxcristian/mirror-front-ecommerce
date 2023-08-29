import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../interfaces/login';
import { RootService } from './root.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Flota } from '../interfaces/flota';
import { isVacio } from '../utils/utilidades';
import { Observable } from 'rxjs';
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

  buscarVentas(rut: any) {
    const call =
      environment.apiImplementosClientes +
      `ventas?rut=${rut}&ventasporPagina=10000`;
    return this.http.get(call);
  }

  buscarOvsGeneradas() {
    const estado = 'generado';
    const call =
      environment.apiImplementosCarro +
      `busquedaAll?estado=${estado}&carroPorPagina=100000&pagina=1`;
    return this.http.get(call);
  }

  confirmarOV(idCarro: any) {
    return this.http.post(environment.apiImplementosCarro + `confirmar`, {
      id: idCarro,
    });
  }

  cotizacionAOV(idCarro: any, usuario: any) {
    const data = {
      numero: idCarro,
      usuario,
    };

    return this.http.put(
      environment.apiImplementosCarro + `cotizacionov`,
      data
    );
  }

  /* Recuperar contraseña */

  recuperarPassword(data: any) {
    return this.http.post(environment.apiCMS + `users/recover-pass`, data);
  }

  updatePassword(data: any) {
    // console.log(data);

    const call = environment.apiCMS + `users/` + data.clientId;
    return this.http.patch(call, data);
  }

  updateIVA(data: any) {
    // console.log(data);

    const call = environment.apiImplementosClientes + `actualizarIva`;
    return this.http.put<ResponseApi>(call, data);
  }

  /* Admin Usuarios */

  buscarUsuarios(rut = '') {
    const call = environment.apiCMS + `users?rut=${rut}`;
    return this.http.get(call);
  }

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
      `${environment.apiImplementosClientes}direccionCRM`,
      request
    );
  }

  async updateProfile(data: any) {
    let consulta = null;
    const endpoint = `${environment.apiImplementosClientes}actualizarPerfil`;
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

    const url = `${environment.apiImplementosClientes}actualizarContrasenna`;
    consulta = await this.http.get(url, { params }).toPromise();

    return consulta;
  }
  async ValidarCorreo(data: any) {
    let consulta = null;
    const endpoint = `${environment.apiImplementosClientes}buscarCorreo`;
    const params = `?correo=${data}`;
    const url = `${endpoint}${params}`;
    consulta = await this.http.get(url).toPromise();

    return consulta;
  }

  /* Aux */

  buscarComunas() {
    const call = environment.apiImplementosLogistica + `comunas`;
    return this.http.get(call);
  }

  buscarGiros() {
    const call = environment.apiImplementosClientes + `giros`;
    return this.http.get(call);
  }

  /* home user's data */

  buscarVentasPeriodo(rut: any) {
    const call =
      environment.apiImplementosClientes + `ventasPeriodo?rut=${rut}`;
    return this.http.get(call);
  }

  graficoVentaValorada(request: any) {
    let consulta = null;

    const url = `${environment.apiImplementosClientes}graficos/ventaValorada?rutCliente=${request.rutCliente}&anio=${request.anio}`;
    consulta = this.http.get(url);

    return consulta;
  }

  graficoVentasPorUen(request: any) {
    let consulta = null;

    const url = `${environment.apiImplementosClientes}tablas/ventasPorUen?rutCliente=${request.rutCliente}`;
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

  buscarPendientesEntrega(rut: any) {
    const call =
      environment.apiImplementosClientes + `pendienteentrega?rut=${rut}`;
    return this.http.get(call);
  }

  buscarSaldo(rut: any) {
    const call = environment.apiImplementosClientes + `saldo?rut=${rut}`;
    return this.http.get(call);
  }

  buscarFacturas(rut: any) {
    const call = environment.apiImplementosClientes + `facturas?rut=${rut}`;
    return this.http.get(call);
  }

  register(data: any) {
    return this.http.post(environment.apiImplementosClientes + `nuevo`, data);
  }

  registerb2b(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `nuevob2b`,
      data
    );
  }
  validateCustomer(rut: any) {
    return this.http.get(environment.apiImplementosClientes + `rut?rut=${rut}`);
  }

  validateCustomerb2b(rut: any) {
    return this.http.get(
      environment.apiImplementosClientes + `rutb2b?rut=${rut}`
    );
  }
  getDataClient(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `GetDatosCliente`,
      data
    );
  }

  getCustomerDebt(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `deuda/listado`,
      data
    );
  }

  generatePayment(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `deuda/generaPago`,
      data
    );
  }

  // carro de compra
  async get_carroComprarb2c(rut: string) {
    let consulta = null;
    const url = `${environment.apiImplementosCarro}carrob2c?rut=${rut}`;
    consulta = await this.http.get(url).toPromise();
    return consulta;
  }

  getPreciosPorRut(pagina: number, preciosPorPagina: number, sucursal: string) {
    const usuario: Usuario = this.localS.get('usuario');
    const params: any = {
      rut: usuario.rut,
      sucursal,
    };

    if (pagina != null && preciosPorPagina != null) {
      params['pagina'] = pagina.toString();
      params['preciosPorPagina'] = preciosPorPagina.toString();
    }

    return this.http.get(
      `${environment.apiImplementosClientes}listaPreciosPorRut`,
      {
        params,
      }
    );
  }

  getIndicadoresEconomicos() {
    return this.http.get(
      environment.apiImplementosClientes + `indicadoresEconomicos`
    );
  }

  getBusquedasVin(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiImplementosClientes + `busquedasVin?rutCliente=${rut}`
    );
  }

  getFlota(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiImplementosClientes + `flota?rutCliente=${rut}`
    );
  }

  setBusquedaVin(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiImplementosClientes + `busquedaVin`,
      request
    );
  }

  setFlota(request: any) {
    return this.http.post(
      environment.apiImplementosClientes + `flota`,
      request
    );
  }

  setConcurso(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `concurso`,
      data
    );
  }

  setCyberday(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `ciberday`,
      data
    );
  }

  setFormularioCyber(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `formularioCyber`,
      data
    );
  }

  setDevolucion(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `devolucion`,
      data
    );
  }

  setConcursoGiftCard(data: any) {
    return this.http.post(
      environment.apiImplementosClientes + `concursoGiftcard`,
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
    return this.http.delete(
      environment.apiImplementosClientes + `busquedaVin`,
      options
    );
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
    return this.http.delete(
      environment.apiImplementosClientes + `flota`,
      options
    );
  }

  updateFlota(request: any) {
    return this.http.put(environment.apiImplementosClientes + `flota`, request);
  }

  getVehiculo(chassisPatente: string) {
    const httpParams = new HttpParams().set('chasis_patente', chassisPatente);

    return this.http.get(environment.apiImplementosClientes + `vehiculo`, {
      params: httpParams,
    });
  }

  getListaArticulosFavoritos(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiImplementosClientes + `favoritos/lista?rut=${rut}`
    );
  }

  setListaArticulosFavoritos(
    nombre: string,
    rut: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiImplementosClientes + `favoritos/lista`,
      { nombre, rut }
    );
  }

  setArticulosFavoritos(
    sku: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiImplementosClientes + `favoritos/sku/${idLista}`,
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
      environment.apiImplementosClientes + `favoritos/sku/${idLista}`,
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
      environment.apiImplementosClientes + `favoritos/sku`,
      options
    );
  }

  updateListaArticulosFavoritos(
    nombre: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiImplementosClientes + `favoritos/lista/${idLista}`,
      { nombre, rut }
    );
  }

  predeterminadaListaArticulosFavoritos(
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiImplementosClientes +
        `favoritos/lista/${idLista}/predeterminada`,
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
      environment.apiImplementosClientes + `favoritos/lista/${idLista}`,
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
      environment.apiImplementosClientes + url,
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
    return this.http.post<ResponseApi>(
      environment.apiImplementosClientes + url,
      request
    );
  }

  async cargaFavoritosLocalStorage(rut: string) {
    let favoritos: ArticuloFavorito;
    const resp: ResponseApi | undefined = await this.getListaArticulosFavoritos(
      rut
    ).toPromise();
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
      environment.apiImplementosClientes + `centroCosto?rut=${rut}`
    );
  }

  setCentroCosto(request: any) {
    return this.http.post(
      environment.apiImplementosClientes + `centroCosto`,
      request
    );
  }

  updateCentroCosto(
    nombre: string,
    rut: string,
    idCentro: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiImplementosClientes + `centroCosto/${idCentro}`,
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
      environment.apiImplementosClientes + `centroCosto/${idCentro}`,
      options
    );
  }

  getDominiosFrecuentes(): Observable<Dominios> {
    return this.http.get<Dominios>(
      `${environment.apiImplementosClientes}dominios`
    );
  }

  getCargosContacto(): Observable<CargosContactoResponse> {
    return this.http.get<CargosContactoResponse>(
      `${environment.apiImplementosClientes}filtros/cargosContacto`
    );
  }

  getTiposContacto(): Observable<TiposContactoResponse> {
    return this.http.get<TiposContactoResponse>(
      `${environment.apiImplementosClientes}filtros/tiposContacto`
    );
  }

  actualizaDireccion(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiImplementosClientes}direccionCRM`,
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
      `${environment.apiImplementosClientes}direccionCRM/${rutCliente}/${recid}`,
      options
    );
  }

  nuevoContacto(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${environment.apiImplementosClientes}contactoCRM`,
      request
    );
  }

  actualizaContacto(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiImplementosClientes}contactoCRM`,
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
      `${environment.apiImplementosClientes}contactoCRM/${rutCliente}/${contactoId}`,
      options
    );
  }

  getContactos(params: any) {
    return this.http.post(
      environment.apiImplementosClientes + 'filtros/ContactosCompradorb2b',
      params
    );
  }

  getBloqueo(rutCliente: string) {
    return this.http.get(
      `${environment.apiImplementosClientes}bloqueo?rut=${rutCliente}`
    );
  }
}
