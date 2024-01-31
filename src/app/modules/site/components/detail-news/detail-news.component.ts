import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// Services
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.scss'],
})
export class DetailNewsComponent implements OnInit {
  noticia!: any; //IBlog;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private renderer:Renderer2,
    //ServicesV2
    private readonly cmsService:CmsService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.cmsService.getPostDetail(postId).subscribe({
      next: (res) => {
        console.log('res: ', res);
        this.noticia = res;
        this.noticia.text = this.noticia.text.replace(
          /<h4>/g,
          `<h4 style="font-size:19px !important">`
        );
        this.noticia.text = this.generarIframe();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  generarIframe() {
    const embed = this.noticia.text;
    const parentEmbed = this.stringToHTML(embed);

    let oldIframe:any = parentEmbed.querySelectorAll('oembed')
    oldIframe = Array.from(oldIframe);

    for (const i in oldIframe) {
      //Get the url from oembed tag
      let url = oldIframe[i].getAttribute('url');
      //Replace 'watch?v' with 'embed/'
      url = url.replace('watch?v=', 'embed/');
      url = url.split('&t=5');

      //Create a iframe tag
      const newIframe = this.renderer.createElement('iframe')
      this.renderer.setAttribute(newIframe, 'width', '100%');
      this.renderer.setAttribute(newIframe, 'height', '500px');
      this.renderer.setAttribute(newIframe, 'allowFullScreen', '');
      this.renderer.setAttribute(newIframe, 'frameBorder', '0');
      if (url) {
        this.renderer.setAttribute(newIframe, 'src', url[0]);
      }
      // replace oldIframe with newIframe
      oldIframe[i].parentNode.replaceChild(newIframe, oldIframe[i]);
    }

    const contentToRender = parentEmbed.outerHTML;
    return this.sanitizer.bypassSecurityTrustHtml(contentToRender);
  }

  stringToHTML(str: string):HTMLElement {
    const domContainer = this.renderer.createElement('span');
    this.renderer.setProperty(domContainer,'innerHTML',str)
    return domContainer;
  }
}
