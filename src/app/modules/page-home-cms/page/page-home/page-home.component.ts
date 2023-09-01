import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  constructor(private titleService: Title) {
    titleService.setTitle('Implementos - Respuestos para Camiones, Buses y Remolque');
  }

  ngOnInit() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Othe
  }
}
