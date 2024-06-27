import { Injectable, inject } from '@angular/core';
import { DocumentReference, Firestore, collection,collectionData, doc, updateDoc} from '@angular/fire/firestore';
import { Auth,user } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UsuarioGenerico } from '../interfaces/Usuarios';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor() { }
  firebaseAuth = inject(Auth)
  firestore = inject(Firestore);
  user$ = user(this.firebaseAuth);
  userCollection = collection(this.firestore, 'Users');
  private usuarioSubject: BehaviorSubject<UsuarioGenerico | null> = new BehaviorSubject<UsuarioGenerico | null>(null);

  getUsernameByEmail(email: string): Observable<UsuarioGenerico> {
    return collectionData(this.userCollection).pipe(
      map((data : any )=> {
        
        const user = data.find((user: any) => user.Email == email);
        return user ;  // Devuelve el nombre de usuario o null si no se encuentra
      })
    );
  }
  

  getAll(): Observable<UsuarioGenerico[]> {
    return collectionData(this.userCollection, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(user => user as UsuarioGenerico);
      })
    );
  }
  guardarUsuario(user : UsuarioGenerico) : boolean {  
    localStorage.setItem('user',JSON.stringify(user));
    this.usuarioSubject.next(user);
    return true;
  }

  esAdmin() : boolean {
    const user = this.obtenerUsuario();
    return user?.Rol == "administrador";
  }
  desloguearUsuario() : boolean {  
    localStorage.removeItem('user');
    this.usuarioSubject.next(null);
    return true;
  }
  obtenerUsuario() : UsuarioGenerico | null {  
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as UsuarioGenerico;
    }
    return null;
  }

  obtenerUsuarioObs(): Observable<UsuarioGenerico | null> {
    const userStorage = localStorage.getItem('user');
    if(userStorage) {
      const user = JSON.parse(userStorage);
      this.usuarioSubject.next(user);
    }
    return this.usuarioSubject.asObservable();
  }
  toggleAccess(usuarioId: string, currentStatus: boolean): Observable<void> {
    const userDocRef = doc(this.userCollection, usuarioId);

    return new Observable<void>((observer) => {
      updateDoc(userDocRef, { Autorizado: !currentStatus })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }


}





