import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-grupo-detalle-fechas-mobile',
  templateUrl: './grupo-detalle-fecha-mobile.component.html',
  styleUrls: ['./grupo-detalle-fecha-mobile.component.scss'],
})
export class GrupoDetalleFechaMobileComponent implements OnInit {
  @Input() fletes: any = [];
  @Input() index: number = 0;
  @Output() itemSeleccionado = new EventEmitter();
  DIAS_SEMANA_STR = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];
  MESES_STR = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  DIAS_SEMANA = 14;
  fecha_seleccionada = false;
  fecha_seleccionar = '';
  semanas: any = [];
  totalSemanas: number = 0;
  semanaActual: number = 0;
  itemSelectedindex: number = 0;
  paginasIndex = 0;
  //ver las fechas
  innerWidth: number;
  FECHA: any = [];
  modalRef!: BsModalRef;
  select: boolean = false;
  arreglo_fecha: any = [];
  constructor(private modalService: BsModalService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.totalSemanas = this.getTotalSemanas();

    this.armarSemanas();
    this.setSemanaActual();
  }

  ngOnDestroy() {
    this.itemSeleccionado.unsubscribe();
  }
  getTotalSemanas(): number {
    if (this.fletes.length === 0) {
      return 0;
    } else if (this.fletes.length === 1) {
      return 1;
    }
    //let primeraFecha = new Date(this.fletes[0].fecha);
    let primeraFecha = new Date();
    primeraFecha.setDate(primeraFecha.getDate() + 1);
    const ultimaFecha = new Date(this.fletes[this.fletes.length - 1].fecha);
    var diff = (ultimaFecha.getTime() - primeraFecha.getTime()) / 1000;
    diff /= 60 * 60 * 24 * 3;
    return Math.abs(Math.round(diff));
  }

  armarSemanas() {
    this.semanas = [];
    let fecha_actual = new Date(this.fletes[0].fecha);
    let currentDate = new Date(this.fletes[0].fecha);
    for (let i = 0; i < this.totalSemanas; i++) {
      const fechasSemana: any = [];
      for (let d = 0; d < this.DIAS_SEMANA; d++) {
        let date = new Date();

        date.setDate(currentDate.getDate());
        currentDate.setMonth(fecha_actual.getMonth());

        if (fecha_actual.getDate() > currentDate.getDate()) {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        date.setMonth(currentDate.getMonth());

        const flete = this.buscarFechaFlete(currentDate);
        if (flete != null) {
          fechasSemana.push({
            index: d + 1,
            fecha: date,
            habilitado: flete !== null,
            valor: flete ? flete.precio : 999999, // $
            diaSemana: this.DIAS_SEMANA_STR[currentDate.getDay()], // Ej: Mié
            numeroDia: currentDate.getDate(), // Ej: 07
            mes: this.MESES_STR[currentDate.getMonth()].substring(0, 3),
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      if (fechasSemana.length > 0) {
        this.semanas.push({
          mes: this.MESES_STR[fechasSemana[0].fecha.getMonth()],
          year: fechasSemana[0].fecha.getFullYear(),
          fechas: fechasSemana,
        });
      }
    }

    this.FECHA = this.semanas[this.semanaActual].fechas[0];
  }

  setSemanaActual() {
    for (let i = 0; i < this.semanas.length; i++) {
      if (this.semanas[i].fechas.some((f: any) => f.habilitado)) {
        this.semanaActual = i;
        break;
      }
    }
    let string = '';
    let ultima_posicion = this.semanas[this.semanaActual].fechas.length - 1;
    string =
      this.semanas[this.semanaActual].fechas[0].diaSemana +
      '. ' +
      this.semanas[this.semanaActual].fechas[0].numeroDia +
      ' ' +
      this.semanas[this.semanaActual].fechas[0].mes;

    string +=
      ' - ' +
      this.semanas[this.semanaActual].fechas[ultima_posicion].diaSemana +
      '. ' +
      this.semanas[this.semanaActual].fechas[ultima_posicion].numeroDia +
      ' ' +
      this.semanas[this.semanaActual].fechas[ultima_posicion].mes;
    this.fecha_seleccionar = string;
  }

  buscarFechaFlete(fecha: Date) {
    const filtered = this.fletes.filter((flete: any) => {
      const fleteFecha = new Date(flete.fecha);
      return (
        fecha.getFullYear() === fleteFecha.getFullYear() &&
        fecha.getMonth() === fleteFecha.getMonth() &&
        fecha.getDate() === fleteFecha.getDate()
      );
    });
    return filtered.length > 0 ? filtered[0] : null;
  }

  goToSemana(nuevaSemana: number) {
    this.itemSelectedindex = 0;
    if (nuevaSemana < 0 || nuevaSemana >= this.totalSemanas) {
      return;
    }
    this.semanaActual = nuevaSemana;
  }

  primeraFechaSeleccionda() {
    for (let i = 0; i < this.semanas[0].fechas.length; i++) {
      if (this.semanas[0].fechas[i].habilitado) {
        this.SeleccionarEnvio(this.semanas[0].fechas[i]);
        break;
      }
    }
  }

  SeleccionarEnvio(item: any) {
    let resultado: any = this.buscarFechaFlete(item.fecha);
    this.itemSelectedindex = item.index;
    this.paginasIndex = this.semanaActual;
    this.FECHA = item;

    this.itemSeleccionado.emit(resultado);
    this.select = true;
    this.modalRef.hide();
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    // ver cambios de pantalla //
  }

  openModal(template: TemplateRef<any>) {
    this.select = false;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  Close() {
    this.modalRef.hide();
  }
}
