import { Component, Input, OnInit } from '@angular/core'
import { Product } from '../../../../shared/interfaces/product'

@Component({
  selector: 'app-detalle-tecnicos',
  templateUrl: './detalle-tecnicos.component.html',
  styleUrls: ['./detalle-tecnicos.component.scss'],
})
export class DetalleTecnicosComponent implements OnInit {
  @Input() producto!: Product | undefined

  w100!: boolean
  innerWidth!: number
  videoWidth = 0
  videoHeight = 0

  constructor() {}

  ngOnInit() {}

  getIdVideo(url: string) {
    const idVideo = url.split('/')
    return idVideo[idVideo.length - 1]
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth
    this.setVideoDimensiones()
  }

  setVideoDimensiones() {
    if (this.innerWidth > 1200) {
      this.videoWidth = 450
      this.videoHeight = 250
    } else {
      this.videoWidth = 300
      this.videoHeight = 150
    }
  }
}
