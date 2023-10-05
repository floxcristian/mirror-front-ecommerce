import { Component, OnInit, Input } from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({
  selector: 'app-template-card-imagenes-tv',
  templateUrl: './template-card-imagenes-tv.component.html',
  styleUrls: ['./template-card-imagenes-tv.component.scss'],
})
export class TemplateCardImagenesTvComponent implements OnInit {
  @Input() layout: any

  customOptions!: OwlOptions

  constructor() {}

  ngOnInit() {
    this.customOptions = {
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      items: 1,
      autoplay: true,
      autoplayTimeout: this.layout.intervalo,
      loop: true,
      margin: 0,
      mouseDrag: false,
      nav: false,
      dots: false,
      smartSpeed: 1000,
      navSpeed: 1000,
      autoWidth: true,
    }
  }
}
