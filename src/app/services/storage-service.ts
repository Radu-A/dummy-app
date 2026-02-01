import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem(itemName: string, item: string) {
    try {
      localStorage.setItem(itemName, item);
    } catch (error) {
      throw `Error saving file in local storage: ${error}`;
    }
  }
  getItem(itemName: string) {
    try {
      return localStorage.getItem(itemName);
    } catch (error) {
      throw `Error loading file in local storage: ${error}`;
    }
  }
  removeItem(itemName: string) {
    try {
      localStorage.removeItem(itemName);
    } catch (error) {
      throw `Error deleting file in local storage: ${error}`;
    }
  }
}
