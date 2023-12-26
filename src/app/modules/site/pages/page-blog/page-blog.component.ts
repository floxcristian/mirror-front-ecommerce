import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { CmsService } from '@core/services-v2/cms.service';
import { IBlog } from '@core/models-v2/cms/blog-response.interface';

@Component({
  selector: 'app-page-blog',
  templateUrl: './page-blog.component.html',
  styleUrls: ['./page-blog.component.scss'],
})
export class PageBlogComponent implements OnInit {
  noticia!: IBlog;
  noticias: IBlog[] = [];
  innerWidth: number;

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    //ServicesV2
    private readonly csmService:CmsService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.csmService.getPosts(0).subscribe({
      next:(res)=>{
        this.noticias = res.data
        this.noticia = res.data[0]
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  verNoticia(noticia: IBlog) {
    this.localStorage.set('noticia', noticia);
    this.router.navigate(['/sitio/detail-news', noticia.pageId]);
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
