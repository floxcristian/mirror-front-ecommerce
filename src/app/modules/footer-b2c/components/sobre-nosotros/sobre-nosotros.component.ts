import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.scss'],
})
export class SobreNosotrosComponent implements OnInit {
  links = [
    { label: 'Acerca de nosotros', url: ['/', 'sitio', 'acerca-de-nosotros'] },
    {
      label: 'Términos y Condiciones',
      url: ['/', 'sitio', 'politicas', 'terminos-condiciones'],
    },
    {
      label: 'Políticas de Privacidad',
      url: ['/', 'sitio', 'politicas-de-privacidad'],
    },
    // { label: 'Bases Concurso', url: ['/', 'sitio', 'bases-concurso'] }
  ];
  screenWidth: any;
  terminos = false;
  constructor() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
}
