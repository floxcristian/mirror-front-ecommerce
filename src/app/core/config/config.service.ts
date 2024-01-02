// Angular
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Models
import { IConfig } from './config.interface';
// Rxjs
import { Observable, tap } from 'rxjs';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class ConfigService {
  private config!: IConfig;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request
  ) {}

  loadConfig(): Observable<IConfig> {
    let filePath = './assets/config/config.json';
    if (isPlatformServer(this.platformId) && this.request) {
      filePath = this.getFullUrl() + '/assets/config/config.json';
    }
    console.log('configPath: ' + filePath);

    return this.http.get<IConfig>(filePath).pipe(
      tap((config) => {
        this.config = config;
        console.log('config: ', config);
      })
    );
  }

  getConfig(): IConfig {
    return this.config;
  }

  private getFullUrl() {
    const protocol = this.request.protocol; // 'http' or 'https'
    const host = this.request.headers.host;
    return `${protocol}://${host}`; // Constructs the full URL
  }
}
