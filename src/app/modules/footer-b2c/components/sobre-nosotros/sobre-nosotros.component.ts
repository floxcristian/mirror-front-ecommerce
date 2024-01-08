import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.scss'],
})
export class SobreNosotrosComponent {
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
  terminos = false;
}
