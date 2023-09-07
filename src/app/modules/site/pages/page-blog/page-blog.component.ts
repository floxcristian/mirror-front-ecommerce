import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CmsService } from '../../../../shared/services/cms.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-blog',
  templateUrl: './page-blog.component.html',
  styleUrls: ['./page-blog.component.scss']
})
export class PageBlogComponent implements OnInit {

  noticia!: string;
  noticias: any[] = [];
  innerWidth: number;

  constructor(
      private localStorage : LocalStorageService, 
      private router : Router,
      private cms: CmsService,

  ) {
      this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.cms.obtenerPosts()
          .subscribe((r: any) => {

             // console.log(r.data[0]);

              this.noticia = r.data[0];
              this.noticias = r.data;
          });
  }

  verNoticia(noticia:any) {
    this.localStorage.set('noticia', noticia);
    this.router.navigate(['/sitio/detail-news',noticia.page_id]);
  }

  onResize(event:any) {
    this.innerWidth = event.target.innerWidth;
  }

}
