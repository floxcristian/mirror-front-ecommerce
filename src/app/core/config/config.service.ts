// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Models
import { IConfig } from './config.interface';
// Rxjs
import { Observable, tap } from 'rxjs';

@Injectable()
export class ConfigService {
  private config!: IConfig;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<IConfig> {
    return this.http
      .get<IConfig>('./assets/config/config.json')
      .pipe(tap((config) => (this.config = config)));
  }

  getConfig(): IConfig {
    return this.config;
  }
}
