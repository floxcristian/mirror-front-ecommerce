import { Component, Input, OnInit } from '@angular/core'
import { ScreenService } from '../../../../shared/services/screen.service'

@Component({
  selector: 'app-template-card-footer-tv',
  templateUrl: './template-card-footer-tv.component.html',
  styleUrls: ['./template-card-footer-tv.component.scss'],
})
export class TemplateCardFooterTvComponent implements OnInit {
  @Input() tiendaSel!: string

  indicadores: any = { dolar: '', ipc: '', uf: '' }
  clima: any = { imagen: '', temperatura: '', descrippcion: '' }
  reloj!: string
  fecha!: string

  constructor(private screenService: ScreenService) {}

  ngOnInit() {
    this.loadClima()
    this.loadIndicadores()
    this.displayDateTime()
  }

  async loadClima() {
    const dta = await this.screenService.obtenerClima(this.tiendaSel)
    this.clima.imagen = dta.weather[0].icon
    this.clima.temperatura = dta.main.temp.toFixed()
    this.clima.descripcion = dta.weather[0].description
  }

  async loadIndicadores() {
    const indic = await this.screenService.indicadoresFinancieros()
    this.indicadores.dolar = indic.dolar.valor
    this.indicadores.uf = indic.uf.valor
    this.indicadores.ipc = indic.ipc.valor
  }

  displayDateTime() {
    var now = new Date()
    var months = new Array(
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
    )
    var days = new Array(
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    )

    var date = now.getDate()
    var year = now.getFullYear()
    var month = now.getMonth()
    var day = now.getDay()

    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()

    const Fhour = hour < 10 ? '0' + hour : hour
    const Fminute = minute < 10 ? '0' + minute : minute
    const Fsecond = second < 10 ? '0' + second : second

    this.reloj = Fhour + ':' + Fminute + ':' + Fsecond
    this.fecha = days[day] + ' ' + date + ' de ' + months[month]

    setTimeout((e: any) => {
      this.displayDateTime()
    }, 1000)
  }
}
