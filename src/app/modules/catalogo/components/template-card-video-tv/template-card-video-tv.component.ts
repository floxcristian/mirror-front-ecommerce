import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-template-card-video-tv',
  templateUrl: './template-card-video-tv.component.html',
  styleUrls: ['./template-card-video-tv.component.scss']
})
export class TemplateCardVideoTvComponent implements OnInit {
  @Input() layout: any = [];

  videos:any = [];
  indice: number = 0;
  videoPlay: any;
  videoConfig!: any;
  interval:any[] = [];
  hgth!: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.videos = this.layout.contenido;
    if (this.videos.length > 1) {
      for (let i = 0; i < 10; i++) {
        clearInterval(this.interval[i]);
      }
      console.log('Multiple video');
      this.reproduccion();
    } else {
      console.log('Single video');
      this.videoPlay = this.getVideoTag(this.videos[0].url, this.layout.height);
    }
  }

  async reproduccion() {
    if (this.videos[this.indice] === undefined) this.indice = 0;
    this.videoPlay = this.getVideoTag(this.videos[this.indice].url, this.layout.height);
    this.videoConfig = this.videos[this.indice];
    // Convierte tiempo en milisegundos
    const duracionMili = this.videoConfig.duracion.seg * 1000;

    console.log('video activo: ', this.videoConfig);
    console.log(this.videoConfig.duracion, duracionMili);

    this.interval[this.indice] = setInterval(() => {
      // Cuando se cumple el tiempo de la reproduccion actual, pasa a la siguiente propaganda
      clearInterval(this.interval[this.indice]);
      this.indice++;
      this.reproduccion();
    }, duracionMili);
  }

  private getVideoTag(link: string, height: string) {
    this.hgth = '569px';
    if (height === 'height:290px') this.hgth = '958px';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<video style="height: ${this.hgth};background: #000;width: 100%" muted loop autoplay playsinline disableRemotePlayback>
            <source src="${link}" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>`
    );
  }
}
