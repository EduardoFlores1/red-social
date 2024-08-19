import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserCreateDTO, UserDTO } from '../models/user-dto.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _afAuth: AngularFireAuth,
    private _userService: UserService
  ) {}

  // registra un usuario, luego crea un doc del usuario en firestore db
  async doRegister(userCreate: UserCreateDTO): Promise<void> {
    try {
      const userCredential = await this._afAuth.createUserWithEmailAndPassword(
        userCreate.email,
        userCreate.password
      );
      const user = userCredential.user;
      if(user) {
        await this._userService.createDoc({
          uid: user.uid,
          displayName: userCreate.username
        });
      }
      
    } catch (error) {
      throw error;
    }
  }

  doLogin(user: UserDTO): Promise<any> {
    return this._afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  doLogout(): Promise<void> {
    return this._afAuth.signOut();
  }
}
