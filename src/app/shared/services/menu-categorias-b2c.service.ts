// Angular
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// Rxjs
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuCategoriasB2cService {
  private openSubject$: BehaviorSubject<any> = new BehaviorSubject(false);
  readonly isOpen$: Observable<any> = this.openSubject$.asObservable();

  private openNivel2Subject$: BehaviorSubject<any> = new BehaviorSubject({
    visible: false,
    seleccion: '',
  });
  readonly isOpenNivel2$: Observable<any> =
    this.openNivel2Subject$.asObservable();

  private openNivel3Subject$: BehaviorSubject<any> = new BehaviorSubject({
    visible: false,
    seleccion: '',
  });
  readonly isOpenNivel3$: Observable<any> =
    this.openNivel3Subject$.asObservable();

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: any
  ) {}

  open(nivel: number | null = null, seleccion: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const bodyWidth = document.body.offsetWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight =
        document.body.offsetWidth - bodyWidth + 'px';

      if (nivel === null) {
        this.openSubject$.next(true);
      } else {
        if (nivel === 2) {
          this.openNivel2Subject$.next({ visible: true, seleccion });
        } else if (nivel === 3) {
          this.openNivel3Subject$.next({ visible: true, seleccion });
        }
      }
    }
  }

  close(nivel: number | null = null): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '';

      if (nivel === null) {
        this.openSubject$.next(false);
      } else {
        if (nivel === 2) {
          this.openNivel2Subject$.next({ visible: false, seleccion: null });
        } else if (nivel === 3) {
          this.openNivel3Subject$.next({ visible: false, seleccion: null });
        }
      }
    }
  }
  //NO SE UTILIZA
  // toggle(nivel: number | null = null): void {
  //   if (nivel === null) {
  //     this.openSubject$.next(!this.openSubject$.value);
  //   } else {
  //     if (nivel === 2) {
  //       this.openNivel2Subject$.next(!this.openNivel2Subject$.value);
  //     } else if (nivel === 3) {
  //       this.openNivel3Subject$.next(!this.openNivel3Subject$.value);
  //     }
  //   }
  // }
}
