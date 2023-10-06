import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.scss'],
})
export class ContactanosComponent implements OnInit {
  screenWidth: any;
  terminos = false;
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  Contacto() {
    this.router.navigate(['/sitio/contacto']);
  }
}
