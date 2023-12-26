import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { PageHomeService } from '../../services/pageHome.service';
import { CmsService } from '@core/services-v2/cms.service';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  @Input() set config(value: any) {
    this.data = value;
    if (this.data) {
      if (value.element) {
        this.data = value.element;
      } else {
        this.data = value;
      }
      this.fetchBlogs();
    }
  }
  blogs: any[] = [];
  collapsedState = true;
  @Input() id!: string;
  data: any;
  currentOpenItemIndex = 0;
  @Output() elementoEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    // private cmsService: CmsService
    //Services V2
    private readonly cmsService: CmsService
  ) {}

  ngOnInit(): void {}

  openFirst() {
    this.blogs[1].collapsed = !this.blogs[1].collapsed;
  }

  fetchBlogs() {
    let quantity = 5;
    this.cmsService.getPosts(quantity).subscribe({
      next: (res) => {
        this.blogs = res.data;
        this.blogs = this.blogs.map((item, index) => ({
          ...item,
          collapsed: index === this.currentOpenItemIndex,
        }));
        if (this.blogs.length) {
          setInterval(() => {
            this.blogs[this.currentOpenItemIndex].collapsed = false;
            this.currentOpenItemIndex =
              this.currentOpenItemIndex === this.blogs.length - 1
                ? 0
                : this.currentOpenItemIndex + 1;
            this.clickCollapse(this.currentOpenItemIndex);
          }, 5000);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clickCollapse(index: number) {
    this.currentOpenItemIndex = index;
    this.blogs.forEach((blogItem, blogItemIndex) => {
      if (index === blogItemIndex) blogItem.collapsed = !blogItem.collapsed;
      else blogItem.collapsed = false;
    });
  }

  showBlogPost(pageId: string, index: number): void {
    this.currentOpenItemIndex = index;
    window.open(
      `https://www.implementos.cl/sitio/detail-news/${pageId}`,
      '_blank'
    );
  }
}
