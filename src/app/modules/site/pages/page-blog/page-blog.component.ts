import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CmsService } from '../../../../shared/services/cms.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-blog',
  templateUrl: './page-blog.component.html',
  styleUrls: ['./page-blog.component.scss'],
})
export class PageBlogComponent implements OnInit {
  noticia!: string;
  noticias: any[] = [];
  innerWidth: number;

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private cms: CmsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.cms.obtenerPosts().subscribe((r: any) => {
      this.noticia = r[0];
      this.noticias = r;
    });
  }

  verNoticia(noticia: any) {
    this.localStorage.set('noticia', noticia);
    this.router.navigate(['/sitio/detail-news', noticia.page_id]);
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
