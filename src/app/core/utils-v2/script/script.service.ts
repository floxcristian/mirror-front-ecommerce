// Angular
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
// Models
import { ILoadScriptResponse } from './load-script-response.interface';
import { IScript } from './script.interface';
@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private scripts: { [key: string]: IScript } = {};
  private renderer: Renderer2;

  constructor(
    private readonly rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  loadScript(src: string): Promise<ILoadScriptResponse> {
    return new Promise((resolve, reject) => {
      if (this.scripts[src]?.loaded) {
        return resolve({ loaded: true, status: 'Already Loaded.' });
      }

      if (this.scripts[src] && !this.scripts[src].loaded) {
        this.removeScript(src);
      }

      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      // Es necesario poner los 2?
      // TODO: yo aceptaría un parámetro para indicar si es async o defer.
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scripts[src] = { src, loaded: true };
        return resolve({ loaded: true, status: 'Loaded.' });
      };
      script.onerror = (error: any) => {
        this.scripts[src] = { src, loaded: false };
        reject(error);
      };

      this.renderer.appendChild(this.document.head, script);
    });
  }

  /**
   * Remover script del DOM.
   * @param id
   */
  private removeScript(src: string): void {
    const scripts = this.document.getElementsByTagName('script');
    for (let i = scripts.length; i--; ) {
      if (scripts[i].src === src) {
        scripts[i].parentNode?.removeChild(scripts[i]);
      }
    }
  }
}
