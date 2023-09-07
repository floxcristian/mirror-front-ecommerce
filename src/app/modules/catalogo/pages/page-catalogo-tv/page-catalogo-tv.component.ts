import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ScreenService } from '../../../../shared/services/screen.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

interface IDataTemp{
  tipo:any;
  col:any;
  height:any;
  index:any;
  division:any;
  id:any;
  divElement2:any;
  intervalo:any;
  contenido:any[]
}
@Component({
  selector: 'app-page-catalogo-tv',
  templateUrl: './page-catalogo-tv.component.html',
  styleUrls: ['./page-catalogo-tv.component.scss']
})
export class PageCatalogoTvComponent implements OnInit {
  customOptions = {
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    loop: true,
    autoplay: true,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    autoplayTimeout: 10000,
    navText: ['<i class="fa fa-angle-left" style:"font-size:50px;"></i>', '<i class="fa fa-angle-right"></i>'],
    nav: false,
    responsive: {
      0: { items: 1 }
    },
    autoplaySpeed: 1000
  };

  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  dataTv!: IDataTemp[];
  reloj!: string;
  fecha!: string;
  config = false;

  tiendas!: Array<any>;
  tiendaSel!: any;
  etiqueta: any = '';
  tiendaCod!: any;
  imgClima!: string;
  tempClima!: number;
  descClima!: string;
  dolar!: number;
  uf!: number;
  ipc!: number;

  slide:any[] = [];
  idOne:any[] = [];

  cronogramas!: Array<any>;
  programaSel: any;
  idCrono: string = '';

  slides:any = { 0: null, 1: null, 2: null, 3: null, 4: null };
  totalSlides:any = { 0: null, 1: null, 2: null, 3: null, 4: null };
  // totalSlides: number;
  slideCount:any = { 0: null, 1: null, 2: null, 3: null, 4: null };
  slideCache = [];

  productos:any = [];
  videoTag: any;

  constructor(
    private screenService: ScreenService,
    private logistc: LogisticsService,
    private route: ActivatedRoute,
    private localSt: LocalStorageService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private router: Router
  ) {
    $('body').attr('style', 'overflow-y:hidden !important; background-color: #0063b61f;');
  }

  async ngOnInit() {
    this.cronogramas = await this.screenService.obtenerCronograma(null, true);

    this.route.params.subscribe((params: Params) => {
      if (params['tipo'] === 'config') {
        this.config = true;
        this.router.navigate(['/', 'catalogos', 'catalogo-tv', 'config']);
      }
    });

    await this.logistc.obtenerTiendas().subscribe((items) => {
      this.tiendas = items['data'];
    });

    let data: any = this.localSt.get('tiendaTv');
    if (data === null || !data.etiqueta) {
      this.config = true;
      this.router.navigate(['/', 'catalogos', 'catalogo-tv', 'config']);
    } else {
      this.etiqueta = data.etiqueta;
      this.tiendaSel = data.tiendaText;
      this.tiendaCod = data.tienda;
      this.programaSel = this.localSt.get('programaHoy');
      if (this.programaSel != null) {
        await this.filtroPrograma();

        // Reloj
        this.displayDateTime();
      }
    }

    // Data clima
    if (!this.config) {
      const dta = await this.screenService.obtenerClima(this.tiendaSel);
      this.imgClima = dta.weather[0].icon;
      this.tempClima = dta.main.temp.toFixed();
      this.descClima = dta.weather[0].description;

      const indic = await this.screenService.indicadoresFinancieros();
      this.dolar = indic.dolar.valor;
      this.uf = indic.uf.valor;
      this.ipc = indic.ipc.valor;
      // actualiza data de cronogramas
      if (this.programaSel != null) {
        setInterval(async () => {
          this.cronogramas = await this.screenService.obtenerCronograma(null, true);
          this.selectCrono(this.programaSel[0]._id);
          // console.log('UpCrono', this.cronogramas);
        }, 20000);

        // Actualiza data de campania
        setInterval(() => {
          this.filtroPrograma();
        }, 30000);

        // Set Status TV
        this.setStatusTv();
        setInterval(() => {
          this.setStatusTv();
        }, 60000);
      }
    }
  }

  private async setStatusTv() {
    const dataTv = {
      tipo: 'propaganda-tv',
      etiqueta: this.etiqueta,
      estado: true,
      sucursal: this.tiendaCod
    };

    await this.logistc.saveStatusTv(dataTv).then((res) => {
      if (res.error) {
        console.log('Error en enviar status', res.msg);
      } else {
      }
    });
  }

  private getVideoTag(link: string, height: string) {
    let hgth = '555px';
    if (height === 'height:290px') hgth = '918px';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<video style="height: ${hgth};width:100%" muted loop autoplay playsinline disableRemotePlayback>
            <source src="${link}" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>`
      // `<iframe width="100%" height="${hgth}" src="blob:https://mdstrm.com/aabf8e52-1fc1-435c-8db1-d068c6877443" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
  }

  filtroPrograma() {
    const now = new Date();
    const numeroDia = now.getDay();

    let H = now.getHours();
    let m = now.getMinutes();
    const hour = H < 10 ? '0' + H : H;
    const min = m < 10 ? '0' + m : m;

    let diaHoy = this.dias[numeroDia - 1];
    if (this.programaSel[0].programacion[0].tipo === 'semana') {
      diaHoy = 'Semana';
    }

    const dComp = '01/01/2011 ';
    const updateLayout = this.localSt.get('ultimoUp');

    const programaHoy = this.programaSel[0].programacion.filter((diaSel:any) => diaSel.dia === diaHoy);
    programaHoy[0].contenido.map(async (campania:any) => {
      if (
        Date.parse(dComp + campania.hrInicio) < Date.parse(`${dComp}${hour}:${min}`) &&
        Date.parse(dComp + campania.hrFin) > Date.parse(`${dComp}${hour}:${min}`)
      ) {
        const dataTv = await this.screenService.obtenerPropaganda(campania.id, true);

        if (dataTv[0].updatedAt !== updateLayout || !this.dataTv) {
          this.localSt.set('ultimoUp', dataTv[0].updatedAt);
          this.dataTv = dataTv[0].layouts;
          // Reproduce Layouts
          // this.dataTv = campania.layouts;
          this.dataTv.map((element) => {
            if (element.tipo === 'imagenesTv' && element.contenido.length > 1) {
              this.autoplay(element.index, element.id, element.intervalo, 'fade');
            } else {
              this.idOne[element.id] = true;
            }

            // Solo para columna de 3 productos
            if (element.tipo === 'producto') {
              element.division = 2;
              element.divElement2 = element.contenido.length;
              if (element.height === 'height:290px') {
                element.division = 3;
                element.divElement2 = (element.contenido.length / element.division) * 2;
              }
            }

            if (element.tipo === 'producto') {
              this.autoplay(element.index + '-0', element.id, element.intervalo, 'slide');
              this.autoplay(element.index + '-1', element.id, element.intervalo, 'slide');
              if (element.division === 3) this.autoplay(element.index + '-2', element.id, element.intervalo, 'slide');
            }

            if (element.tipo === 'videoTv') {
              this.videoTag = this.getVideoTag(element.contenido[0].url, element.height);
            }
          });
        }
      }
    });
  }

  selectCrono(idCrono: string) {
    this.idCrono = idCrono;
    return false;
  }

  saveConfig() {
    const etiqueta = $('#etiqueta').val()?.toString().toUpperCase();
    const tiendaText = $('#tienda :selected').text();
    const tienda = $('#tienda').val()?.toString();

    if (etiqueta === '') {
      this.toast.warning('Debe indicar una etiqueta para la pantalla');
      return false;
    }
    if (tienda === '') {
      this.toast.warning('Debe seleccionar una tienda');
      return false;
    }
    if (this.idCrono === '') {
      this.toast.warning('Debe seleccionar un cronograma para reproducir');
      return false;
    }

    const data = {
      etiqueta,
      tienda,
      tiendaText
    };
    this.localSt.set('tiendaTv', data);
    this.tiendaSel = tiendaText;
    this.etiqueta = etiqueta;
    this.tiendaCod = tienda;

    const selected = this.cronogramas.filter((element) => element._id === this.idCrono);
    this.localSt.set('programaHoy', selected);
    this.programaSel = selected;
    this.router.navigate(['/', 'catalogos', 'catalogo-tv']);
    return
  }

  autoplay(index: any, id: any, invervalo: number, tipo: string) {
    clearInterval(this.slide[index]);
    if (tipo === 'slide') {
      this.playSlide(index, invervalo);
    } else if (tipo === 'fade') {
      this.idOne[id] = true;
      setTimeout(() => {
        this.slides[index] = $('#' + id + ' li');
        this.totalSlides[index] = this.slides[index].length;
        this.slide[index] = setInterval(() => {
          this.idOne[id] = false;
          this.slideCount[index] < this.totalSlides[index] - 1
            ? this.slideCount[index]++
            : (this.slideCount[index] = 0);
          this.fade(index, invervalo, this.slideCount[index]);
        }, invervalo);
      }, 1000);
    }
  }

  fade(index: number, invervalo: number, Count: Number) {
    this.slides[index].eq(Count).fadeIn(1500).delay(invervalo).fadeOut(1500);
  }

  timeSlide: any;
  playSlide(index: number, invervalo: number) {
    this.timeSlide = setTimeout(() => {
      this.moverD(index, invervalo);
    }, invervalo);
  }

  moverD(index: number, invervalo: number) {
    $(`#slider-${index}`).animate(
      {
        marginLeft: '-100%'
      },
      2500,
      () => {
        $(`#slider-${index} section:first`).insertAfter(`#slider-${index} section:last`);
        $(`#slider-${index}`).css('margin-left', '-0%');
        this.playSlide(index, invervalo);
      }
    );
  }

  displayDateTime() {
    var now = new Date();
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
      'Diciembre'
    );
    var days = new Array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado');

    var date = now.getDate();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDay();

    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    const Fhour = hour < 10 ? '0' + hour : hour;
    const Fminute = minute < 10 ? '0' + minute : minute;
    const Fsecond = second < 10 ? '0' + second : second;

    this.reloj = Fhour + ':' + Fminute + ':' + Fsecond;
    this.fecha = days[day] + ' ' + date + ' de ' + months[month];

    setTimeout((e:any) => {
      this.displayDateTime();
    }, 1000);
  }
}
