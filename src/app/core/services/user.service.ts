import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private dbPath = '/users';
  private _usersRef: AngularFirestoreCollection<User>;

  private _userAuthService = inject(UserAuthService);
  private _userPerfil = signal<User | null>(null);

  constructor(private db: AngularFirestore) {
    this._usersRef = db.collection(this.dbPath);
    this.getCurrentUserDocOnChange();
  }

  currentUserDoc = computed(() => this._userPerfil());

  private getCurrentUserDocOnChange() {
    this._userAuthService.getCurrentUserAuth().subscribe({
      next: (user) => {
        if (user) {
          this.getUserBiUID(user.uid)
            .then((user: User) => {
              this._userPerfil.set(user);
            })
            .catch(error => {
              this._userPerfil.set(null);
              console.log(error);
            })
        } else {
          this._userPerfil.set(null);
        }
      },
    });
  }

  private getUserBiUID(userUID: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this._usersRef.ref.where('uid', '==', userUID).limit(1).get()
      .then((snapshot) => {
        if(!snapshot.empty) {
          resolve(snapshot.docs[0].data() as User);
        }else {
          reject("Usuario no encontrado!");
        }
      })
      .catch(error => reject(error));
    });
  }

  createDoc(user: User): Promise<any> {
    return this._usersRef.add({ ...user });
  }

  getUserById(idUser: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this._usersRef.ref.doc(idUser).get()
        .then(snapshot => {
          if(snapshot.exists) {
            resolve(snapshot.data() as User)
          }else {
            reject(new Error('Usuario no encontrado!'))
          }
        })
        .catch(error => reject(error))
    })
  }
}
