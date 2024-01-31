// Angular
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// Models
import { IBlog } from '@core/models-v2/cms/blog-response.interface';
// Services
import { CmsService } from '@core/services-v2/cms.service';

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
    private readonly renderer: Renderer2,
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.cmsService.getPostDetail(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.content = this.formatHtmlContent(this.post.text);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private formatHtmlContent(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let htmlContent = this.replaceOembedElements(doc);
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  /**
   * Reemplazar elementos oembed por iframes.
   * @param doc
   * @returns
   */
  private replaceOembedElements(doc: Document): string {
    const oembedElements = doc.querySelectorAll('oembed');
    oembedElements.forEach((oembedElement) => {
      // Obtener url válida para el iframe.
      const url = oembedElement.getAttribute('url') || '';
      const newUrl = url.replace('watch?v=', 'embed/').split('&t=')[0];

      // Crear iframe y setear atributos.
      const iframeElement = this.renderer.createElement('iframe');
      this.renderer.setAttribute(iframeElement, 'src', newUrl);
      this.renderer.setAttribute(iframeElement, 'width', '100%');
      this.renderer.setAttribute(iframeElement, 'height', '500px');
      this.renderer.setAttribute(iframeElement, 'allowFullScreen', '');
      this.renderer.setAttribute(iframeElement, 'frameBorder', '0');

      // Reemplazar el elemento oembed con el nuevo elemento iframe.
      if (oembedElement.parentNode) {
        oembedElement.parentNode.replaceChild(iframeElement, oembedElement);
      }
    });
    return doc.body.innerHTML;
  }
}
