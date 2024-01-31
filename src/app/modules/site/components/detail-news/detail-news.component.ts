// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// Services
import { CmsService } from '@core/services-v2/cms.service';
import { IBlog } from '@core/models-v2/cms/blog-response.interface';

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.scss'],
})
export class DetailNewsComponent implements OnInit {
  post!: IBlog;
  content!: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.cmsService.getPostDetail(postId).subscribe({
      next: (res) => {
        this.post = res;
        this.content = this.getSafeHTML(this.post.text);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getSafeHTML(html: string): SafeHtml {
    const parentEmbed = this.createHtmlElement(html);
    console.log('parentEmbed: ', parentEmbed);

    // Obtiene iframes
    let oldIframe: any = parentEmbed.querySelectorAll('oembed');
    // Crear un array con esos iframes
    oldIframe = Array.from(oldIframe);

    for (const i in oldIframe) {
      // Obtener el atributo url del tag oembed.
      let url = oldIframe[i].getAttribute('url');
      // Reemplazar 'watch?v' con 'embed/'.
      url = url.replace('watch?v=', 'embed/');
      url = url.split('&t=5');

      // Crear un element html iframe y setear atributos.
      const newIframe = document.createElement('iframe');
      newIframe.setAttribute('width', '100%');
      newIframe.setAttribute('height', '500px;');
      newIframe.setAttribute('allowFullScreen', '');
      newIframe.setAttribute('frameBorder', '0');
      if (url) {
        newIframe.setAttribute('src', url[0]);
      }
      // replace oldIframe with newIframe
      oldIframe[i].parentNode.replaceChild(newIframe, oldIframe[i]);
    }

    const contentToRender = parentEmbed.outerHTML;
    console.log('contentToRender: ', contentToRender);
    // Obligatorio aplicarle el sanitizer.
    return this.sanitizer.bypassSecurityTrustHtml(contentToRender);
  }

  /**
   * Crear un span, a ese span insertar el html, y retornar el span creado.
   * @param str
   * @returns
   */
  private createHtmlElement(html: string): HTMLSpanElement {
    const domContainer = document.createElement('span');
    domContainer.innerHTML = html;
    return domContainer;
  }

  /**
   * Reemplazar todos los elementos OEmbed a IFrame.
   */
  private replaceEmbedToIFrame() {}
}
