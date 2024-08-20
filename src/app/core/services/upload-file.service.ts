import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private storage: Storage) {
  }

  async uploadFile(file: File): Promise<string> {
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const filePath = `multimedia/${uniqueId}.${fileExtension}`;
    const fileRef = ref(this.storage, filePath);
    
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      throw error;
    }
  }
}
