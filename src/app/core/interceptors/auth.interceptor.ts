import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SessionTokenStorageService } from '@core/storage/session-token-storage.service';
import { AuthApiService } from '@core/services-v2/auth.service';
var username: String = 'services';
var password: String = '0.=j3D2ss1.w29-';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authdata: any;
  str = username + ':' + password;

  constructor(
    @Inject(PLATFORM_ID) private plataformaId: any,
    // Services V2
    private readonly authApiService: AuthApiService,
    private readonly sessionTokenStorage: SessionTokenStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newReq = request.clone();

    const tokens = this.sessionTokenStorage.get();
    if (tokens && request.url.includes('api/v')) {
      const accessToken = tokens.accessToken;
      newReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + accessToken),
      });
    } else {
      if (isPlatformBrowser(this.plataformaId)) {
        this.authdata = window.btoa(username + ':' + password);
      } else {
        this.authdata = 'c2VydmljZXM6MC49ajNEMnNzMS53Mjkt';
      }

      newReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Basic ' + this.authdata
        ),
      });
    }

    return next.handle(newReq).pipe(
      catchError((error) => {
        if (error.status === 401 && tokens) {
          const refreshToken = tokens.refreshToken;
          if (refreshToken) {
            return this.authApiService.refreshToken(refreshToken).pipe(
              switchMap((resp) => {
                this.sessionTokenStorage.set(resp);
                const accessToken = resp.accessToken;
                newReq = request.clone({
                  headers: request.headers.set(
                    'Authorization',
                    'Bearer ' + accessToken
                  ),
                });
                return next.handle(newReq);
              }),
              catchError((error) => {
                return throwError(() => new Error(error));
              })
            );
          }
          return throwError(() => new Error(error));
        }
        return throwError(() => new Error(error));
      })
    );
  }
}
