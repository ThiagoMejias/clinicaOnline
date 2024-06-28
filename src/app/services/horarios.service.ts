import { Injectable } from '@angular/core';
import { Firestore, QuerySnapshot, collection, doc, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialidad } from '../interfaces/Especialidad';
import { Horarios } from '../interfaces/horarios';
import { FranjaHoraria } from '../interfaces/franja-horaria';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  
  private _horariosEspecialistasColecction = collection(this.fs, 'horariosEspecialistas');

  constructor(private fs: Firestore) { }

  addEspecialidadHorarios(NuevosHoariosPorEspecialidad : Horarios) {
    const docs = doc(this._horariosEspecialistasColecction);
    setDoc(docs,NuevosHoariosPorEspecialidad);
  }






  getData(): Observable<Horarios[]> {
    return new Observable<Horarios[]>((observer) => {
      onSnapshot(this._horariosEspecialistasColecction, (snap) => {
        const Listas: Horarios[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Horarios;
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
  }
  getHorariosByEspecialista(especialistaId: string): Observable<Horarios[]> {
    return new Observable<Horarios[]>((observer) => {
      const q = query(
        this._horariosEspecialistasColecction,
        where('Especialista.id', '==', especialistaId)
      );

      onSnapshot(q , (snap: QuerySnapshot) => {
        const Listas: Horarios[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Horarios;
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
  }

  // modificar(dato: Especialidad) {
  //   const docs = doc(this._horariosEspecialistasColecction, dato.id);
  //   updateDoc(docs, {
  //     Nombre: dato.nombre,
  //   });
  // }

  
}
