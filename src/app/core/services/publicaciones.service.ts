import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Publication } from '../models/publications.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private dbPath = '/publications';
  private _publicationsRef: AngularFirestoreCollection<Publication>;

  constructor(private db: AngularFirestore) {
    this._publicationsRef = db.collection(this.dbPath);
  }

  async getAll(): Promise<Publication[]> {
    try {
      const snapShosts = await this._publicationsRef.ref
      .orderBy('created_at', 'desc').limit(10).get();
      const list = snapShosts.docs.map(snapshot => ({id: snapshot.id, ...snapshot.data()}) as Publication);
      return list;
    } catch (error) {
      throw error;
    }
  }

  create(pub: Publication): Promise<any> {
    return this._publicationsRef.add({...pub});
  }

  update(id: string, pub: Publication): Promise<void> {
    return this._publicationsRef.doc(id).update(pub);
  }

  delete(id: string): Promise<void> {
    return this._publicationsRef.doc(id).delete();
  }
}
