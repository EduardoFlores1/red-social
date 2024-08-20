import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Publication } from '../models/publications.model';
import { UploadFileService } from './upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private dbPath = '/publications';
  private _publicationsRef: AngularFirestoreCollection<Publication>;

  constructor(private db: AngularFirestore, private uploadService: UploadFileService) {
    this._publicationsRef = db.collection(this.dbPath);
  }

  getAll() {
    return this._publicationsRef.ref.orderBy('created_at', 'desc').limit(20);
  }

  async create(titlePub: string, idUser: string, file: File): Promise<any> {
    try {
      const urlFile = await this.uploadService.uploadFile(file);
      await this.insertPub(titlePub, idUser, urlFile);
    } catch (error) {
      throw error;
    }
  }

  private async insertPub(titlePub: string, user_id: string, urlFile: string): Promise<any> {
    try {
      await this.db.firestore.runTransaction(async (transaction) => {
        const pubRef = this.db.firestore.collection('publications').doc(); // Crea la referencia del documento
        transaction.set(pubRef, {
            user_id: user_id,
            title: titlePub,
            url: urlFile,
            created_at: new Date().toISOString()
        });
        
        const pubDocId = pubRef.id; // Obtiene el ID del documento
        const likeRef = this.db.firestore.collection('likecount').doc();
        transaction.set(likeRef, {
            publication_id: pubDocId, 
            count: 0 
        });
    });
    } catch (error) {
      throw error;
    }
  }

  update(id: string, pub: Publication): Promise<void> {
    return this._publicationsRef.doc(id).update(pub);
  }

  delete(id: string): Promise<void> {
    return this._publicationsRef.doc(id).delete();
  }
}
