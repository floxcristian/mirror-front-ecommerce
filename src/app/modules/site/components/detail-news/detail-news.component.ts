// Angular
import { Component, OnInit } from '@angular/core';
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
    private readonly cmsService: CmsService
  ) {
    console.log('blog detail');
  }

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
        this.noticia.text = this.prueba(this.noticia.text);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  prueba(html: any): SafeHtml {
    const embed = this.noticia.text;

    const parentEmbed = this.stringToHTML(embed);

    let oldIframe: any = parentEmbed.querySelectorAll('oembed');
    oldIframe = Array.from(oldIframe);

    for (const i in oldIframe) {
      //Get the url from oembed tag
      let url = oldIframe[i].getAttribute('url');
      //let heigth = oldIframe;
      //Replace 'watch?v' with 'embed/'
      url = url.replace('watch?v=', 'embed/');
      url = url.split('&t=5');

      //Create a iframe tag
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
    console.log(contentToRender);
    return this.sanitizer.bypassSecurityTrustHtml(contentToRender);
  }

  stringToHTML(str: any): HTMLSpanElement {
    const domContainer = document.createElement('span');
    domContainer.innerHTML = str;
    return domContainer;
  }
}
