import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concepto-mobile',
  templateUrl: './concepto-mobile.component.html',
  styleUrls: ['./concepto-mobile.component.scss'],
})
export class ConceptoMobileComponent implements OnInit {
  @Input() set concepto(value: any) {
    this.caja = value;
  }

  @Input() set tipo(value: any) {
    this.tipo_caja = value;
  }
  caja: any;

  tipo_caja: any;

  constructor(private router: Router) {}

  ngOnInit() {}

  send_pagina(url: any) {
    window.location.href = url;
  }
}
