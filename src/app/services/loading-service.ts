import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // Use signal cause Behaviour Subject works funny
  isLoading = signal<boolean>(false);

  setLoading(state: boolean) {
    this.isLoading.set(state);
    console.log('isLoading: ', this.isLoading());
  }
}
