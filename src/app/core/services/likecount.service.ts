import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { LikeCount } from '../models/likecount.model';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikecountService {

  private dbPath = '/likecount';
  private _likecountRef: AngularFirestoreCollection<LikeCount>;

  constructor(private db: AngularFirestore) { 
    this._likecountRef = db.collection(this.dbPath);
  }

  getLikeCountsOnChange(idPublication: string) {
    return new Observable<number>((subscriber: Subscriber<number>) => {
      this._likecountRef.ref.where('publication_id', '==', idPublication).limit(1)
        .onSnapshot(snapshot => {
          if(!snapshot.empty) {
            subscriber.next(snapshot.docs[0].data().count);
          }else {
            subscriber.error('Error al encontrar el numero de likes!');
          }
        });
    });
  }

  createDoc(idPub: string): Promise<any> {
    return this._likecountRef.add({ publication_id: idPub, count: 0 });
  }

  // falta
  private addLike(idPub: String, idUser?: string) {
    return this._likecountRef.ref.where('publication_id', '==', idPub).get()
  }
}
