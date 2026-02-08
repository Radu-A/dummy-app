import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem(itemName: string, item: any) {
    try {
      localStorage.setItem(itemName, JSON.stringify(item));
    } catch (error) {
      throw `Error saving file in local storage: ${error}`;
    }
  }

  getItem(itemName: string) {
    try {
      const data = localStorage.getItem(itemName);
      if (data) {
        return JSON.parse(data);
      } else {
        console.log(`Nothing in local storage with that name.`);
        return false;
      }
    } catch (error) {
      console.log(`Error loading file in local storage: ${error}`);
      return false;
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
