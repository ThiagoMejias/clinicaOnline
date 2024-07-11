import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Coleccion } from '../interfaces/Coleccion';
import { Especialidad } from '../interfaces/Especialidad';


@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private especialidadColecction = collection(this.fs, 'especialidades');

  constructor(private fs: Firestore) { }

  addEspecialidad(nombreEspecialidad: string) {
    const docs = doc(this.especialidadColecction);
    setDoc(docs, {especialidad:  nombreEspecialidad});
  }

  getData(): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      onSnapshot(this.especialidadColecction, (snap) => {
        const Listas: string[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data()["especialidad"];
          Listas.push(one.toString());
        });
        observer.next(Listas);
      });
    });
  }

  modificar(dato: Especialidad) {
    const docs = doc(this.especialidadColecction, dato.id);
    updateDoc(docs, {
      Nombre: dato.nombre,
    });
  }

  borrar(dato: Especialidad) {
    const docs = doc(this.especialidadColecction, dato.id);
    deleteDoc(docs);
  }
}
