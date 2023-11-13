import {
  Component,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  HostListener,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RootService } from '../../shared/services/root.service';
import { Title } from '@angular/platform-browser';
import { CanonicalService } from '../../shared/services/canonical.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '@env/environment';
@Component({
  selector: 'app-b2c',
  templateUrl: './b2c.component.html',
  styleUrls: ['./b2c.component.scss'],
})
export class B2cComponent implements AfterViewInit {
  headerLayout!: 'classic' | 'compact';
  loadingPage = true;
  @Input() tipo!: string;

  innerWidth: number;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public root: RootService,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    private canonicalService: CanonicalService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;

    this.route.data.subscribe(
      (data) => (this.headerLayout = data['headerLayout'])
    );
    this.root.path = this.router
      .createUrlTree(['./'], { relativeTo: route })
      .toString();
    this.titleService.setTitle(
      'Implementos - Repuestos para Camiones, Buses y Remolques'
    );

    if (isPlatformBrowser(this.platformId)) {
      this.canonicalService.setCanonicalURL(location.href);
    }

    if (isPlatformServer(this.platformId)) {
      this.canonicalService.setCanonicalURL(
        environment.canonical + this.router.url
      );
    }
  }

  ngAfterViewInit() {
    this.removeLoading();
  }

  removeLoading() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.loadingPage = false;
      }, 1000);
    } else {
      this.loadingPage = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
}
