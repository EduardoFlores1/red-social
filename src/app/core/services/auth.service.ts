import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserCreateDTO, UserDTO } from '../models/user-dto.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _afAuth: AngularFireAuth) {}

  // registra al usuario, seguido le setea un displayName
  async doRegister(userCreate: UserCreateDTO): Promise<void> {
    try {
      const userCredential = await this._afAuth.createUserWithEmailAndPassword(
        userCreate.email,
        userCreate.password
      );
      const user = userCredential.user;
      if (user) {
        await user.updateProfile({ displayName: userCreate.displayName });
      }
    } catch (error) {
      throw error;
    }
  }

  // return userCredencial
  doLogin(user: UserDTO): Promise<any> {
    return this._afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  doLogout(): Promise<void> {
    return this._afAuth.signOut();
  }
}
