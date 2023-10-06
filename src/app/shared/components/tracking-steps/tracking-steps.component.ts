import { Component, OnInit, Input } from '@angular/core';
import { LogisticsService } from '../../services/logistics.service';

@Component({
  selector: 'app-tracking-steps',
  templateUrl: './tracking-steps.component.html',
  styleUrls: ['./tracking-steps.component.scss'],
})
export class TrackingStepsComponent implements OnInit {
  @Input() OVEstados: any[] = [];
  @Input() OV = '';

  @Input() tipoEntrega = 'VEN- RPTDA';
  estado_envio: any = {};
  Informe_estado: any = [];
  seguimiento_estado = [
    'CREADO',
    'ORIGEN',
    'EN PREPARACIÓN',
    'ESPERA CLIENTE',
    'ENVIADO',
    'RECIBIDO',
    'N/A',
  ];
  constructor(private logisticservice: LogisticsService) {}

  ngOnInit() {
    this.informarEstados();
  }

  ngOnChanges() {
    this.informarEstados();
  }

  async buscarDespachOV() {
    this.estado_envio = {};
    let consulta: any = await this.logisticservice
      .obtieneEstadoOV(this.OV)
      .toPromise();
    let estado_envio: any = [];

    if (consulta.data.length > 0) {
      if (consulta.data[0].CodigoPrestador == 'CORREOSCHI')
        estado_envio = consulta.data.filter((r: any) => r.CodigoEstado == '4');
      else if (consulta.data[0].CodigoPrestador == 'SAMEX') {
        estado_envio = consulta.data.filter((r: any) => r.CodigoEstado == '9');
        //estado_envio= Array.from(new Set(estado_envio.Estado));
      }
    }

    if (estado_envio.length > 0) {
      this.estado_envio.nombre = 'En Despacho a domicilio';
      this.estado_envio.fecha = estado_envio[0].FechaEstadoOT;
    }
  }
  buscarRetirOV() {
    let estado_envio = this.OVEstados.filter(
      (r) =>
        r.CodigoSeguimiento == 30 ||
        r.CodigoSeguimiento == 3 ||
        r.CodigoSeguimiento == 31
    );
    if (estado_envio.length > 0) {
      this.estado_envio.nombre = 'Retiro en Tienda';
      this.estado_envio.fecha = estado_envio[0].FechaSeguimiento;
    }
  }

  async informarEstados() {
    this.Informe_estado = [];

    this.OVEstados.forEach((estado) => {
      if (
        estado.EstadoSegPanel == 'CREADO' ||
        estado.EstadoSegPanel == 'ORIGEN'
      ) {
        this.Informe_estado[0] = estado;
      } else if (estado.EstadoSegPanel == 'ESPERA CLIENTE') {
        this.Informe_estado[1] = 'EN PREPARACIÓN';
        this.Informe_estado[2] = estado;
      } else if (estado.EstadoSegPanel == 'EN PREPARACIÓN') {
        this.Informe_estado[1] = estado;
      } else if (estado.EstadoSegPanel == 'ENVIADO') {
        this.Informe_estado[2] = estado;
      } else if (
        estado.EstadoSegPanel == 'RECIBIDO' ||
        estado.EstadoSegPanel == 'N/A'
      ) {
        this.Informe_estado[3] = estado;
      }
    });
  }
}
