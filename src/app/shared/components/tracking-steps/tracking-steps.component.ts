import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tracking-steps',
  templateUrl: './tracking-steps.component.html',
  styleUrls: ['./tracking-steps.component.scss'],
})
export class TrackingStepsComponent implements OnInit {
  @Input() OVEstados: any[] = [];

  @Input() tipoEntrega = 'RPTDA';
  estado_envio: any = {};
  Informe_estado: any = [];
  constructor() {}

  ngOnInit() {
    this.informarEstados();
  }

  ngOnChanges() {
    this.informarEstados();
  }

  // buscarRetirOV() {
  //   let estado_envio = this.OVEstados.filter(
  //     (r) =>
  //       r.CodigoSeguimiento == 30 ||
  //       r.CodigoSeguimiento == 3 ||
  //       r.CodigoSeguimiento == 31
  //   );
  //   if (estado_envio.length > 0) {
  //     this.estado_envio.nombre = 'Retiro en Tienda';
  //     this.estado_envio.fecha = estado_envio[0].FechaSeguimiento;
  //   }
  // }

  async informarEstados() {
    this.Informe_estado = [];

    this.OVEstados.forEach((estado) => {
      // if (
      //   estado.EstadoSegPanel == 'CREADO' ||
      //   estado.EstadoSegPanel == 'ORIGEN'
      // ) {
      if (
        estado.status == 'created'
      ) {
        this.Informe_estado[0] = estado;
      } else if (estado.status == 'pickup') {
        this.Informe_estado[1] = 'in_process';
        this.Informe_estado[2] = estado;
      } else if (estado.status == 'in_process') {
        this.Informe_estado[1] = estado;
        // } else if (estado.EstadoSegPanel == 'ENVIADO') {
        //   this.Informe_estado[2] = estado;
      } else if (
        estado.status == 'received' ||
        estado.status == 'cancelled'
      ) {
        this.Informe_estado[3] = estado;
      }
    });
  }
}
