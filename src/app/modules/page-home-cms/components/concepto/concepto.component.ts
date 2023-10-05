import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-concepto',
  templateUrl: './concepto.component.html',
  styleUrls: ['./concepto.component.scss'],
})
export class ConceptoComponent implements OnInit {
  @Input() set concepto(value: any) {
    this.caja = value
  }

  @Input() set tipo(value: any) {
    this.tipo_caja = value
  }
  caja: any
  style_title: any = {}
  style: any = {}
  font: any = 'normal normal 900 38px/59px Avenir'
  style_overlay: any = {}
  style_text: any = {}
  px_y = 20
  px_x = 144.75
  tipo_caja: any
  //capturando el tamaño de la pantalla
  screenWidth: any
  screenHeight: any

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900
    this.get_innerWidth()
  }

  ngOnInit() {
    if (this.tipo_caja != 'slide') this.SetCalcular(this.caja.h, this.caja.w)
    else this.SetCalcularSlide()
  }

  SetCalcular(h: any, w: any) {
    let calculoy = 0
    let calculox = 0
    if (h > 15) h = h + 0.7
    if (w > 1) {
      w = w + 0.07 * (w - 1)
      this.font = 'normal normal 900 38px/59px Avenir'
    } else this.font = 'normal normal 900 28px/49px Avenir'
    calculoy = h * this.px_y
    calculox = w * this.px_x
    this.style['height.px'] = calculoy
    this.style['width.px'] = calculox * 2
    let center = (-1 * calculoy) / 2
    this.style_title['margin-top.px'] = center
    this.style_overlay['margin-top.px'] = -1 * calculoy
  }

  SetCalcularSlide() {
    let h = 18.75

    let calculoy = 0
    let calculox = 0
    calculoy = h * 20
    calculox = this.screenWidth
    this.style['height.px'] = calculoy
    this.style['width.px'] = calculox
    let center = (-1 * calculoy) / 2
    this.style_title['margin-top.px'] = center
    this.style_title['margin-left.px'] = -10
    this.style_overlay['margin-top.px'] = -1 * calculoy
    this.style_text = {
      color: 'white',
      'z-index': 3,
      'font-size': '20px',
    }
  }

  send_pagina(url: any) {
    window.location.href = url
  }

  get_innerWidth() {
    if (this.screenWidth > 768 && this.screenWidth <= 1040) {
      this.px_x = 90.25
      this.px_y = 15
      //generando el tamaño de la letra
      this.style_text = {
        color: 'white',
        'z-index': 3,

        'font-size': '18px',
        'text-align': 'center',
      }
    } else if (this.screenWidth > 1040) {
      this.px_x = 110.25
      this.px_y = 20
      //generando el tamaño de la letra
      this.style_text = {
        color: 'white',
        'z-index': 3,
        'font-size': '29px',
        'font-weight': '900',
        'line-height': '33px',
        'text-align': 'center',
      }
    } else if (this.screenWidth <= 768) {
      this.px_x = 70.25
      this.px_y = 15
      //generando el tamaño de la letra
      this.style_text = {
        color: 'white',
        'z-index': 3,
        'font-size': '16px',
        'font-weight': '900',
        'line-height': '33px',
        'text-align': 'center',
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900
    this.get_innerWidth()
    if (this.tipo_caja != 'slide') this.SetCalcular(this.caja.h, this.caja.w)
  }
}
