import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TransBankToken, PaymentMethod } from '../interfaces/payment-method';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private close$: Subject<any> = new Subject();
  readonly closemodal$: Observable<any> = this.close$.asObservable();
  private bancokhipu$: Subject<any> = new Subject();
  readonly banco$: Observable<any> = this.bancokhipu$.asObservable();
  constructor(
    private http: HttpClient,
    private _ToastrService: ToastrService
  ) {}
  /**
   * @author Sebastian Aracena Aguirre
   * @description al seleccionar la opcion "mi banco" de Kiphu entrega la lista de bancos entregados por la empresa.
   * @param no hay parametros
   */
  async listaBancoKhipu() {
    let response: any;

    let url = `${environment.apiImplementosPagos}Bancokhipu`;
    response = await this.http.get(url).toPromise();
    if (response.error)
      this._ToastrService.warning(
        'No ha sido posible entregar las listas de bancos!!'
      );

    return response;
  }

  /**
   * @author Sebastian Aracena Aguirre
   * @description funcion para comenzar el pago de Khipu.
   * @param params  este obtiene el id_banco, nombre del banco, nombre usuario y correo
   *
   */
  async createTransKhipu(params: any) {
    let response: any;

    try {
      let url = `${environment.apiImplementosPagos}khipu`;
      let consulta: any = await this.http.post(url, { params }).toPromise();

      consulta && !consulta.error && consulta.data && consulta.data.payment_url
        ? (response = consulta.data)
        : this._ToastrService.warning(
            'No ha sido posible iniciar la transaccion con Khipu!!'
          );
    } catch (e) {
      this._ToastrService.warning(
        'No ha sido posible iniciar la transaccion con Khipu!!'
      );
      console.log('No fue posible iniciar transaccion', e);
      this.sendEmailError(e);
    }
    return response;
  }

  /**
   * @author Sebastian Aracena Aguirre
   * @description al seleccionar la opcion "mi banco" de Kiphu entrega la lista de bancos entregados por la empresa.
   * @param no hay parametros
   */
  Verificar_pagoKhipu(params: any) {
    return this.http.get(
      environment.apiImplementosPagos +
        'verificar_pago_khipu?buy_order=' +
        params.buy_order +
        '&id_carro=' +
        params.id_carro
    );
  }

  Confirmar_pagoKhipu(params: any) {
    return this.http.get(
      environment.apiImplementosPagos +
        'confirmacion_khipu?buy_order=' +
        params.buy_order +
        '&id_carro=' +
        params.id_carro
    );
  }

  ReiniciarCarro(id_carro: any): any {
    return this.http.get(
      environment.apiImplementosPagos +
        'reiniciar_carro_khipu?id_carro=' +
        id_carro
    );
  }

  async createTransBankTransaccion(params: any) {
    let response!: TransBankToken;
    try {
      let url = `${environment.apiImplementosPagos}transbank/crearTransaccion`;
      let consulta: any = await this.http.post(url, { params }).toPromise();
      consulta && !consulta.error && consulta.data && consulta.data.token
        ? (response = consulta.data)
        : this._ToastrService.warning(
            'No ha sido posible iniciar la transaccion con Transbank!!'
          );
    } catch (e) {
      this._ToastrService.warning(
        'No ha sido posible iniciar la transaccion con Transbank!!'
      );
      console.log('No fue posible iniciar transaccion', e);
      this.sendEmailError(e);
    }
    return response;
  }

  getVoucherData(params: any) {
    return this.http.get(
      environment.apiImplementosPagos + 'webpay/getDataComprobante',
      { params }
    );
  }

  async sendEmailError(
    msg: any,
    asunto: string = `[B2B ${window.location.hostname}] Error - ha ocurrido un error intentando conectar a api pagos desde el b2b`
  ) {
    //console.log('tipo dato', typeof msg);
    try {
      let parametros = {
        para: 'claudio.montoya@implementos.cl,ricardo.rojas@implementos.cl,clemente.silva@implementos.cl',
        asunto: asunto,
        html: typeof msg === 'string' ? msg : JSON.stringify(msg),
      };

      this.http
        .post(`${environment.apiImplementosCarro}enviarmail`, parametros)
        .toPromise();
    } catch (e) {
      console.log(
        'Ha ocurrido un error intentando informar sobre problema',
        e
      );
    }
  }

  /**
   * @author José Espinoza
   * @description Cuando el cliente inicia pago en mercado pago y presiona "Anular pago y volver al comercio"
   * debiese ejecutarse este método
   * @param buy_order
   */
  anularInicioNoPagoMercadoPago(buy_order: any) {
    return this.http.post(`${environment.apiImplementosPagos}mpago/anular`, {
      buy_order: buy_order,
    });
  }

  /**
   * @author José Espinoza
   * @description Obtiene el carro del buy order del external reference, ejemplo: 0702c7b5-b9e7-4ed1-b4b6-70e0eb422525|605dff933d425329c87480b7
   * @param buy_order
   */
  obtenerDocumentoDeBuyOrderMPago(buy_order: any): string {
    let str = buy_order || '';
    const tokens = str.split('|');
    return tokens.length > 1 ? tokens[1] : tokens[0];
  }

  async getPaymentErrorDetail(errorCode: number) {
    let detalle: string =
      'Se ha producido un fallo al procesar la transacción.';
    let url = `${environment.apiImplementosPagos}transbank/getTransbankErrorCode/?errorCode=${errorCode}`;
    try {
      let consulta: any = await this.http.get(url).toPromise();
      if (consulta && !consulta.error) {
        detalle = consulta.data;
      }
    } catch (e: any) {
      console.log(
        'ha ocurrido un error obteniendo el codigo de error asociado al pago' +
          errorCode,
        e
      );
      this.sendEmailError(
        'Ha ocurrido un error intentando obtener el detalle asociado al error de pago' +
          errorCode +
          ' <br> ' +
          e.toString()
      );
    }
    return detalle;
  }

  async getMetodosPago() {
    let resp: PaymentMethod[] = [];
    try {
      let consulta: any = await this.http
        .get(`${environment.apiImplementosPagos}transbank/getMetodosPago`)
        .toPromise();
      if (consulta && !consulta.error && consulta.data) {
        resp = consulta.data;
      } else {
        this._ToastrService.warning(
          'No ha sido posible obtener los metodos de pagos.'
        );
        this.sendEmailError(
          'Ha ocurrido un error intentando obtener los metodos de pago desde mongo <br> ' +
            consulta.toString()
        );
      }
    } catch (e) {
      this._ToastrService.warning(
        'No ha sido posible obtener los metodos de pagos.'
      );
      this.sendEmailError(
        'Ha ocurrido un error intentando obtener los metodos de pago desde mongo <br> ' +
          JSON.stringify(e)
      );
    }

    return resp;
  }

  async getMetodosPagoOmni() {
    let resp: PaymentMethod[] = [];
    try {
      let consulta: any = await this.http
        .get(`${environment.apiImplementosPagos}transbank/omni/getMetodosPago`)
        .toPromise();
      if (consulta && !consulta.error && consulta.data) {
        resp = consulta.data;
      } else {
        this._ToastrService.warning(
          'No ha sido posible obtener los metodos de pagos.'
        );
        this.sendEmailError(
          'Ha ocurrido un error intentando obtener los metodos de pago desde mongo <br> ' +
            consulta.toString()
        );
      }
    } catch (e) {
      this._ToastrService.warning(
        'No ha sido posible obtener los metodos de pagos.'
      );
      this.sendEmailError(
        'Ha ocurrido un error intentando obtener los metodos de pago desde mongo <br> ' +
          JSON.stringify(e)
      );
    }

    return resp;
  }

  close(sentencia: any) {
    this.close$.next(sentencia);
  }
  selectBancoKhipu(banco: any) {
    this.bancokhipu$.next(banco);
  }
}
