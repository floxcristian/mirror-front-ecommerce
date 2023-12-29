// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Models
import { IConfig } from './config.interface';
// Rxjs
import { tap } from 'rxjs';

@Injectable()
export class ConfigService {
  private config!: IConfig;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http
      .get<IConfig>('./assets/config/config.json')
      .pipe(tap((config) => (this.config = config)))
      .toPromise();
  }

  getConfig(): IConfig {
    return this.config;
  }
}
