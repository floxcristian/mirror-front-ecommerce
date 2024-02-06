// Angular
import { Component } from '@angular/core';
import { IConfig } from '@core/config/config.interface';
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.scss'],
})
export class SobreNosotrosComponent {
  readonly config: IConfig;
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

  constructor(public readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
