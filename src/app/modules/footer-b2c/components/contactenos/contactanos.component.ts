import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.scss'],
})
export class ContactanosComponent {
  terminos = false;
  constructor(private router: Router) {}

  Contacto() {
    this.router.navigate(['/sitio/contacto']);
  }
}
