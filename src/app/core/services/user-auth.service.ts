import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  // ReplaySubject se crea sin un valor, evitamos inicializarlo con null
  // al cargar evitamos errores por inicializar en null
  private _currentUserSubject = new ReplaySubject<User | null>(1);
  private _currentUser$: Observable<User | null>;

  constructor(private _afAuth: AngularFireAuth) { 
    this._currentUser$ = this._currentUserSubject.asObservable();
    this.onChangeUserInit();
    
  }

  // escucha los estados del user auth y los emite
  private onChangeUserInit() {
    this._afAuth.onAuthStateChanged(
      (user) => {
        if(user) {
          this._currentUserSubject.next(user as User);
        }else {
          this._currentUserSubject.next(null);
        }
      }
    );
  }

  // retorna al user auth, emitiendo sus estados
  // solo exponemos un observable, mas no al subject
  getCurrentUserAuth(): Observable<User | null> {
    return this._currentUser$;
  }

  // no se usará, por el momento...
  private async updateCurrentUser(userUpdateProfile: any): Promise<void> {
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
