import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core'

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
  ]
  screenWidth: any
  terminos = false
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
  }

  ngOnInit() {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
  }
}
