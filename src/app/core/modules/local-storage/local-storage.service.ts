// Angular
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private prefix: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  private isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get(key: string) {
    if (!this.isLocalStorageAvailable()) return null;
    const data: any = localStorage.getItem(this.prefix + key) as any;
    try {
      return JSON.parse(data);
    } catch (err) {
      return data;
    }
    //return JSON.parse(data);
  }

  /*
  override getItem<T>(key: string): T | null {
    const data = localStorage.getItem(this.prefix + key);
    if (data !== null) {
      return JSON.parse(data) as T;
    }
    return null;
  }*/

  set(key: string, value: any): void {
    if (!this.isLocalStorageAvailable()) return;
    if (typeof value === 'object') {
      const data = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, data);
    } else {
      localStorage.setItem(this.prefix + key, value);
    }
  }

  /*
  override setItem(key: string, value: unknown): void {
    const data = JSON.stringify(value);
    localStorage.setItem(this.prefix + key, data);
  }*/

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  clear(): void {
    for (let key in localStorage) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  remove(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(`${this.prefix}${key}`);
    }
  }
}
