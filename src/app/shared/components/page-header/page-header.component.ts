import { Component, HostListener, Input } from '@angular/core';
import { Link } from '../../interfaces/link';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() header!: string;
  @Input() headerSubtitle!: string;
  @Input() textLast!: string;
  @Input() class!: string;
  @Input() totalRegistros!: number;
  @Input() breadcrumbs: Link[] = [];
  @Input() returnUrl = '';
  @Input() textToSearch = '';
  url: string;
  innerWidth: number;
  constructor(private route: Router) {
    this.url = window.location.href;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {}
  ngonChanges() {
    this.url = window.location.href;
  }
  // Funcion que esconde el label "mostrando resultado...." dentro de la ficha de un item y la pagina de contactos.
  HideOnFicha() {
    if (
      this.route.url.lastIndexOf('/inicio/productos/ficha/') == -1 &&
      this.route.url.lastIndexOf('/sitio/contacto') == -1
    ) {
      return false;
    } else {
      return true;
    }
  }

  decodedUrl(cadena: string) {
    return decodeURIComponent(cadena);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
}
