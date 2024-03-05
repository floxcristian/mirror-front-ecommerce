import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CmsService } from '@core/services-v2/cms.service';
import { IBlog } from '@core/models-v2/cms/blog-response.interface';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-blog',
  templateUrl: './page-blog.component.html',
  styleUrls: ['./page-blog.component.scss'],
})
export class PageBlogComponent implements OnInit {
  noticia!: IBlog;
  noticias: IBlog[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private readonly csmService: CmsService,
  ) {}

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.csmService.getPosts(0).subscribe({
      next: (res) => {
        this.noticias = res.data;
        this.noticia = res.data[0];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  verNoticia(noticia: IBlog) {
    this.localStorage.set('noticia', noticia);
    this.router.navigate(['/sitio/detail-news', noticia.pageId]);
  }
}
