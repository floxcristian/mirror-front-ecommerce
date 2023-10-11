import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RootService } from '../../shared/services/root.service';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CanonicalService } from '../../shared/services/canonical.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-b2b',
  templateUrl: './b2b.component.html',
  styleUrls: ['./b2b.component.scss'],
})
export class B2bComponent {
  headerLayout!: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public root: RootService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    private canonicalService: CanonicalService
  ) {
    this.route.data.subscribe(
      (data) => (this.headerLayout = data['headerLayout'])
    );
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
    this.titleService.setTitle('Implementos - B2B');
    if (isPlatformBrowser(this.platformId)) {
      this.canonicalService.setCanonicalURL(location.href);
      // this.isBrowser = true;   //No utilizada
    }
    if (isPlatformServer(this.platformId)) {
      this.canonicalService.setCanonicalURL(
        environment.canonical + this.router.url
      );
    }
  }
}
