import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private prefix: string = '';

  constructor() {}

  get(key: string) {
    return localStorage.getItem(this.prefix + key);
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
    localStorage.setItem(this.prefix + key, value);
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

  remove(key: string) {
    localStorage.removeItem(`${this.prefix}${key}`);
  }
}
