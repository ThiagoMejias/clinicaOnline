import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword, sendEmailVerification, user } from '@angular/fire/auth';
import {Firestore, collection,addDoc} from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Observable, from, tap } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  _userService = inject(UserService);
  router = inject(Router);
  usersCollection = collection(this.firestore, 'users');
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<User | null>(null);
  constructor() {
 
  }
 async registerUser(email: string, password: string): Promise<any> {
    return await createUserWithEmailAndPassword(this.firebaseAuth,email, password)
      .then(res => {
        sendEmailVerification(res.user);
        return res.user
      })
      .catch((error) => {   
        Swal.fire({
        position: 'center',
        icon: 'warning',
        title: this.getErrorMessage(error.code),
        showConfirmButton: false,
        timer: 1500
      }); return false });
  }






  // register(email: string, password: string, username: string): Observable<void> {
  //   const promiseUser = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(async (userCredential) => {
     
  //     const user = userCredential.user;
      
  //     const usersCollection = collection(this.firestore, 'users');
  //     await addDoc(usersCollection, {
  //       email: user.email,
  //       registrationDate: new Date(),
  //       username: username
  //     });
  //   });

  //   return from(promiseUser);
  // }

   login(email: string, password: string) : Observable<void> {
    const promiseUser = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() =>{ 
      this
      localStorage.setItem('user',email);
    });
    return from(promiseUser);
  }


  async loginUser(email: string, password: string): Promise<any> {
    try {
      const authResult = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      const user = authResult.user;
      console.log(user);  
      
      return user;
    } catch (error :any) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: this.getErrorMessage(error.code),
        showConfirmButton: false,
        timer: 1500
      })
      return null;
    }
  }

  getUser() {
    const userData = localStorage.getItem("user");
    console.log(userData);
    return userData ? userData : null;
  }

  isAuthenticated(): boolean {
    return this.currentUserSig() !== null;
  }

  signOut(): Observable<void> {
    localStorage.removeItem('user');
    return from(this.firebaseAuth.signOut()).pipe(
      tap(() => {
        this.currentUserSig.set(null);
        localStorage.removeItem('user');
      })
    );
  }


  public getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'La contraseña o el correo es invalido. Intente nuevamente';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.';
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso. Por favor, utiliza otro.';
      case 'auth/too-many-requests':
        return 'Intento demasiadas veces.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'Ocurrió un error desconocido. Por favor, inténtalo más tarde.';
    }
  }
  
}
