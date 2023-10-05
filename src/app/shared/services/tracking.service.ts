import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(private http: HttpClient) {}

  searchOVstatus(OV: string) {
    return this.http.get(
      environment.apiImplementosLogistica + `seguimiento?ov=${OV}`,
    )
  }

  buscarEstadosOV(OV: string) {
    let consulta: any = this.http.get(
      environment.apiOms + 'ordenes-venta/listadoFiltrado/' + OV,
    )
    return consulta
  }

  DetalleOV(OV: string) {
    let consulta: any = this.http.get(
      environment.apiMobile + 'detallePedido?folio=' + OV,
    )
    return consulta
  }

  DetalleOVCliente(OV: string) {
    let url = environment.apiOms + 'ordenes-venta/listadoDetalleOV/' + OV
    let consulta = this.http.get(url)
    return consulta
  }

  recibo(ov: any) {
    let url = 'https://b2b-api.implementos.cl/api/logistica/respaldos/'
    return this.http.get(url + ov)
  }

  cargaProductos(ov: any) {
    let url = environment.apiImplementosCarro + 'productos?numero='
    return this.http.get(url + ov)
  }

  getClienteOv(params: any) {
    let url = environment.apiOms + 'oms/clienteOv'
    return this.http.post(url, params)
  }
}
