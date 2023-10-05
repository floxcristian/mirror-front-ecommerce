import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core'
import { CarouselConfig } from 'ngx-bootstrap/carousel'

@Component({
  selector: 'app-caja-concepto',
  templateUrl: './caja-concepto.component.html',
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 5500, noPause: false, showIndicators: true },
    },
  ],
  styleUrls: ['./caja-concepto.component.scss'],
})
export class CajaConceptoComponent implements OnInit {
  @Input() set caja_concepto(value: any) {
    this.concepto = value
  }
  concepto: any
  grid_class_Css: any
  grid_galery: any
  carouselOptions = {
    items: 1,
    nav: false,
    dots: true,
    lazyLoad: false,
    loop: true,
    responsiveClass: true,
    autoplay: false,
    autoplayTimeout: 4000,
  }
  grid_layout: any = []
  concepto_array: any = []
  row: any
  screenWidth: any
  screenHeight: any
  //construira al regla de la caja de concepto
  elementos: any
  //variables para el slide
  noWrapSlides = false
  showIndicator = true
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900
    //aqui comenzamos a realizar el width de elementos
    this.construir_grid()
  }

  ngOnInit() {
    this.construir()
  }

  construir() {
    let h = 0
    let y_array: any = [
      ...new Set(
        this.concepto.elemento.data.layout.map((item: any) => item.y),
      ),
    ]

    y_array.forEach((itemy: any) => {
      this.row = this.concepto.elemento.data.layout.filter(
        (item: any) => item.y == itemy,
      )

      this.row.forEach((element: any) => {
        if (element.h <= 15) h = 4
        else h = 8
        if (element.y >= 15) element.y = 3
        if (element.x != 0) element.x = element.x * 2
        let Stylecss: any = {
          'grid-column-start': element.x + 1,
          'grid-column-end': element.w + element.x + 1,
          'grid-row-start': element.y + 1,
          'grid-row-end': element.y + h,
        }
        //if (element.x != 0) Stylecss['margin-left.px'] = 10;
        this.grid_layout.push(Stylecss)
        this.concepto_array.push(element)
      })
    })
  }

  construir_grid() {
    if (this.screenWidth > 1040) {
      this.grid_galery = {
        display: 'grid',
        'grid-template-columns': 'repeat(8, 113px)',
        'grid-template-rows': 'repeat(6, 100px)',
        'row-gap': '5px',
        'column-gap': '5px',
        'margin-left': '25px',
      }
    } else if (this.screenWidth <= 1040 && this.screenWidth > 768) {
      this.grid_galery = {
        display: 'grid',
        'grid-template-columns': 'repeat(8, 92px)',
        'grid-template-rows': 'repeat(6, 77px)',
        'row-gap': '1px',
        'column-gap': '5px',
      }
    } else if (this.screenWidth <= 768) {
      this.grid_galery = {
        display: 'grid',
        'grid-template-columns': 'repeat(8, 75px)',
        'grid-template-rows': 'repeat(6, 77px)',
        'row-gap': '1px',
        'column-gap': '1px',
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
    this.construir_grid()
  }
}
