import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { getStorage } from '@angular/fire/storage';
import firebase from 'firebase/compat/app';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  

  private storage: Storage;

  constructor() {
    this.storage = getStorage(); // Inicializa el almacenamiento de Firebase
  }
  async subirImagen(nombre: string, file: File): Promise<string> {
    const filePath = `users/${nombre}`;
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        snapshot => {
        },
        error => {
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(fileRef);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }




  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }


}
