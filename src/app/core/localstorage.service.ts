import { LocalStorageKeys } from './models/local-storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    public setItem(key: LocalStorageKeys, value: string): void {
      localStorage.setItem(key, value);
    }

    public getItem(key: LocalStorageKeys): string {
      return localStorage.getItem(key);
    }

    public hasItem(key: LocalStorageKeys): boolean {
      return localStorage.getItem(key) !== null;
    }

    public getItemAsObject<T>(key: LocalStorageKeys): T {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }

    public removeItem(key: LocalStorageKeys): void {
      localStorage.removeItem(key);
    }

    public clear(): void {
      localStorage.clear();
    }

}
