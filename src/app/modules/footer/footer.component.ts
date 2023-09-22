import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { theme } from '../../../data/theme'; // no se usa
import { Link } from '../../shared/interfaces/link';
import { LoginService } from '../../shared/services/login.service';
import { Usuario } from '../../shared/interfaces/login';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  // theme = theme; // no se usa
  linksPaginas: Link[];
  linkMiCuenta: Link[];
  anio: number;
  linkEpysa: Link[];
  usuario!: Usuario;
  innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  constructor(
    public loginService: LoginService,
    public route: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.anio = new Date().getFullYear();
    this.linksPaginas = [
      {
        label: 'Acerca de nosotros',
        url: ['/', 'sitio', 'acerca-de-nosotros'],
      },
      {
        label: ' Cambios y Devoluciones',
        url: ['/', 'sitio', 'politicas', 'cambios-devolucion'],
      },
      {
        label: 'Términos y Condiciones',
        url: ['/', 'sitio', 'politicas', 'terminos-condiciones'],
      },
      {
        label: 'Políticas de Privacidad',
        url: ['/', 'sitio', 'politicas-de-privacidad'],
      },
      { label: 'Bases Concurso', url: ['/', 'sitio', 'bases-concurso'] },
      { label: 'Asociados', url: '' },
      { label: 'Contacto', url: ['/', 'sitio', 'contacto'] },
    ];

    this.linkMiCuenta = [
      { label: 'Mi cuenta', url: 'resumen' },
      { label: 'Mis pedidos', url: 'pedidos-pendientes' },
      { label: 'Mis cotizaciones', url: 'cotizaciones' },
      { label: 'Seguimiento de compra', url: 'seguimiento' },
    ];

    this.linkEpysa = [
      {
        rel: 'noopener',
        label: 'EPYSA Buses',
        link: 'http://www.epysabuses.cl',
      },
      {
        rel: 'noopener',
        label: 'EPYSA Equipos',
        link: 'https://www.epysaequipos.cl',
      },
      {
        rel: 'noopener',
        label: 'Servi Bus',
        link: 'http://www.epysabuses.cl/red-servicio-tecnico-servibus/',
      },
      { rel: 'noopener', label: 'FITRANS', link: 'http://www.fitrans.cl' },
      { rel: 'noopener', label: 'Mundo Buses', link: 'https://mundobuses.cl/' },
      {
        rel: 'noopener',
        label: 'BUS MARKET',
        link: 'https://www.busmarket.cl',
      },
      {
        rel: 'noopener',
        label: 'EPYSA Perú',
        link: 'https://implementos.com.pe',
      },
      {
        rel: 'noopener',
        label: 'Mercobus',
        link: 'http://www.mercobus.com.pe',
      },
    ];

    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  // Funcion utilizada para ocultar footer para dispositivos mobiles en las pantallas de seleccion de despacho y pago.
  HideFooter() {
    if (
      this.route.url === '/inicio' ||
      this.route.url.includes('/productos/ficha/') ||
      this.route.url.includes('sitio') ||
      this.route.url === '/not-found'
    ) {
      return false;
    } else {
      return true;
    }
  }

  // valida si nos encontramos en la ficha de un producto.
  onFichaProducto() {
    if (this.route.url.lastIndexOf('/inicio/productos/ficha/') == -1) {
      return false;
    } else {
      return true;
    }
  }
}
