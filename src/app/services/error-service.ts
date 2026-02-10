import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  isError = signal<boolean>(false);
  errorMessage = signal<string>('');

  setError(state: boolean, message: string) {
    this.isError.set(state);
    this.errorMessage.set(message);
    console.log('isError: ', this.isError());
  }
}
