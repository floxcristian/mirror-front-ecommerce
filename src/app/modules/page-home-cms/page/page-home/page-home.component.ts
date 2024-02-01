import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent implements OnInit {
  constructor(private readonly titleService: Title, private renderer:Renderer2) {
    this.titleService.setTitle(
      'Implementos - Respuestos para Camiones, Buses y Remolque'
    );
  }

  ngOnInit() {
    const body_e = this.renderer.selectRootElement('body',true) // safari
    this.renderer.setProperty(body_e,'scrollTop',0)
    const html_e = this.renderer.selectRootElement('html',true) //other
    this.renderer.setProperty(html_e,'scrollTop',0)
  }
}
