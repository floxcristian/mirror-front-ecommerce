import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import * as e from 'express';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-espera-cd',
  templateUrl: './page-espera-cd.component.html',
  styleUrls: ['./page-espera-cd.component.scss'],
})
export class PageEsperaCdComponent implements OnInit {
  heightScreen!: number;
  ovs!: any[];
  reloj: any;
  config = false;
  tiendas: any[] = [];
  etiquetaTv: string | any = '';
  tiendaTv: string | any = '';

  constructor(
    private logistc: LogisticsService,
    private localSt: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    $('#body').attr('style', 'overflow:hidden !important');
    setTimeout(() => {
      $('#difuminado').attr('style', 'height:' + $('body').height() + 'px');
    }, 500);

    await this.logistc.obtenerTiendas().subscribe((items) => {
      this.tiendas = items['data'];

      const cd: any = { codigo: 'CDD-CD1', nombre: 'CDD-CD1' };
      this.tiendas.push(cd);
    });

    // Set data val config
    this.route.params.subscribe((params: Params) => {
      if (params['tipo'] === 'config') {
        this.config = true;
      }
    });

    let data: any = this.localSt.get('configTv');
    if (!data) {
      this.config = true;
      this.router.navigate(['/', 'catalogos', 'espera-cd', 'config']);
    } else {
      this.etiquetaTv = data.etiqueta;
      this.tiendaTv = data.tienda;

      // cada 1 minuto se consulta por nueva data en el cd
      this.cargaDataOms();
      setInterval(() => {
        this.cargaDataOms();
      }, 60000);

      this.displayDateTime();
    }
    // Cada 1 hora se recarga la pagina
    setInterval(() => {
      location.reload();
    }, 3600000);
  }

  async cargaDataOms() {
    await this.logistc
      .obtieneOvEspera(this.tiendaTv)
      .subscribe((items: any) => {
        this.ovs = items.data;
        this.setDiff();

        console.log(this.ovs);
      });

    const dataTv = {
      tipo: 'espera-cd',
      etiqueta: this.etiquetaTv,
      estado: true,
      sucursal: this.tiendaTv,
    };

    await this.logistc.saveStatusTv(dataTv).then((res) => {
      if (res.error) {
        console.log('Error en enviar status', res.msg);
      } else {
      }
    });
  }

  setDiff() {
    setInterval(() => {
      this.heightScreen = $('body').height() || 0;
      if (this.ovs.length > 1)
        this.heightScreen = (this.heightScreen - 170) / 2;
      else this.heightScreen = this.heightScreen - 150;

      this.ovs.map((item: any) => {
        const fecha = new Date(item.fechaSeguimiento);
        const horaUTC = fecha.getHours();
        let hour = item.fechaSeguimiento.split('T')[1].split('.000Z');
        hour = hour[0].split(':');
        item.diff = this.calculardiferencia(
          horaUTC + ':' + hour[1] + ':' + hour[2]
        );
        item.hora = horaUTC + ':' + hour[1] + ':' + hour[2];
        item.fecha = item.fechaSeguimiento.split('T')[0];
        item.statFecha = false; //this.validaFecha(item.fecha);

        item.stat = item.color;
      });
    }, 1000);
  }

  validaFecha(fechaIn: string) {
    var date1 = new Date(fechaIn);
    var date2 = new Date();

    return date1 < date2;
  }

  prefijo(num: number) {
    return num < 10 ? '0' + num : num;
  }

  calculardiferencia(timeSet: string) {
    const hoy = new Date();
    const hora = hoy.getHours();
    const minuto = hoy.getMinutes();
    const segundo = hoy.getSeconds();

    const hora2 = timeSet.split(':');
    const hora1 = `${this.prefijo(hora)}:${this.prefijo(minuto)}:${this.prefijo(
      segundo
    )}`.split(':');
    let t1 = new Date(),
      t2 = new Date();

    t1.setHours(Number(hora1[0]), Number(hora1[1]), Number(hora1[2]));
    t2.setHours(Number(hora2[0]), Number(hora2[1]), Number(hora2[2]));

    //Aquí hago la resta
    t1.setHours(
      t1.getHours() - t2.getHours(),
      t1.getMinutes() - t2.getMinutes(),
      t1.getSeconds() - t2.getSeconds()
    );

    //Imprimo el resultado
    return (
      this.prefijo(t1.getHours()) +
      ':' +
      this.prefijo(t1.getMinutes()) +
      ':' +
      this.prefijo(t1.getSeconds())
    );
  }

  displayDateTime() {
    var now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    const Fhour = hour < 10 ? '0' + hour : hour;
    const Fminute = minute < 10 ? '0' + minute : minute;
    const Fsecond = second < 10 ? '0' + second : second;

    this.reloj = Fhour + ':' + Fminute + ':' + Fsecond;

    setTimeout((e) => {
      this.displayDateTime();
    }, 1000);
  }

  saveConfig() {
    const etiqueta = $('#etiqueta').val()?.toString().toUpperCase();
    const tienda = $('#tienda').val()?.toString();

    const data = {
      etiqueta,
      tienda,
    };

    this.etiquetaTv = etiqueta;
    this.tiendaTv = tienda;

    this.localSt.set('configTv', data);
    this.config = false;
    this.router.navigate(['/', 'catalogos', 'espera-cd']);
  }
}
