import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressRequestService {

  showProgress = signal<boolean>(false);

  open() {
    this.showProgress.set(true);
  }
  close() {
    this.showProgress.set(false);
  }
}
