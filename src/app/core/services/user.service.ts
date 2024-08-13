import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  private user$: Observable<any>;

  constructor(private _afAuth: AngularFireAuth) {
    this.user$ = this.userSubject.asObservable();

    this._afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userSubject.next(user);
      } else {
        this.userSubject.error('Usuario no logueado!');
      }
    });
  }

  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  async updateCurrentUser(userUpdateProfile: any): Promise<void> {
    const user = await this._afAuth.currentUser;
    if (user) {
      await user.updateProfile({
        displayName: userUpdateProfile.displayName,
        photoURL: userUpdateProfile.photoURL,
      });
    } else {
      throw new Error('Usuario no logueado!');
    }
  }
}
