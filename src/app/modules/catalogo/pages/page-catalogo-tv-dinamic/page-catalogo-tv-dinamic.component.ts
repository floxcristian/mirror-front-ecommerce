import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../../shared/services/screen.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-catalogo-tv-dinamic',
  templateUrl: './page-catalogo-tv-dinamic.component.html',
  styleUrls: ['./page-catalogo-tv-dinamic.component.scss']
})
export class PageCatalogoTvDinamicComponent implements OnInit {
  cronogramas!: any[];
  programaSel: any;
  propagandas: any = [];
  propagandaPlay: any = [];
  layouts: any = [];
  interval:any[] = [];
  updateCrono!: Date;
  indice: number = 0;
  timing = 0;
  config = true;
  tiendas: any = [];
  dataConfig = { etiqueta: '', tiendaSel: '', tiendaCod: '' };
  idCrono!: string;

  constructor(
    private screenService: ScreenService,
    private localSt: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private logistc: LogisticsService,
    private toast: ToastrService
  ) {}

  async ngOnInit() {
    $('body').attr('style', 'overflow-y:hidden !important; background-color: #0063b61f;');

    this.programaSel = this.localSt.get('programaHoy');
    const data: any = this.localSt.get('tiendaTv');

    console.log('programaSel', this.programaSel);

    if (data === null || !data.etiqueta || !this.programaSel) {
      this.config = true;
      this.router.navigate(['/', 'catalogos', 'catalogo-tv', 'config']);
    } else {
      this.config = false;
      this.dataConfig.etiqueta = data.etiqueta;
      this.dataConfig.tiendaCod = data.tienda;
      this.dataConfig.tiendaSel = data.tiendaText;
    }

    this.route.params.subscribe((params: Params) => {
      if (params['tipo'] === 'config') {
        this.config = true;
        this.router.navigate(['/', 'catalogos', 'catalogo-tv', 'config']);
      } else {
        this.config = false;
      }
    });

    if (this.config) {
      this.cargaConfig();
    } else {
      this.cargaReproduccion();

      // Set Status TV
      this.setStatusTv();
      setInterval(() => {
        this.setStatusTv();
      }, 60000);
    }
  }

  private async setStatusTv() {
    const dataTv = {
      tipo: 'propaganda-tv',
      etiqueta: this.dataConfig.etiqueta,
      sucursal: this.dataConfig.tiendaCod,
      estado: true
    };

    await this.logistc.saveStatusTv(dataTv).then((res) => {
      if (res.error) {
        console.log('Error en enviar status', res.msg);
      } else {
      }
    });
  }

  async cargaConfig() {
    this.cronogramas = await this.screenService.obtenerCronograma(null, true);

    await this.logistc.obtenerTiendas().subscribe((items) => {
      this.tiendas = items['data'];
    });
  }

  async cargaReproduccion() {
    // Obtiene ultima actualizacion del cronograma
    this.updateCrono = this.programaSel[0].updatedAt;

    // Lista propagandas del cronograma seleccionado
    // Obtiene propaganadas del cronograma
    const idsPropagandas = this.programaSel[0].programacion[0].contenido;
    console.log('propaganadas object', idsPropagandas);
    await idsPropagandas.map(async (propaganda: any) => {
      const dataPropTv = await this.screenService.obtenerPropaganda(propaganda._id, true);
      propaganda.layouts = dataPropTv[0].layouts;
      propaganda.nombre = dataPropTv[0].nombre;
      propaganda.plantilla = dataPropTv[0].plantilla;

      this.propagandas.push(propaganda);
    });
    setTimeout(async () => {
      setInterval(() => {
        this.timing--;
      }, 1000);

      await this.reproduccion();
    }, 1000);

    // Del cronograma seleccionado busca modificaciones cada 30 seg
    // Si encuentra modificaciones setea nueva reproduccion y recarga la pantalla
    setInterval(async () => {
      const getUpdateCrono = await this.screenService.obtenerCronograma(this.programaSel[0]._id, true);
      if (this.updateCrono !== getUpdateCrono[0].updatedAt) {
        this.programaSel = getUpdateCrono;
        this.updateCrono = getUpdateCrono[0].updatedAt;
        this.localSt.set('programaHoy', getUpdateCrono);
        console.log('Encuentra actualizacion cronograma');

        location.reload();
      }
    }, 30000);
  }

  async reproduccion() {
    console.log('New Propag', this.propagandas);

    if (this.propagandas[this.indice] === undefined) this.indice = 0;
    this.propagandaPlay = this.propagandas[this.indice];
    this.layouts = this.propagandaPlay.layouts;
    // Convierte tiempo en milisegundos
    let duracionMili = this.convertMili(this.propagandaPlay.duracion);

    console.log('Propaganda activa: ', this.propagandaPlay);
    console.log(this.propagandaPlay.duracion, duracionMili);
    this.timing = duracionMili / 1000;

    this.interval[this.indice] = setInterval(() => {
      // Cuando se cumple el tiempo de la reproduccion actual, pasa a la siguiente propaganda
      clearInterval(this.interval[this.indice]);
      this.indice++;
      this.reproduccion();
    }, duracionMili);
  }

  // Convierte tiempo en milisegundos
  convertMili(time: string) {
    let duracion: any = time.split(':');
    let hour = duracion[0] * 3600000;
    let min = duracion[1] * 60000;
    let seg = duracion[2] * 1000;

    if (duracion.length === 3) return hour + min + seg;
    else return 60000;
  }

  selectCrono(idCrono: string) {
    this.idCrono = idCrono;
    return false;
  }

  saveConfig() {
    const etiqueta = $('#etiqueta').val()?.toString().toUpperCase() || ''
    const tiendaText = $('#tienda :selected').text()
    const tienda = $('#tienda').val()?.toString() || ''

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
    this.dataConfig.tiendaSel = tiendaText;
    this.dataConfig.etiqueta = etiqueta;
    this.dataConfig.tiendaCod = tienda;

    const selected = this.cronogramas.filter((element: any) => element._id === this.idCrono);
    this.localSt.set('programaHoy', selected);
    this.programaSel = selected;
    this.config = false;
    this.router.navigate(['/', 'catalogos', 'catalogo-tv']);
    return
  }
}
