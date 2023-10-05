import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CmsService } from '../../../../shared/services/cms.service'
import { DomSanitizer } from '@angular/platform-browser'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'

declare let iframely: any

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.scss'],
})
export class DetailNewsComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private cmsService: CmsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}
  noticia: any = {}

  ngOnInit() {
    let body = ''
    this.noticia.page_id = this.route.snapshot.params['id']
    this.cmsService.obtenerPost(this.noticia).subscribe((resp) => {
      this.noticia = resp

      this.noticia.texto = this.noticia.texto.replace(
        /<h4>/g,
        `<h4 style="font-size:19px !important">`,
      )
      this.noticia.texto = this.prueba(this.noticia.texto)
    })
  }
  prueba(html: any) {
    const embed = this.noticia.texto

    const parentEmbed = this.stringToHTML(embed)

    let oldIframe: any = parentEmbed.querySelectorAll('oembed')
    oldIframe = Array.from(oldIframe)

    for (const i in oldIframe) {
      //Get the url from oembed tag
      let url = oldIframe[i].getAttribute('url')
      let heigth = oldIframe
      //Replace 'watch?v' with 'embed/'
      url = url.replace('watch?v=', 'embed/')
      url = url.split('&t=5')

      //Create a iframe tag
      const newIframe = document.createElement('iframe')
      newIframe.setAttribute('width', '100%')
      newIframe.setAttribute('height', '500px;')
      newIframe.setAttribute('allowFullScreen', '')
      newIframe.setAttribute('frameBorder', '0')
      if (url) {
        newIframe.setAttribute('src', url[0])
      }
      // replace oldIframe with newIframe
      oldIframe[i].parentNode.replaceChild(newIframe, oldIframe[i])
    }

    const contentToRender = parentEmbed.outerHTML
    console.log(contentToRender)
    return this.sanitizer.bypassSecurityTrustHtml(contentToRender)
  }
  stringToHTML(str: any) {
    const domContainer = document.createElement('span')
    domContainer.innerHTML = str
    return domContainer
  }
}
