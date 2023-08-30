import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.scss'],
})
export class ContactanosComponent implements OnInit {
  screenWidth: any;
  terminos = false;
  constructor(private router: Router) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  Contacto() {
    this.router.navigate(['/sitio/contacto']);
  }
}
