
import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsuarioGenerico } from '../interfaces/Usuarios';
import { HorariosService } from './horarios.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGenericoService {

  private dataRef = collection(this.fs, 'Users');

  constructor(private fs: Firestore) { }

  addData(newData: UsuarioGenerico) {
    const docs = doc(this.dataRef);
    newData.id = docs.id;
    setDoc(docs, newData);
  }

  getData(): Observable<UsuarioGenerico[]> {
    return new Observable<UsuarioGenerico[]>((observer) => {
      onSnapshot(this.dataRef, (snap) => {
        const UsuarioGrals: UsuarioGenerico[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as UsuarioGenerico;
          UsuarioGrals.push(one);
        });
        observer.next(UsuarioGrals);
      });
    });
  }

  getPacientes(): Observable<UsuarioGenerico[]> {
    const q = query(
      this.dataRef,
      where('Rol', '==', "paciente")
    );
    return new Observable<UsuarioGenerico[]>((observer) => {
      onSnapshot(q ,(snap) => {
        const UsuarioGrals: UsuarioGenerico[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as UsuarioGenerico;
          UsuarioGrals.push(one);
        });
        observer.next(UsuarioGrals);
      });
    });
  }

  
  getEpecialistas(): Observable<UsuarioGenerico[]> {
    const q = query(
      this.dataRef,
      where('Rol', '==', "especialista")
    );
    return new Observable<UsuarioGenerico[]>((observer) => {
      onSnapshot(q ,(snap) => {
        const UsuarioGrals: UsuarioGenerico[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as UsuarioGenerico;
          UsuarioGrals.push(one);
        });
        observer.next(UsuarioGrals);
      });
    });
  }
  modificar(dato: UsuarioGenerico) {
    const docs = doc(this.dataRef, dato.id);
    updateDoc(docs, {
      Nombre: dato.Nombre,
      Apellido: dato.Apellido,
      Edad: dato.Edad,
      Dni: dato.Dni,
      Email: dato.Email,
      Password: dato.Password,
      Imagen: dato.Imagen,
      Rol: dato.Rol,
      Especialidades: dato.Especialidades,
      Autorizado: dato.Autorizado,
      Imagen2: dato.Imagen2,
      ObraSocial: dato.ObraSocial,
    });
  }

  borrar(dato:UsuarioGenerico) {
    const docs = doc(this.dataRef, dato.id);
    deleteDoc(docs);
  }
}
