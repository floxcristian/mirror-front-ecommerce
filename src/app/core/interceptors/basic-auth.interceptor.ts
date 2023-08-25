import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
var username: String = 'services';
var password: String = '0.=j3D2ss1.w29-';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  authdata: any;
  str = username + ':' + password;

  constructor(@Inject(PLATFORM_ID) private plataformaId: any) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.plataformaId)) {
      this.authdata = window.btoa(username + ':' + password);
    } else {
      // const buff = Buffer.Buffer.from(this.str);
      // this.authdata = buff.toString('base64');
      this.authdata = 'c2VydmljZXM6MC49ajNEMnNzMS53Mjkt';
    }

    var v:any = {
      Authorization: `Basic ${this.authdata}`,
      'Access-Control-Allow-Headers': 'Authorization, Access-Control-Allow-Headers'
    };

    if (request.url.includes('api/carro')) {
      v['Access-Control-Allow-Origin'] = '*';
    }

    const headers = new HttpHeaders(v);
    const cloneReq = request.clone({ headers });
    return next.handle(cloneReq);
  }
}
