// Angular
import { Component, OnInit } from '@angular/core';
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
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.cmsService.getPostDetail(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.content = this.sanitizer.bypassSecurityTrustHtml(this.post.text);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
