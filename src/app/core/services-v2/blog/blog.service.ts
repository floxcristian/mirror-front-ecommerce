// Angular
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private renderer: Renderer2;
  constructor(private readonly rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Formatear contenido HMTL.
   * @param html
   * @returns
   */
  formatHtmlContent(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let htmlContent = this.replaceOembedElements(doc);
    return htmlContent;
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
