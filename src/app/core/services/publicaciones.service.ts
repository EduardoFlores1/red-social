import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Publications } from '../models/publications.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private dbPath = '/publications';
  _publicationsRef: AngularFirestoreCollection<Publications>;

  constructor(private db: AngularFirestore) {
    this._publicationsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Publications> {
    return this._publicationsRef;
  }

  create(pub: Publications): any {
    return this._publicationsRef.add({...pub});
  }

  update(id: string, pub: Publications): Promise<void> {
    return this._publicationsRef.doc(id).update(pub);
  }

  delete(id: string): Promise<void> {
    return this._publicationsRef.doc(id).delete();
  }
}
